
import { ActionFunctionArgs, Form, redirect, useActionData } from "react-router-dom"
import { ActionData } from "../../types"
import { FaCompassDrafting } from "react-icons/fa6";

export const action = async (args: ActionFunctionArgs) => {
    const { request } = args;

    const formData = await request.formData();

    const mName = formData.get('machineName');
    const mManufactureCompany = formData.get('machineManufactureCompany');
    const mManufactureYear = formData.get('machineManufactureYear');
    const mModelNumber = formData.get('machineModelNumber');
    const mSerialNumber = formData.get('machineSerialNumber');
    const mDescription = formData.get('description');
    const mComments = formData.get('comments');
    const mStartLeasingDate = formData.get('startLeasingContract');
    const mFinishLeasingDate = formData.get('finishLeasingContract');

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/machine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mName, 
            mManufactureCompany, 
            mManufactureYear,
            mModelNumber,
            mSerialNumber,
            mDescription,
            mComments,
            mStartLeasingDate,
            mFinishLeasingDate
        })
    })

    if (!response.ok) {
        const { message } = await response.json();
        return { message }
    }

    return redirect('/machines')
}

const CreateMachine = () => {
    const error = useActionData() as ActionData;
    return(
        <div>
            <h2>Skapa en ny maskin</h2>
            <Form method="post">
                {error && <p><b>Error: </b>{error.message}</p>}
                <div>
                    <label htmlFor="machineName">Maskines namn</label>
                    <input type="text" name="machineName" id="machineName" required />
                </div>
                <div>
                    <label htmlFor="machineManufactureCompany">Manufacture Company</label>
                    <input type="text" name="machineManufactureCompany" id="machineManufactureCompany" />
                </div>
                <div>
                    <label htmlFor="machineManufactureYear">Manufacture Year</label>
                    <input type="number" name="machineManufactureYear" id="machineManufactureYear" />
                </div>
                <div>
                    <label htmlFor="machineModelNumber">Model Number</label>
                    <input type="text" name="machineModelNumber" id="machineModelNumber" />
                </div>
                <div>
                    <label htmlFor="machineSerialNumber">Serial Number</label>
                    <input type="text" name="machineSerialNumber" id="machineSerialNumber" />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" />
                </div>
                <div>
                    <label htmlFor="comments">Comments</label>
                    <input type="text" name="comments" id="comments" />
                </div>
                <div>
                    <label htmlFor="startLeasingContract">Start Datum Leasing Avtal</label>
                    <input type="date" name="startLeasingContract" id="startLeasingContract" />
                </div>
                <div>
                    <label htmlFor="finishLeasingContract">Finish Datum Leasing Avtal</label>
                    <input type="date" name="finishLeasingContract" id="finishLeasingContract" />
                </div>
                <button type="submit">SKAPA MASKIN</button>

            </Form>
        </div>
    )
}

export default CreateMachine;