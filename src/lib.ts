import Papa from "papaparse";

export function charToNumericIndex(char: string) {
  return char.toLowerCase().charCodeAt(0) - 97;
}

const LETTERS_IN_ALPHABET = 26;
export function lettersToNumericIndex(letters: string) {
  return letters
    .split("")
    .map((char, i) => {
      const numericIndex = charToNumericIndex(char);
      const place = letters.length - i;

      if (place === 1) return numericIndex;
      return (numericIndex + 1) * (place - 1) * LETTERS_IN_ALPHABET;
    })
    .reduce((acc, curr) => acc + curr, 0);
}

function getLettersIndex(input: string) {
  let i = 0;
  for (const char of input) {
    if (isLetter(char)) {
      i++;
    }
    return i;
  }
}

function isLetter(char: string) {
  return char.toLowerCase() !== char.toUpperCase();
}

export function cellToIndices(cell: string) {
  const lettersIndex = getLettersIndex(cell);
  const colLetters = cell.slice(0, lettersIndex);
  const rowNumber = parseInt(cell.slice(lettersIndex));
  if (isNaN(rowNumber)) throw new Error(`Invalid cell: ${cell}`);

  const rowIndex = rowNumber - 1;
  const colIndex = lettersToNumericIndex(colLetters);

  return { row: rowIndex, col: colIndex };
}

export function rangeToIndices(range: string) {
  const [start, end] = range.split(":");
  if (!start || !end) throw new Error("Invalid range");

  return {
    start: cellToIndices(start),
    end: cellToIndices(end),
  };
}

export function parseCSV(file: File): Promise<Papa.ParseResult<string[]>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: resolve,
      error: reject,
    });
  });
}

export function objectToCSV<T = unknown>(data: T[]): string {
  return Papa.unparse(data);
}

export function downloadCSV(csv: string, fileName: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
