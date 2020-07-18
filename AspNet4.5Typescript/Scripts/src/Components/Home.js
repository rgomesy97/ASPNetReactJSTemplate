import * as React from "react";
export const Home = (props) => {
    const [name, setName] = React.useState(props.firstName + ' ' + props.surname), [textboxName, setTextBoxName] = React.useState("");
    const handleSubmit = (e) => {
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
            React.createElement("input", { type: "text", className: "input", value: textboxName, placeholder: "Add a new task", onChange: e => setTextBoxName(e.target.value) })),
        React.createElement("p", null,
            "My new name is: ",
            name)));
};
//# sourceMappingURL=Home.js.map