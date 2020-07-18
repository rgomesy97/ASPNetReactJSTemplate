import * as React from "react";

export interface HelloProps {
    firstName: string;
    surname: string;
}

export const Home: React.FunctionComponent<HelloProps> = (props): React.ReactElement => {
    const [name, setName] = React.useState<string>(props.firstName + ' ' + props.surname),
        [textboxName, setTextBoxName] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setName(textboxName);
        setTextBoxName("");
    }

    return (
        <React.Fragment>
            <h1>
                My initial name is {props.firstName} {props.surname}! 
            </h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input"
                    value={textboxName}
                    placeholder="Add a new task"
                    onChange={e => setTextBoxName(e.target.value)}
                />
            </form>
            <p>
                My new name is: {name}
            </p>
        </React.Fragment>
    );
}

