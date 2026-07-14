import { useParams } from "react-router-dom";

const EditTreatmentSession = () => {
  const { id, journalId } = useParams();

  return (
    <div>
      <h1>Redigera session</h1>
      <p>Client ID: {id}</p>
      <p>Journal ID: {journalId}</p>
    </div>
  );
};

export default EditTreatmentSession;