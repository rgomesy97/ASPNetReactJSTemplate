import * as React from "react";

export interface HelloProps {
    firstName: string;
    surname: string;
}

export const Home: React.FunctionComponent<HelloProps> = (props): React.ReactElement => {
    const [name, setName] = React.useState<string>(props.firstName + ` ` + props.surname);
    return (
        <React.Fragment>
            <h1>
                My initial name is {props.firstName} {props.surname}! 
            </h1>

            <p>
                My new name is: {name}
            </p>
        </React.Fragment>
    );
}

