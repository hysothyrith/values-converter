import {
  Button,
  FileCard,
  FileUploader,
  Heading,
  majorScale,
  MimeType,
  Pane,
  TextInputField,
  toaster,
} from "evergreen-ui";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import "./App.css";
import { downloadCSV, objectToCSV, parseCSV, rangeToIndices } from "./lib";

interface ParseState {
  status: "idle" | "pending" | "success" | "error";
  result: Awaited<ReturnType<typeof parseCSV>> | null;
}

function splitAndGrab(input: string): string {
  return input.split(".")[0];
}

function transformValue(input: string): string {
  return splitAndGrab(input);
}

function cloneObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [parseState, setParseState] = useState<ParseState>({
    status: "idle",
    result: null,
  });
  const [ranges, setRanges] = useState<ReturnType<typeof rangeToIndices>[]>([]);

  const isLoading = parseState.status === "pending";
  const isRangeInvalid =
    parseState.result &&
    parseState.result.data.length > 0 &&
    ranges.some(({ start, end }) => {
      const { row: startRow, col: startCol } = start;
      const { row: endRow, col: endCol } = end;

      return (
        endCol >= parseState.result!.data[0].length ||
        endRow >= parseState.result!.data.length ||
        startCol < 0 ||
        startRow < 0 ||
        endCol < 0 ||
        endRow < 0 ||
        startCol > endCol ||
        startRow > endRow
      );
    });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file || !parseState.result || parseState.status !== "success") return;

    const data = cloneObject(parseState.result.data);
    for (const { start, end } of ranges) {
      const { row: startRow, col: startCol } = start;
      const { row: endRow, col: endCol } = end;

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          data[row][col] = transformValue(data[row][col]);
        }
      }
    }

    const convertedData = objectToCSV(data);
    downloadCSV(convertedData, `${file.name} - converted.csv`);
    toaster.success("Successfully converted file");
  }

  function handleUpload(files: File[]) {
    if (!files.length) return;
    const [file] = files;

    setFile(file);
    setRanges([]);
    setParseState({ ...parseState, status: "pending" });
    parseCSV(file)
      .then((result) => {
        setParseState({ ...parseState, status: "success", result });
      })
      .catch(() => setParseState({ ...parseState, status: "error" }));
  }

  function handleRangeChange(event: ChangeEvent<HTMLInputElement>) {
    try {
      setRanges(
        event.target.value
          .split(",")
          .map((range) => rangeToIndices(range.trim()))
      );
    } catch (error) {
      setRanges([]);
    }
  }

  return (
    <div className="app">
      <main className="main">
        <Pane marginY={majorScale(4)}>
          <Heading size={800} is="h1">
            Values Converter
          </Heading>
        </Pane>
        <form onSubmit={handleSubmit}>
          <FileUploader
            label="Upload Form Response File"
            description="The file should be a CSV file downloaded from a form response Google Sheet."
            maxFiles={1}
            onChange={handleUpload}
            acceptedMimeTypes={[MimeType.csv]}
          />

          {file ? (
            <>
              <FileCard
                name={file.name}
                sizeInBytes={file.size}
                type={file.type}
              />
              <TextInputField
                label="Range(s) to convert"
                placeholder="Ex: A1:B2"
                hint="Select the cells you’d like to convert and copy its range from Google Sheets."
                required
                onChange={handleRangeChange}
                style={{ borderColor: "threedlightshadow" }}
              />
              <Button
                type="submit"
                disabled={
                  !file || !ranges.length || isRangeInvalid || isLoading
                }
                appearance="primary"
              >
                Convert
              </Button>
            </>
          ) : null}
        </form>
      </main>
      <footer className="footer">
        <small>&copy; {new Date().getFullYear()} Hy Sothyrith</small>
      </footer>
    </div>
  );
}

export default App;
