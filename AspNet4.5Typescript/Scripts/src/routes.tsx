import * as React from "react";
import { Home } from "./Components/Home";
import { About } from "./Components/About";

export const routes = {
    "/": () =>
        <Home
            firstName={`Ryan`}
            surname={`Test`}
        />,
    "/Home/Home2": () => <About />,
};