import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { useRoutes } from "hookrouter";
import { routes } from './routes'

function App() {
    const routeResult = useRoutes(routes);
    return routeResult;
}

ReactDOM.render(<App />, document.getElementById("root"));