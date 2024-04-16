
export type CSSPseudoSyntaxType = 'NoArgument' | 'Formula' | 'String' | 'FormulaOfSelector' | 'Selector';

export const pseudoCSSSyntax = {
  NoArgument: [
      'any-link',
      'local-link',
      'target-within',
      'scope',
      'current',
      'past',
      'future',
      'focus-within',
      'focus-visible',
      'read-write',
      'read-only',
      'placeholder-shown',
      'default',
      'valid',
      'invalid',
      'in-range',
      'out-of-range',
      'required',
      'optional',
      'blank',
      'user-invalid'
  ],
  Formula: ['nth-col', 'nth-last-col'],
  String: ['dir'],
  FormulaOfSelector: ['nth-child', 'nth-last-child'],
  Selector: ['current', 'is', 'where', 'has']
};

export function deduceFromName(name: string): CSSPseudoSyntaxType {
  if (pseudoCSSSyntax.NoArgument.includes(name)) {
    return 'NoArgument';
  } else if (pseudoCSSSyntax.Formula.includes(name)) {
    return 'Formula';
  } else if (pseudoCSSSyntax.String.includes(name)) {
    return 'String';
  } else if (pseudoCSSSyntax.FormulaOfSelector.includes(name)) {
    return 'FormulaOfSelector';
  } else if (pseudoCSSSyntax.Selector.includes(name)) {
    return 'Selector';
  } else {
    return 'NoArgument'; // TODO: check if this is correct
  }
}
