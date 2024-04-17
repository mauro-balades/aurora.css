import { SelectorType } from "../selectors";

export const noSpaceAfterSelectors = [
  SelectorType.Namespace,
  SelectorType.SelectorSeparator,
];

export const allowedSelectorsBeforeNamespace = [
  SelectorType.Element,
  SelectorType.SelectAll,
  SelectorType.SelectorSeparator,
];
