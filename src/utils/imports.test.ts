import { Imports } from './imports';

describe('The Imports class', () => {
  describe('addImport function', () => {
    test("adds an import if it doesn't previously exist", () => {
      const imports = new Imports();
      imports.addImport('test', ['one']);
      expect(imports.imports).toMatchObject({
        test: ['one'],
      });
    });

    test('merges individual components if the import has already been added using component style', () => {
      const imports = new Imports();
      imports.addImport('test', ['one']);
      expect(imports.imports).toMatchObject({
        test: ['one'],
      });

      imports.addImport('test', ['two']);
      expect(imports.imports).toMatchObject({
        test: ['one', 'two'],
      });
    });
  });
});
