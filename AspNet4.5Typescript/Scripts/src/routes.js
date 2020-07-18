import * as React from "react";
import { Home } from "./Components/Home";
import { About } from "./Components/About";
export const routes = {
    "/": () => React.createElement(Home, { firstName: `Ryan`, surname: `Test` }),
    "/Home/Home2": () => React.createElement(About, null),
};
//# sourceMappingURL=routes.js.map