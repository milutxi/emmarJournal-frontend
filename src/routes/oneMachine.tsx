import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import { Machine } from "../types";
import styles from "./oneMachine.module.scss";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/machine/" + id,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  return response.json();
};
const formatDate = (date: Date | string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (!isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat("sv-SE").format(parsedDate);
  }

  return "-";
};

const OneMachine = () => {
  const machine = useLoaderData() as Machine;

  const isLeasing = machine.mStartLeasingDate || machine.mFinishLeasingDate;

  return (
    <div className={styles.oneMachineStyle}>
      {/* LEFT SIDE */}
      <div className={styles["oneMachineStyle__left"]}>
        <div className={styles["oneMachineStyle__card"]}>
          <h1 className={styles["oneMachineStyle__name"]}>{machine.mName}</h1>

          <div className={styles["oneMachineStyle__mainInfo"]}>
            <p>
              <span>Modell</span>
              {machine.mModelNumber || "-"}
            </p>

            <p>
              <span>Serienummer</span>
              {machine.mSerialNumber || "-"}
            </p>
          </div>

          <div className={styles["oneMachineStyle__divider"]}></div>

          <div className={styles["oneMachineStyle__secondaryInfo"]}>
            <p>
              <span>Tillverkare</span>
              {machine.mManufactureCompany || "-"}
            </p>

            <p>
              <span>Tillverkningsår</span>
              {formatDate(machine.mManufactureYear)}
            </p>
          </div>
          <div className={styles["oneMachineStyle__divider"]}></div>

          <div className={styles["oneMachineStyle__description"]}>
            <span>Beskrivning</span>

            <div className={styles["oneMachineStyle__textBox"]}>
              {machine.mDescription || "Ingen beskrivning tillgänglig."}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles["oneMachineStyle__right"]}>
        <section className={styles["oneMachineStyle__section"]}>
          <h3>Anskaffning</h3>
          {isLeasing ? (
            <div className={styles["oneMachineStyle__infoGroup"]}>
                <p>
                  <span>Typ:</span> LEASING
                </p>
              <div className={styles["oneMachineStyle__inlineInfo"]}>

                <p>
                  <span>Startdatum:</span>
                  {formatDate(machine.mStartLeasingDate)}
                </p>

                <p>
                  <span>Slutdatum:</span>
                  {formatDate(machine.mFinishLeasingDate)}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles["oneMachineStyle__infoGroup"]}>
              <div className={styles["oneMachineStyle__inlineInfo"]}>
                <p>
                  <span>Typ:</span> KÖP
                </p>

                <p>
                  <span>Inköpsdatum:</span>
                  {formatDate(machine.mPurchaseDate)}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Kommentarer</h3>
          <div className={styles["oneMachineStyle__textBox"]}>
            {machine.mComments || "Inga kommentarer tillgängliga."}
          </div>
        </section>

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Lokal Service</h3>
          <div className={styles["oneMachineStyle__inlineInfo"]}>
            <p>
              <span>Datum:</span>
              {formatDate(machine.mServiceLokalDate)}
            </p>
            <p>
              <span>Nästa servicedatum:</span>
              {formatDate(machine.mServiceLokalNextDate)}
            </p>
          </div>
          <div className={styles["oneMachineStyle__textBox"]}>
            {machine.mCommentsLokalService || "Inga kommentarer för lokal service."}
          </div>
        </section>

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Tillverkarservice</h3>
          <div className={styles["oneMachineStyle__inlineInfo"]}>
            <p>
              <span>Datum:</span>
              {formatDate(machine.mServiceManufactureDate)}
            </p>
            <p>
              <span>Nästa servicedatum:</span>
              {formatDate(machine.mServiceManufactureNextDate)}
            </p>
          </div>
          <div className={styles["oneMachineStyle__textBox"]}>
            {machine.mCommentsManufactureService ||
              "Inga kommentarer för tillverkarservice."}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OneMachine;
