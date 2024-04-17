import { SelectorType } from "../selectors";

export const noSpaceAfterSelectors = [
  SelectorType.Namespace,
  SelectorType.SelectorSeparator,
  SelectorType.ChildFollowedBy,
];

export const allowedSelectorsBeforeNamespace = [
  SelectorType.Element,
  SelectorType.SelectAll,
  SelectorType.SelectorSeparator,
];

export const mustBeFollowedBySelector = [
  SelectorType.Namespace,
  SelectorType.ChildFollowedBy,
];

export const mustBePrefixedWithElement = [
  //SelectorType.ChildFollowedBy,
  SelectorType.SelectorSeparator,
];
