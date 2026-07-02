import styles from "./consentFormModal.module.scss";

import {
  Client,
  ConsentFormType,
  Treatment,
  TreatmentSession,
} from "../../types";

import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  consentForm: ConsentFormType;
  setConsentForm: React.Dispatch<React.SetStateAction<ConsentFormType>>;
  setConsentFormCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  sessionDate: string;
  client: Client;
  treatmentSessions: TreatmentSession[];
  treatments: Treatment[];
};
const ConsentFormModal = ({
  isOpen,
  onClose,
  consentForm,
  setConsentForm,
  setConsentFormCompleted,

  sessionDate,
  client,
  treatmentSessions,
  treatments,
}: Props) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  if (!isOpen) return null;

  const handleSaveConsentForm = async () => {
    if (!consentForm.accepted) {
      alert("Du måste acceptera samtycket.");
      return;
    }

    //const signature = signatureRef.current;

    let signatureImage = consentForm.signatureImage;

    if (!signatureImage) {
      const signature = signatureRef.current;

      if (!signature || signature.isEmpty()) {
        alert("Signatur saknas.");
        return;
      }

      signatureImage = signature.toDataURL();
    }
    const payload = {
      clientId: client._id,
      treatmentIds: treatmentSessions.map((session) => session.treatmentId),
      consentText: `Jag har fått information om den planerade behandlingen, dess syfte, möjliga risker, 
      biverkningar och rekommenderad eftervård.
      Jag har haft möjlighet att ställa frågor och har fått svar som jag förstår.`,
      accepted: consentForm.accepted,
      signatureImage,
      signedAt: new Date().toISOString(),
    };
    console.log("Consent payload:", payload);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/consentForm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const savedConsentForm = await response.json();

    if (!response.ok) {
      console.error(savedConsentForm);
      alert("Kunde inte spara samtycket.");
      return;
    }

    setConsentForm(
      //{
      // ...consentForm,
      // signatureImage,
      // signedAt: new Date().toISOString(),
      //}
      savedConsentForm,
    );

    setConsentFormCompleted(true);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
          <h2 className={styles.title}>Samtyckesformulär</h2>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.documentHeader}>
            <p>
              <strong>Datum:</strong> {sessionDate}
            </p>

            <p>
              <strong>Kund:</strong> {client.name} {client.lastName}
            </p>
          </div>

          <div className={styles.treatmentSection}>
            <h4>Behandlingar</h4>

            <ul>
              {treatmentSessions.map((session) => {
                const treatment = treatments.find(
                  (t) => t._id === session.treatmentId,
                );

                return <li key={session.treatmentId}>{treatment?.tname}</li>;
              })}
            </ul>
          </div>

          <div className={styles.consentText}>
            <p>
              Jag har fått information om den planerade behandlingen, dess
              syfte, möjliga risker, biverkningar och rekommenderad eftervård.
            </p>
            <p>
              Jag har haft möjlighet att ställa frågor och har fått svar som jag
              förstår.
            </p>

            <div className={styles.acceptSection}>
              <input
                type="checkbox"
                checked={consentForm.accepted}
                onChange={(e) =>
                  setConsentForm({
                    ...consentForm,
                    accepted: e.target.checked,
                  })
                }
              />
              <label>
                Jag samtycker till att ovanstående behandlingar utförs.
              </label>
            </div>
          </div>

          <div className={styles.signatureSection}>
            <label>Klientens signatur</label>
            <div className={styles.signatureWrapper}>
              {consentForm.signatureImage ? (
                <div className={styles.signaturePreview}>
                  <img src={consentForm.signatureImage} alt="Signatur" />

                  <button
                    type="button"
                    onClick={() => {
                      setConsentForm({
                        ...consentForm,
                        signatureImage: "",
                        signedAt: undefined,
                      });

                      signatureRef.current?.clear();
                    }}
                  >
                    Ny signatur
                  </button>
                </div>
              ) : (
                <>
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                      className: styles.signatureCanvas,
                      width: 500,
                      height: 200,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => signatureRef.current?.clear()}
                  >
                    Rensa signatur
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.buttonSection}>
            <button className={styles.cancelButton} onClick={onClose}>
              Avbryt
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSaveConsentForm}
            >
              Spara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormModal;
