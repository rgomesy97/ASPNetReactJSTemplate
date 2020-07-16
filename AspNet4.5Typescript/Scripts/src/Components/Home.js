import * as React from "react";
export var Home = function (props) {
    var _a = React.useState(props.firstName + " " + props.surname), name = _a[0], setName = _a[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null,
            "My initial name is ",
            props.firstName,
            " ",
            props.surname,
            "!"),
        React.createElement("p", null,
            "My new name is: ",
            name)));
};
//# sourceMappingURL=Home.js.map