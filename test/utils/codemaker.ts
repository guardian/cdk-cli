import type { CodeMaker } from "codemaker";

export class MockCodeMaker {
  _codemaker: Record<string, jest.Mock> = {
    line: jest.fn(),
    openBlock: jest.fn(),
    closeBlock: jest.fn(),
    indent: jest.fn(),
    unindent: jest.fn(),
    openFile: jest.fn(),
    closeFile: jest.fn(),
    save: jest.fn(),
  };

  codemaker = (this._codemaker as unknown) as CodeMaker;

  clear(): void {
    Object.keys(this._codemaker).forEach((key) =>
      this._codemaker[key].mockClear()
    );
  }
}
