import * as React from "react";
export var Home = function (props) {
    var _a = React.useState(props.firstName + ' ' + props.surname), name = _a[0], setName = _a[1], _b = React.useState(""), textboxName = _b[0], setTextBoxName = _b[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        setName(textboxName);
        setTextBoxName("");
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null,
            "My initial name is ",
            props.firstName,
            " ",
            props.surname,
            "!"),
        React.createElement("form", { onSubmit: handleSubmit },
            React.createElement("input", { type: "text", className: "input", value: textboxName, placeholder: "Add a new task", onChange: function (e) { return setTextBoxName(e.target.value); } })),
        React.createElement("p", null,
            "My new name is: ",
            name)));
};
//# sourceMappingURL=Home.js.map