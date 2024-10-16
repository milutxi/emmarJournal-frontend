import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { Machine } from "../types";
import styles from "./oneMachine.module.scss";

export const loader = async (args: LoaderFunctionArgs) => {
  const { params } = args;

  const { id } = params;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/machine/" + id,
    {
      headers: {
        Accepts: "apllication/json",
      },
    }
  );

  return response.json();
};

const formatDate = (date: Date | string) => {
  // If the input is already a Date object, just format it
  if (date instanceof Date) {
    return new Intl.DateTimeFormat("en-US").format(date);
  } else {
    // If it's a string, parse it into a Date object first
    const parsedDate = new Date(date);
    // Check if parsing was successful
    if (!isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat("en-US").format(parsedDate);
    } else {
      // Return the original string if parsing failed
      return date;
    }
  }
};

const OneMachine = () => {
  const machine = useLoaderData() as Machine;

  return (
    <div className={styles.oneMachineStyle}>
      <div className={styles["oneMachineStyle__header"]}>
        <div className={styles["oneMachineStyle__left"]}>
          <h2>Name: {machine.mName}</h2>
          <div>Model: {machine.mModelNumber}</div>
          <div>Serial: {machine.mSerialNumber} </div>
        </div>
        <div className={styles["oneMachineStyle__right"]}>
          <div>Company: {machine.mManufactureCompany}</div>
          <div>Year: {formatDate(machine.mManufactureYear)}</div>
        </div>
      </div>
      <div className={styles["oneMachineStyle__description"]}>
        Description:
        <div className={styles["oneMachineStyle__descriptionText"]}>
          {machine.mDescription}
        </div>
      </div>

      <section className={styles["oneMachineStyle__adquisition"]}>
        <div className={styles["oneMachineStyle__AdquisitionHeader"]}>
          <h4>Adquisition:</h4>
        </div>
        <div className={styles["oneMachineStyle__adquisitionWrap"]}>
          <div>
            <input type="checkbox" name="purchase" value="no"></input>
            PURCHASE:
            <div>{formatDate(machine.mPurchaseDate)}</div>
          </div>
          <div>
            <input type="checkbox" name="purchase" value="no"></input>
            LEASING:
            <div>
              Start Date: {formatDate(machine.mStartLeasingDate)}
              Finish Date: {formatDate(machine.mFinishLeasingDate)}
            </div>
          </div>
        </div>
      </section>
      <section className={styles["oneMachineStyle__service"]}>
        <div className={styles["oneMachineStyle__serviceHeader"]}>
          <h4>Service:</h4>
        </div>
        <div className={styles["oneMachineStyle__serviceWrap"]}>
          <div>
            <h6>LOCAL SERVICE:</h6>
            <div>
              <ul className={styles["oneMachineStyle__serviceLocalDate"]}>
                Date:
                <li>
                  {formatDate(machine.mServiceLokalDate)} -{" "}
                  {machine.mCommentsLokalService}
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h6>MANUFACTURE SERVICE:</h6>
          </div>
          <div>
            <ul className={styles["oneMachineStyle__serviceManufactureDate"]}>
              Date:
              <li>
                {formatDate(machine.mServiceManufactureDate)} -{" "}
                {machine.mCommentsManufactureService}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OneMachine;
