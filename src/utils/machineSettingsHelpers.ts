import {
  MachineParameterDefinition,
  MachineSetupNode,
  MachineSetting,
} from "../types";

export const cleanParameterDefinitions = (
  parameters: MachineParameterDefinition[],
): MachineParameterDefinition[] => {
  return parameters
    .filter((parameter) => parameter.label.trim())
    .map((parameter) => ({
      label: parameter.label.trim(),
      unit: parameter.unit?.trim() ?? "",
    }));
};

export const addParameterDefinition = (
  parameters: MachineParameterDefinition[],
): MachineParameterDefinition[] => {
  return [...parameters, { label: "", unit: "" }];
};

export const updateParameterDefinition = (
  parameters: MachineParameterDefinition[],
  index: number,
  key: "label" | "unit",
  value: string,
): MachineParameterDefinition[] => {
  return parameters.map((parameter, parameterIndex) =>
    parameterIndex === index
      ? {
          ...parameter,
          [key]: value,
        }
      : parameter,
  );
};

export const removeParameterDefinition = (
  parameters: MachineParameterDefinition[],
  index: number,
): MachineParameterDefinition[] => {
  return parameters.filter((_, parameterIndex) => parameterIndex !== index);
};

export const cleanSetupMenu = (
  nodes: MachineSetupNode[],
): MachineSetupNode[] => {
  return nodes
    .filter((node) => node.label.trim())
    .map((node) => ({
      label: node.label.trim(),
      children: cleanSetupMenu(node.children ?? []),
    }));
};

export const updateNodeLabel = (
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

export const addChildNode = (
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

export const removeNode = (
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

export const updateParameterValue = (
  machineSettings: MachineSetting[],
  machineSettingIndex: number,
  parameterIndex: number,
  value: string,
): MachineSetting[] => {
  return machineSettings.map((setting, settingIndex) => {
    if (settingIndex !== machineSettingIndex) return setting;

    return{
      ...setting,
      parameters: setting.parameters.map((parameter, currentParameterIndex) =>
        currentParameterIndex === parameterIndex  
          ? {
            ...parameter,
            value,
          }
          : parameter,
      ),
    };
  });
};

export const updateSetupPath = (
  machineSettings: MachineSetting[],
  machineSettingIndex: number,
  setupPath: string[],
): MachineSetting[] => {
  return machineSettings.map((setting, settingIndex) => {
    if (settingIndex !== machineSettingIndex) return setting;

    return {
      ...setting,
      setupPath,
    };
  });
};

export const getSetupLevels = (
  setupMenu: MachineSetupNode[],
  selectedPath: string[],
): MachineSetupNode[][] => {
  const levels: MachineSetupNode[][] = [];

  let currentNodes = setupMenu;

  while (currentNodes.length > 0) {
    levels.push(currentNodes);

    const selectedLabel = selectedPath[levels.length - 1];

    if(!selectedLabel) break;

    const selectedNode = currentNodes.find(
      (node) => node.label === selectedLabel,
    );

    currentNodes = selectedNode?.children ?? [];
  }

  return levels;
};

export const updateMachineSettingComment = (
  machineSettings: MachineSetting[],
  machineSettingIndex: number,
  comment: string,
): MachineSetting[] => {
  return machineSettings.map((setting, settingIndex) => {
    if (settingIndex !== machineSettingIndex) return setting;

    return {
      ...setting,
      comment,
    };
  });
};