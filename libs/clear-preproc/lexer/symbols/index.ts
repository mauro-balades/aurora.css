
export class Symbols {
    public static readonly LEFT_BRACE: string = '{'
    public static readonly RIGHT_BRACE: string = '}'

    public static readonly LEFT_ROUND: string = '('
    public static readonly RIGHT_ROUND: string = ')'

    public static readonly COLON: string = ':'
    public static readonly SEMI_COLON: string = ';'

    public static readonly NEW_LINE: string = '\n'
    public static readonly TAB: string = '    '
    public static readonly SPACE: string = ' '

    public static readonly COMMA: string = ','
    public static readonly EQUAL: string = '='
    public static readonly UNION: string = '-'
    public static readonly DOT: string = '.'
    public static readonly AT: string = '@'

    public static readonly KEYWORDS: Array<string> = [this.LEFT_BRACE, this.RIGHT_BRACE, this.NEW_LINE, this.TAB, this.COLON,
        this.SEMI_COLON, this.SPACE, this.RIGHT_ROUND, this.LEFT_ROUND, this.COMMA, this.EQUAL]

}