// TODO: Fix double compile on webpack initial run
const fs = require('fs');
const ts = require('typescript');
const process = require('process');
const path = require('path');
const webpack = require('webpack');

const parts = process.cwd().split(path.sep);
const project = parts[parts.length - 1];
const watchers = {};

const recursivelyFindTsConfig = (filePath, fileName) => {
    const configPath = path.join(filePath, fileName);
    const configFile = require(configPath);
    if (configFile.extends) {
        const extendedOptions = recursivelyFindTsConfig(path.join(configPath, '../'), configFile.extends);
        return {
          ...extendedOptions,
          ...configFile,
            compilerOptions: {
              ...extendedOptions.compilerOptions,
              ...configFile.compilerOptions
            }
        }
    } else {
        return configFile
    }
};

const tsConfig = recursivelyFindTsConfig(process.cwd(), 'tsconfig.json');

const jsxTagNameMap = {
    'default': ts.JsxEmit.Preserve,
    'none': ts.JsxEmit.None,
    'preserve': ts.JsxEmit.Preserve,
    'react': ts.JsxEmit.React,
    'react-native': ts.JsxEmit.ReactNative,
};
const moduleTagNameMap = {
    'default': ts.ModuleKind.ESNext,
    'none': ts.ModuleKind.None,
    'commonjs': ts.ModuleKind.CommonJS,
    'amd': ts.ModuleKind.AMD,
    'system': ts.ModuleKind.System,
    'umd': ts.ModuleKind.UMD,
    'es6': ts.ModuleKind.ES2015,
    'es2015': ts.ModuleKind.ES2015,
    'esnext': ts.ModuleKind.ESNext
}
const moduleResolutionTagNameMap = {
    'default': ts.ModuleResolutionKind.NodeJs,
    'classic': ts.ModuleResolutionKind.Classic,
    'node': ts.ModuleResolutionKind.NodeJs
}
const newLineTagNameMap = {
    'default': ts.NewLineKind.LineFeed,
    'crlf': ts.NewLineKind.CarriageReturnLineFeed,
    'lf': ts.NewLineKind.LineFeed
}
const targetTagNameMap = {
    'default': ts.ScriptTarget.Latest,
    'es3': ts.ScriptTarget.ES3,
    'es5': ts.ScriptTarget.ES5,
    'es2015': ts.ScriptTarget.ES2015,
    'es2016': ts.ScriptTarget.ES2016,
    'es2017': ts.ScriptTarget.ES2017,
    'es2018': ts.ScriptTarget.ES2018,
    'es2019': ts.ScriptTarget.ES2019,
    'es2020': ts.ScriptTarget.ES2020,
    'esnext': ts.ScriptTarget.ESNext,
    'json': ts.ScriptTarget.JSON,
    'latest': ts.ScriptTarget.Latest
}

const decodeTagName = (tagName, map) => {
    const key = tagName ? tagName.toLowerCase() : 'default';
    return map[key];
}

/**
 * Handles conversion of certain tsconfig.json items to the appropriate Enum values.
 * If some values are not specified they may not be parsed correctly by tsc
 */
const getTsCompilerOptions = (tsConfig) => {
    const overrideOptions = {
        noEmitOnError: false
    };
    if (tsConfig.jsx) {
        overrideOptions.jsx = decodeTagName(tsConfig.jsx, jsxTagNameMap);
    }
    if (tsConfig.module) {
        overrideOptions.module = decodeTagName(tsConfig.module, moduleTagNameMap);
    }
    if (tsConfig.moduleResolution) {
        overrideOptions.moduleResolution = decodeTagName(tsConfig.moduleResolution, moduleResolutionTagNameMap);
    }
    if (tsConfig.newLine) {
        overrideOptions.newLine = decodeTagName(tsConfig.newLine, newLineTagNameMap);
    }
    if (tsConfig.target) {
        overrideOptions.target = decodeTagName(tsConfig.target, targetTagNameMap);
    }

    return {
      ...tsConfig,
      ...overrideOptions
    }
}

const colouredString = (str, colour) => {
    // Wraps the text in foreground colour code followed by a colour reset code
    switch (colour) {
        case 'GREEN':
            return `\x1b[92m${str}\x1b[0m`;
        case 'RED':
            return `\x1b[31m${str}\x1b[0m`;
        case 'MAGENTA':
            return `\x1b[31m${str}\x1b[0m`;
        default:
            // Two reset codes
            return `\x1b[0m${str}\x1b[0m`;
    }
}

const updateProgress = (str, isOwnLine) => {
    // Overwrite previous line if possible, else just write on a new line
    process.stdout.clearLine ? process.stdout.clearLine() : process.stdout.write('\n'); 
    process.stdout.cursorTo && process.stdout.cursorTo(0);
    process.stdout.write(str);
    if (isOwnLine) {
        process.stdout.write('\n');
    } 
}

