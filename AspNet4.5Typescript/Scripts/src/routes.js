import * as React from "react";
import { Home } from "./Components/Home";
import { About } from "./Components/About";
export var routes = {
    "/": function () {
        return React.createElement(Home, { firstName: "Ryan", surname: "Test" });
    },
    "/Home/Home2": function () { return React.createElement(About, null); },
};
//# sourceMappingURL=routes.js.map