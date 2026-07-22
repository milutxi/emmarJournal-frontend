import { Dispatch, SetStateAction } from "react";
import { CreateMachineForm, MachineSetupNode } from "../../../types";
import styles from "../createMachineModal.module.scss";

type Props = {
  formData: CreateMachineForm;
  setFormData: Dispatch<SetStateAction<CreateMachineForm>>;
};

const updateNodeLabel = (
  nodes: MachineSetupNode[],
  path: number[],
  value: string,
): MachineSetupNode[] => {
  return nodes.map((node, index) => {
    if (index !== path[0]) return node;

    if (path.length === 1) {
      return {
        ...node,
        label: value,
      };
    }

    return {
      ...node,
      children: updateNodeLabel(node.children ?? [], path.slice(1), value),
    };
  });
};

const addChildNode = (
  nodes: MachineSetupNode[],
  path: number[],
): MachineSetupNode[] => {
  return nodes.map((node, index) => {
    if (index !== path[0]) return node;

    if (path.length === 1) {
      return {
        ...node,
        children: [...(node.children ?? []), { label: "", children: [] }],
      };
    }

    return {
      ...node,
      children: addChildNode(node.children ?? [], path.slice(1)),
    };
  });
};

const removeNode = (
  nodes: MachineSetupNode[],
  path: number[],
): MachineSetupNode[] => {
  if (path.length === 1) {
    return nodes.filter((_, index) => index !== path[0]);
  }

  return nodes.map((node, index) => {
    if (index !== path[0]) return node;

    return {
      ...node,
      children: removeNode(node.children ?? [], path.slice(1)),
    };
  });
};

const SettingsStep = ({ formData, setFormData }: Props) => {
  const hasSetupMenu = formData.setupMenu.length > 0;

  const handleSetupRequirementChange = (needsSetup: boolean) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      setupMenu: needsSetup
        ? currentFormData.setupMenu.length > 0
          ? currentFormData.setupMenu
          : [{ label: "", children: [] }]
        : [],
    }));
  };

  const addTopLevelMenuItem = () => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      setupMenu: [...currentFormData.setupMenu, { label: "", children: [] }],
    }));
  };

  const updateSetupMenuItem = (path: number[], value: string) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      setupMenu: updateNodeLabel(currentFormData.setupMenu, path, value),
    }));
  };

  const addSubMenuItem = (path: number[]) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      setupMenu: addChildNode(currentFormData.setupMenu, path),
    }));
  };

  const removeSetupMenuItem = (path: number[]) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      setupMenu: removeNode(currentFormData.setupMenu, path),
    }));
  };

  const renderSetupNode = (
    node: MachineSetupNode,
    path: number[],
    level: number,
  ) => {
    return (
      <div key={path.join("-")} className={styles.setupMenuNode}>
        <div
          className={styles.setupMenuRow}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <input
            type="text"
            aria-label="Menyval"
            placeholder={
              level === 0 ? "T.ex. Hårborttagning" : "T.ex. Ansikte"
            }
            value={node.label}
            onChange={(event) =>
              updateSetupMenuItem(path, event.target.value)
            }
          />

          <div className={styles.setupMenuActions}>
            <button
              type="button"
              className={styles.subMenuButton}
              onClick={() => addSubMenuItem(path)}
            >
              + Submeny
            </button>

            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeSetupMenuItem(path)}
            >
              Ta bort
            </button>
          </div>
        </div>

        {(node.children ?? []).map((child, childIndex) =>
          renderSetupNode(child, [...path, childIndex], level + 1),
        )}
      </div>
    );
  };

  return (
    <div className={styles.formSection}>
      <h2>SETUP / MENY</h2>

      <div className={styles.inputGroup}>

        <p className={styles.helperText}>
          Lägg till maskinens setup-val, till exempel behandlingsområde,
          program eller menyval som ska väljas i journalen.
        </p>
      </div>

      <div className={styles.settingsSelector}>
        <span>Behöver maskinen setup/menu?</span>
        <label className={styles.settingsOption}>
          <input
            type="radio"
            name="needsSetupMenu"
            checked={hasSetupMenu}
            onChange={() => handleSetupRequirementChange(true)}
          />
          Ja
        </label>

        <label className={styles.settingsOption}>
          <input
            type="radio"
            name="needsSetupMenu"
            checked={!hasSetupMenu}
            onChange={() => handleSetupRequirementChange(false)}
          />
          Nej
        </label>
      </div>

      {hasSetupMenu && (
        <div className={styles.setupMenuList}>
          {formData.setupMenu.map((item, index) =>
            renderSetupNode(item, [index], 0),
          )}

          <button
            type="button"
            className={styles.addButton}
            onClick={addTopLevelMenuItem}
          >
            + Lägg till menyval
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsStep;