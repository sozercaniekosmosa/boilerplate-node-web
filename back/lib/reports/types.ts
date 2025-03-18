interface TExcelFont {
    name: string;
    size: number;
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    underline?: boolean;
    color?: { argb: string };
}

interface TExcelBorder {
    style: string;
    color: { argb: string };
}

interface TExcelStyle {
    font?: TExcelFont;
    alignment?: {
        horizontal: string;
        vertical: string;
        wrapText?: boolean;
    };
    fill?: {
        type: string;
        pattern: string;
        fgColor: { argb: string };
    };
    border?: Record<string, TExcelBorder>;
}

interface TBorderValue {
    style?: string;
    color?: string
}


interface TBorder {
    [key: string]: TBorderValue | string[];
}

interface TCellStyle {
    font?: {
        name?: string;
        size?: number;
        bold?: boolean;
        italic?: boolean;
        color?: string;
    };
    align?: string;
    valign?: string;
    textwrap?: boolean;
    strike?: boolean;
    underline?: boolean;
    bgcolor?: string;
    border?: TBorder;
}

interface TCellData {
    text: string;
    style?: number;
    merge?: [number, number];
}

interface TCells {
    [key: string]: TCellData;
}

interface TRow {
    cells: TCells;
}

interface TRows {
    [key: number]: TRow;

    len: number;
}

interface TCols {
    len: number;
}

interface TSheetData {
    styles: Record<number, TCellStyle>;
    name: string;
    freeze: string;
    merges: any[];
    rows: TRows;
    cols: TCols;
    validations: any[];
    autofilter: {};
}