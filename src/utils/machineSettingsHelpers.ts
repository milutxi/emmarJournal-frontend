import {
  MachineParameterDefinition,
  MachineSetupNode,
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