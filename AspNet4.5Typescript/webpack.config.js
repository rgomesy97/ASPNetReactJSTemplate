const path = require('path');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        mode: 'development',
        stats: { modules: false },
        entry: {
            index: "./Scripts/src/app.js",
        },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            path: path.resolve(__dirname, "./dist"),
            filename: "[name].js"
        },
        devtool: 'sourcemap',
        module: {
        rules: [
            {
                use: [{
                    loader: "babel-loader"
                },{
                loader: 'source-map-loader'
            }],
                test: /\.js|\.ts|\.tsx$/,
                exclude: /node_modules/ //excludes node_modules folder from being transpiled by babel. We do this because it's a waste of resources to do so.
            }
        ]
        }
    }];
};