import styles from "../createMachineModal.module.scss";

type Props = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export default function BasicInfoStep({
  formData,
  setFormData,
}: Props) {
  return (
<div className={styles.formSection}>
              <h2>Grundinformation</h2>
              <div className={styles.rowOne}>
                <div className={styles.inputGroup}>
                  <label>Namn</label>

                  <input
                    type="text"
                    value={formData.mName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Modellnummer</label>

                  <input
                    type="text"
                    value={formData.mModelNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mModelNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Serienummer</label>

                  <input
                    type="text"
                    value={formData.mSerialNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mSerialNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.rowTwo}>
                <div className={styles.inputGroup}>
                  <label>Tillverkare</label>

                  <input
                    type="text"
                    value={formData.mManufactureCompany}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mManufactureCompany: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Tillverkningsår</label>

                  <input
                    type="date"
                    value={formData.mManufactureYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mManufactureYear: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Beskrivning</label>

                <textarea
                  rows={5}
                  value={formData.mDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>

   
  );
}