// import { ActionFunctionArgs, Form, redirect, useActionData } from "react-router-dom";
import { ActionData } from "../types";
import { Form, useActionData } from "react-router-dom";

// export const action = async ({request, params } ActionFunctionArgs) => {
//     // const { request } = args;

//     const formData = await request.formData();
//     const { id } = params
    
//     const name = formData.get('name');
//     const lastName = formData.get('lastName');
//     const telephone = formData.get('telephone');
//     const email = formData.get('email');
//     const dateOfBirth = formData.get('dateOfBirth');

//     const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/clients', { 
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({name, lastName, telephone, email, dateOfBirth}) 
//     })

//     if (!response.ok) {
//         const { message } = await response.json();
//         return { message }
//     }

//     return redirect('/clients/' + id);
// }

const EditClient = () => {
    const error = useActionData() as ActionData;
    return (
        <div>
            <h2>Skapa en ny kund</h2>
            <Form method="put">
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
                <button type="submit">UPDATERA KUND</button>

            </Form>
        </div>
    )
}

export default EditClient;