function tsWatch(rootFileNames, options) {
    const files = {};
    let processedFiles = 1;
  
    // initialize the list of files
    rootFileNames.forEach(fileName => {
        files[fileName] = { version: 0 };
    });
  
    // Create the language service host to allow the LS to communicate with the host
    const servicesHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: fileName =>
            files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: fileName => {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }
  
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory
    };
  
    // Create the language service files
    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
  
    // Now let's watch the files
    rootFileNames.forEach((fileName, index) => {
        // First time around, emit all files
        emitFile(fileName, index >= rootFileNames.length - 1);
  
        // IIFE to capture the filename AND path because fs.watch doesn't provide the full file path
        // and we don't want to be subject to name conflicts
        (() => {
            const closureFileName = fileName;
            // Add a watch on the file to handle next change
            watchers[closureFileName] = fs.watch(closureFileName, { persistent: true }, (event, file) => {
                if (event === 'change' && !!file) {
                    files[closureFileName].version++;
  
                    emitFile(closureFileName, true, `Detected change in ${closureFileName}, recompiling...`);
                }
            });
        })();
    });
  
    function emitFile(fileName, isSingleUpdate = false, customMessage = null) {
        let output = services.getEmitOutput(fileName);
  
        if (!output.emitSkipped) {
            updateProgress(customMessage || `Emitted ${processedFiles++} of ${rootFileNames.length} files: ${fileName}`, isSingleUpdate);
        } else {
            processedFiles++;
            console.log(`Emitting file ${processedFiles}, ${fileName} failed`);
            logErrors(fileName);
        }
  
        output.outputFiles.forEach(o => {
            const containingFolder = path.dirname(o.name);
            if (!fs.existsSync(containingFolder)) {
                fs.mkdirSync(containingFolder, { recursive: true });
            }
        
            fs.writeFileSync(o.name, o.text, { encoding: "utf8" });
        });
    }
  
        function logErrors(fileName) {
            let allDiagnostics = services
              .getCompilerOptionsDiagnostics()
              .concat(services.getSyntacticDiagnostics(fileName))
              .concat(services.getSemanticDiagnostics(fileName));
  
            allDiagnostics.forEach(diagnostic => {
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                if (diagnostic.file) {
                    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                      diagnostic.start
                    );
                    console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character +1}): ${message}`);
                } else {
                    console.log(`  Error: ${message}`);
                }
            });
        }

        return services;
    }
  
    // Initialize files constituting the program as all .ts files in the current directory
    const tsFiles = [];
    const recursivelyFindTsFiles = (dirPath) => {
        // Don't run if we're at root level
        if (dirPath === '/' || dirPath === 'C:\\') { return }
        if (dirPath.split(path.sep).length < 3) { return }

        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file, index) => {
                const current = path.join(dirPath, file);
                const isNodeModules = current.match(/(node_modules)/) !== null;

                if (!isNodeModules) {
                    if (fs.lstatSync(current).isDirectory()) {
                        recursivelyFindTsFiles(current);
                    } else {
                        const matches = current.match(/(?<!\.d)(\.tsx?)$/i);
                        if (matches !== null) {
                            tsFiles.push(current);
                        }
                    }
                }
            });
        }
    }
    console.log(colouredString(`Searching for .ts & .tsx files to watch...`, 'GREEN'));
    recursivelyFindTsFiles(process.cwd());
    console.log(colouredString(`Found ${tsFiles.length} files.`, 'GREEN'));

    const tscOptions = getTsCompilerOptions(tsConfig.compilerOptions);
    // Start the watcher
    console.log(colouredString(`Starting tsc watch...`, 'GREEN'));
    const tsWatchService = tsWatch(tsFiles, tscOptions);
    console.log(colouredString(`Finished setting up tsc watch.`, 'GREEN'));

    console.log(colouredString(`Starting webpack watch and running initial compile...`, 'GREEN'));
    let webpackConfig = require(path.join(process.cwd(), 'webpack.config.js'));
    webpackConfig = typeof webpackConfig === 'function' ? webpackConfig() : webpackConfig;

    const copyToOutputDirPlugin = new webpack.ProgressPlugin((percentage, msg) => {
        if (percentage >= 1) {
            const filename = webpackConfig.output.filename;
            const mainFile = path.join(webpackConfig.output.path, filename);
            const mapFile = `${mainFile}.map`;
            const outputDir = path.join(__dirname, 'Extensions', project.replace('DataExporter.Extensions.', ''), 'Scripts');

            fs.copyFile(mainFile, path.join(outputDir, filename), (err) => {
                if (err) {
                    throw err;
                }
                console.log(colouredString(`Successfully copied ${filename} to ${outputDir}`, 'GREEN'));
            });
            fs.copyFile(mapFile, path.join(outputDir, `${filename}.map`), (err) => {
                if (err) {
                    throw err;
                }
                console.log(colouredString(`Successfully copied ${filename}.map to ${outputDir}`, 'GREEN'));
            });
        }
    });

    if (!(project.toLowerCase() === 'dataexporter')) {
        if (webpackConfig.plugins && webpackConfig.plugins.length) {
            webpackConfig.plugins.push(copyToOutputDirPlugin);
        } else {
            webpackConfig.plugins = [copyToOutputDirPlugin];
        }
    }

    const compiler = webpack(webpackConfig);
    const webpackWatcher = compiler.watch({}, (err, stats) => {
        if (stats !== null) {
            updateProgress('', true);
            console.log(stats.toString({ colors: true }));
        } else if (err !== null) {
            console.log(colouredString(err.toString(), 'RED'));
        } else {
            console.log(colouredString(`Something went wrong! Check watcher.js!`, 'MAGENTA'));
        }
    });

    // Register handler to close programs on quit
    ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'].forEach(signal => {
        process.on(signal, () => {
            console.log(`Closing watchers...`);
            if (watchers) {
                for (let key in watchers) {
                    watchers[key].close();
                }
            }

            if (webpackWatcher) {
                webpackWatcher.close();
            }
        })
    })