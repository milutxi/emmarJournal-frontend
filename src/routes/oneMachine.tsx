import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import { Machine } from "../types";
import styles from "./oneMachine.module.scss";
import { useState } from "react";

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
  const loadedMachine = useLoaderData() as Machine;

  const [machine, setMachine] = useState(loadedMachine);
  const [editSection, setEditSection] = useState<string | null>(null);

  const updateMachine = async (update: Partial<Machine>) => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/machine/" + machine._id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      },
    );
    if (!response.ok) throw new Error("Update failed");
    return response.json();
  };

  const [basicForm, setBasicForm] = useState({
    mName: machine.mName,
    mModelNumber: machine.mModelNumber,
    mSerialNumber: machine.mSerialNumber,
    mManufactureCompany: machine.mManufactureCompany,
    mManufactureYear: machine.mManufactureYear,
    mDescription: machine.mDescription,
  });

  const [acquisitionForm, setAcquisitionForm] = useState({
    acquisitionType: machine.acquisitionType,
    mStartLeasingDate: machine.mStartLeasingDate,
    mFinishLeasingDate: machine.mFinishLeasingDate,
    mPurchaseDate: machine.mPurchaseDate,
  });
  const isLeasing =
    editSection === "acquisition"
      ? acquisitionForm.acquisitionType === "leasing"
      : machine.acquisitionType === "leasing";

  const [commentsForm, setCommentsForm] = useState({
    requiresTreatmentParameters: machine.requiresTreatmentParameters,
    mComments: machine.mComments,
  });

  const [localServiceForm, setLocalServiceForm] = useState({
    mServiceLokalDate: machine.mServiceLokalDate,
    mServiceLokalNextDate: machine.mServiceLokalNextDate,
    mCommentsLokalService: machine.mCommentsLokalService,
  });

  const [manufacturerServiceForm, setManufacturerServiceForm] = useState({
    mServiceManufactureDate: machine.mServiceManufactureDate,
    mServiceManufactureNextDate: machine.mServiceManufactureNextDate,
    mCommentsManufactureService: machine.mCommentsManufactureService,
  });

  return (
    <div className={styles.oneMachineStyle}>
      {/* LEFT SIDE */}
      <div className={styles["oneMachineStyle__left"]}>
        <div className={styles["oneMachineStyle__card"]}>
          {/* <h1 className={styles["oneMachineStyle__name"]}>{machine.mName}</h1> */}
          {editSection === "basic" ? (
            <input
              type="text"
              value={basicForm.mName}
              onChange={(e) =>
                setBasicForm({
                  ...basicForm,
                  mName: e.target.value,
                })
              }
            />
          ) : (
            <h1 className={styles["oneMachineStyle__name"]}>{machine.mName}</h1>
          )}

          <div className={styles["oneMachineStyle__mainInfo"]}>
            <p>
              <span>Modell</span>
              {editSection === "basic" ? (
                <input
                  type="text"
                  value={basicForm.mModelNumber}
                  onChange={(e) =>
                    setBasicForm({
                      ...basicForm,
                      mModelNumber: e.target.value,
                    })
                  }
                />
              ) : (
                machine.mModelNumber || "-"
              )}
            </p>

            <p>
              <span>Serienummer</span>
              {editSection === "basic" ? (
                <input
                  type="text"
                  value={basicForm.mSerialNumber}
                  onChange={(e) =>
                    setBasicForm({
                      ...basicForm,
                      mSerialNumber: e.target.value,
                    })
                  }
                />
              ) : (
                machine.mSerialNumber || "-"
              )}
            </p>
          </div>

          <div className={styles["oneMachineStyle__divider"]}></div>

          <div className={styles["oneMachineStyle__secondaryInfo"]}>
            <p>
              <span>Tillverkare</span>
              {editSection === "basic" ? (
                <input
                  type="text"
                  value={basicForm.mManufactureCompany}
                  onChange={(e) =>
                    setBasicForm({
                      ...basicForm,
                      mManufactureCompany: e.target.value,
                    })
                  }
                />
              ) : (
                machine.mManufactureCompany || "-"
              )}
            </p>

            <p>
              <span>Tillverkningsår</span>
              {editSection === "basic" ? (
                <input
                  type="date"
                  value={
                    basicForm.mManufactureYear
                      ? new Date(basicForm.mManufactureYear)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setBasicForm({
                      ...basicForm,
                      mManufactureYear: e.target.value,
                    })
                  }
                />
              ) : (
                formatDate(machine.mManufactureYear)
              )}
            </p>
          </div>
          <div className={styles["oneMachineStyle__divider"]}></div>

          <div className={styles["oneMachineStyle__description"]}>
            <span>Beskrivning</span>

            <div className={styles["oneMachineStyle__textBox"]}>
              {editSection === "basic" ? (
                <textarea
                  value={basicForm.mDescription}
                  onChange={(e) =>
                    setBasicForm({
                      ...basicForm,
                      mDescription: e.target.value,
                    })
                  }
                />
              ) : (
                machine.mDescription || "Ingen beskrivning tillgänglig."
              )}
            </div>
          </div>

          {editSection === "basic" ? (
            <div>
              <button
                onClick={async () => {
                  try {
                    const updatedMachine = await updateMachine(basicForm);
                    setMachine(updatedMachine);
                    setEditSection(null);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Spara
              </button>

              <button onClick={() => setEditSection(null)}>Avbryt</button>
            </div>
          ) : (
            <button onClick={() => setEditSection("basic")}>Redigera</button>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles["oneMachineStyle__right"]}>
        {/* <section className={styles["oneMachineStyle__section"]}>
          <h3>Anskaffning</h3>
          {isLeasing ? (
            <div className={styles["oneMachineStyle__infoGroup"]}>
              <p>
                <span>Typ:</span> LEASING
              </p>
              <div className={styles["oneMachineStyle__inlineInfo"]}>
                <p>
                  <span>Startdatum:</span>

                  {editSection === "acquisition" && (
                     <div className={styles.acquisitionSelector}>

                    <input
                      type="date"
                      value={
                        acquisitionForm.mStartLeasingDate
                        ? new Date(acquisitionForm.mStartLeasingDate)
                        .toISOString()
                        .split("T")[0]
                        : ""
                      }
                      onChange={(e) =>
                        setAcquisitionForm({
                          ...acquisitionForm,
                          mStartLeasingDate: e.target.value,
                        })
                      }
                      />
                  ) : (
                    formatDate(machine.mStartLeasingDate)
                  </div>
                  )}
                </p>

<p>
                  <span>Slutdatum:</span>
                  {editSection === "acquisition" && (
                    <div className={styles.acquisitionSelector}>

                    <input
                      type="date"
                      value={
                        acquisitionForm.mFinishLeasingDate
                        ? new Date(acquisitionForm.mFinishLeasingDate)
                        .toISOString()
                        .split("T")[0]
                        : ""
                      }
                      onChange={(e) =>
                        setAcquisitionForm({
                          ...acquisitionForm,
                          mFinishLeasingDate: e.target.value,
                        })
                      }
                      />
                  ) : (
                    formatDate(machine.mFinishLeasingDate)
                      </div>
                  )}
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
                  {editSection === "acquisition" && (
                    <div className={styles.acquisitionSelector}>

                    <input
                      type="date"
                      value={
                        acquisitionForm.mPurchaseDate
                        ? new Date(acquisitionForm.mPurchaseDate)
                        .toISOString()
                        .split("T")[0]
                        : ""
                      }
                      onChange={(e) =>
                        setAcquisitionForm({
                          ...acquisitionForm,
                          mPurchaseDate: e.target.value,
                        })
                      }
                      />
                  ) : (
                    formatDate(machine.mPurchaseDate)
                      </div>
                  )}
                </p>
              </div>
            </div>
          )}

          {editSection === "acquisition" ? (
            <div>
              <button
                onClick={async () => {
                  try {
                    const updatedMachine = await updateMachine(acquisitionForm);
                    setMachine(updatedMachine);
                    setEditSection(null);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Spara
              </button>

              <button onClick={() => setEditSection(null)}>Avbryt</button>
            </div>
          ) : (
            <button onClick={() => setEditSection("acquisition")}>
              Redigera
            </button>
          )}
        </section> */}

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Anskaffning</h3>

          {editSection === "acquisition" ? (
            <>
              {/* EDIT MODE */}
              <div className={styles.acquisitionSelector}>
                <label>
                  <input
                    type="radio"
                    name="acquisitionType"
                    checked={acquisitionForm.acquisitionType === "purchase"}
                    onChange={() =>
                      setAcquisitionForm({
                        ...acquisitionForm,
                        acquisitionType: "purchase",
                        mStartLeasingDate: "",
                        mFinishLeasingDate: "",
                      })
                    }
                  />
                  Köp
                </label>

                <label>
                  <input
                    type="radio"
                    name="acquisitionType"
                    checked={acquisitionForm.acquisitionType === "leasing"}
                    onChange={() =>
                      setAcquisitionForm({
                        ...acquisitionForm,
                        acquisitionType: "leasing",
                        mPurchaseDate: "",
                      })
                    }
                  />
                  Leasing
                </label>
              </div>
              {/* IF ACQUISITION FORM IS LEASING SHOW BOTH START AND FINISH DATE */}
              {acquisitionForm.acquisitionType === "leasing" ? (
                <div className={styles["oneMachineStyle__inlineInfo"]}>
                  <p>
                    <span>Startdatum:</span>
                    <input
                      type="date"
                      value={
                        acquisitionForm.mStartLeasingDate
                          ? new Date(acquisitionForm.mStartLeasingDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setAcquisitionForm({
                          ...acquisitionForm,
                          mStartLeasingDate: e.target.value,
                        })
                      }
                    />
                  </p>

                  <p>
                    <span>Slutdatum:</span>
                    <input
                      type="date"
                      value={
                        acquisitionForm.mFinishLeasingDate
                          ? new Date(acquisitionForm.mFinishLeasingDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setAcquisitionForm({
                          ...acquisitionForm,
                          mFinishLeasingDate: e.target.value,
                        })
                      }
                    />
                  </p>
                </div>
              ) : (
                // IF NOT LEASING FORM, IT IS PURCHASE, THEN SHOW THE PURCHASE DATE
                <p>
                  <span>Inköpsdatum:</span>
                  <input
                    type="date"
                    value={
                      acquisitionForm.mPurchaseDate
                        ? new Date(acquisitionForm.mPurchaseDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setAcquisitionForm({
                        ...acquisitionForm,
                        mPurchaseDate: e.target.value,
                      })
                    }
                  />
                </p>
              )}

              <div>
                <button
                  onClick={async () => {
                    try {
                      const updatedMachine =
                        await updateMachine(acquisitionForm);
                      setMachine(updatedMachine);
                      setEditSection(null);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Spara
                </button>

                <button onClick={() => setEditSection(null)}>Avbryt</button>
              </div>
            </>
          ) : (
            <>
              {/* DISPLAY MODE */}

              <div className={styles["oneMachineStyle__infoGroup"]}>
                <p>
                  <span>Typ:</span> {/* LEASING INFO */}
                  {machine.acquisitionType === "leasing" ? "LEASING" : "KÖP"}
                </p>

                {machine.acquisitionType === "leasing" ? (
                  <div className={styles["oneMachineStyle__inlineInfo"]}>
                    <p>
                      <span>Startdatum:</span>{" "}
                      {formatDate(machine.mStartLeasingDate)}
                    </p>

                    <p>
                      <span>Slutdatum:</span>{" "}
                      {formatDate(machine.mFinishLeasingDate)}
                    </p>
                  </div>
                ) : (
                  <p>
                    <span>Inköpsdatum:</span> {/* IF NOT PURCHASE INFO */}
                    {formatDate(machine.mPurchaseDate)}
                  </p>
                )}
              </div>

              <button onClick={() => setEditSection("acquisition")}>
                Redigera
              </button>
            </>
          )}
        </section>

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Kommentarer</h3>
          <div className={styles["oneMachineStyle__textBox"]}>
            {editSection === "comments" ? (
              <textarea
                value={commentsForm.mComments}
                onChange={(e) =>
                  setCommentsForm({
                    ...commentsForm,
                    mComments: e.target.value,
                  })
                }
              />
            ) : (
              machine.mComments || "Ingen kommentarer tillgängliga."
            )}
          </div>

          {editSection === "comments" ? (
            <div>
              <button
                onClick={async () => {
                  try {
                    const updatedMachine = await updateMachine(commentsForm);
                    setMachine(updatedMachine);
                    setEditSection(null);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Spara
              </button>

              <button onClick={() => setEditSection(null)}>Avbryt</button>
            </div>
          ) : (
            <button onClick={() => setEditSection("comments")}>Redigera</button>
          )}
        </section>

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Lokal Service</h3>
          <div className={styles["oneMachineStyle__inlineInfo"]}>
            <p>
              <span>Datum:</span>
              {editSection === "localService" ? (
                <input
                  type="date"
                  value={
                    localServiceForm.mServiceLokalDate
                      ? new Date(localServiceForm.mServiceLokalDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setLocalServiceForm({
                      ...localServiceForm,
                      mServiceLokalDate: e.target.value,
                    })
                  }
                />
              ) : (
                formatDate(machine.mServiceLokalDate)
              )}
            </p>
            <p>
              <span>Nästa servicedatum:</span>
              {editSection === "localService" ? (
                <input
                  type="date"
                  value={
                    localServiceForm.mServiceLokalNextDate
                      ? new Date(localServiceForm.mServiceLokalNextDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setLocalServiceForm({
                      ...localServiceForm,
                      mServiceLokalNextDate: e.target.value,
                    })
                  }
                />
              ) : (
                formatDate(machine.mServiceLokalNextDate)
              )}
            </p>
          </div>
          <div className={styles["oneMachineStyle__textBox"]}>
            {editSection === "localService" ? (
              <textarea
                value={localServiceForm.mCommentsLokalService}
                onChange={(e) =>
                  setLocalServiceForm({
                    ...localServiceForm,
                    mCommentsLokalService: e.target.value,
                  })
                }
              />
            ) : (
              machine.mCommentsLokalService ||
              "Inga kommentarer för lokal service."
            )}
          </div>

          {editSection === "localService" ? (
            <div>
              <button
                onClick={async () => {
                  try {
                    const updatedMachine =
                      await updateMachine(localServiceForm);
                    setMachine(updatedMachine);
                    setEditSection(null);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Spara
              </button>

              <button onClick={() => setEditSection(null)}>Avbryt</button>
            </div>
          ) : (
            <button onClick={() => setEditSection("localService")}>
              Redigera
            </button>
          )}
        </section>

        <section className={styles["oneMachineStyle__section"]}>
          <h3>Tillverkarservice</h3>
          <div className={styles["oneMachineStyle__inlineInfo"]}>
            <p>
              <span>Datum:</span>
              {editSection === "manufacturerService" ? (
                <input
                  type="date"
                  value={
                    manufacturerServiceForm.mServiceManufactureDate
                      ? new Date(
                          manufacturerServiceForm.mServiceManufactureDate,
                        )
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setManufacturerServiceForm({
                      ...manufacturerServiceForm,
                      mServiceManufactureDate: e.target.value,
                    })
                  }
                />
              ) : (
                formatDate(machine.mServiceManufactureDate)
              )}
            </p>
            <p>
              <span>Nästa servicedatum:</span>
              {editSection === "manufacturerService" ? (
                <input
                  type="date"
                  value={
                    manufacturerServiceForm.mServiceManufactureNextDate
                      ? new Date(
                          manufacturerServiceForm.mServiceManufactureNextDate,
                        )
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setManufacturerServiceForm({
                      ...manufacturerServiceForm,
                      mServiceManufactureNextDate: e.target.value,
                    })
                  }
                />
              ) : (
                formatDate(machine.mServiceManufactureNextDate)
              )}
            </p>
          </div>
          <div className={styles["oneMachineStyle__textBox"]}>
            {editSection === "manufacturerService" ? (
              <textarea
                value={manufacturerServiceForm.mCommentsManufactureService}
                onChange={(e) =>
                  setManufacturerServiceForm({
                    ...manufacturerServiceForm,
                    mCommentsManufactureService: e.target.value,
                  })
                }
              />
            ) : (
              machine.mCommentsManufactureService ||
              "Inga kommentarer för tillverkarservice."
            )}
          </div>

          {editSection === "manufacturerService" ? (
            <div>
              <button
                onClick={async () => {
                  try {
                    const updatedMachine = await updateMachine(
                      manufacturerServiceForm,
                    );
                    setMachine(updatedMachine);
                    setEditSection(null);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Spara
              </button>

              <button onClick={() => setEditSection(null)}>Avbryt</button>
            </div>
          ) : (
            <button onClick={() => setEditSection("manufacturerService")}>
              Redigera
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default OneMachine;
