import { ActionFunctionArgs, Form, redirect, useActionData } from "react-router-dom";
import { ActionData } from "../../types";

export const action = async (args: ActionFunctionArgs) => {
    const { request } = args;

    const formData = await request.formData();
    
    const name = formData.get('name');
    const lastName = formData.get('lastName');
    const telephone = formData.get('telephone');
    const email = formData.get('email');
    const dateOfBirth = formData.get('dateOfBirth');

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/clients', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, lastName, telephone, email, dateOfBirth}) 
    })

    if (!response.ok) {
        const { message } = await response.json();
        return { message }
    }

    return redirect('/');
}

const CreateClient = () => {
    const error = useActionData() as ActionData;
    return (
        <div>
            <h2>Skapa en ny kund</h2>
            <Form method="post">
                { error &&  <p><b>Error: </b>{error.message}</p> }
                <div>
                    <label htmlFor="name">Kundens namn</label>
                    <input type="text" name="name" id="name" required />
                </div>
                <div>
                    <label htmlFor="lastName">Kundens efternamn</label>
                    <input type="text" name="lastName" id="lastName" required />
                </div>
                <div>
                    <label htmlFor="telephone">Telefonnummer</label>
                    <input type="text" name="telephone" id="telephone" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" />
                </div>
                <div>
                    <label htmlFor="dateOfBirth"> Födelsedatum</label>
                    <input type="date" name="dateOfBirth" id="dateOfBirth" />
                </div>
                <button type="submit">SKAPA KUND</button>

            </Form>
        </div>
    )
}

export default CreateClient;