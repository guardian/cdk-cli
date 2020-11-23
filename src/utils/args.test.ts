import { parse, validate, Config } from './args';
import fs from 'fs';

describe('The parse function', () => {
  const args = {
    args: {
      template: 'template',
      output: '/path/to/output.ts',
      stack: 'stack',
    },
  };

  test('pulls outs template, output and stack args', () => {
    expect(parse(args)).toMatchObject({
      cfnPath: 'template',
      outputPath: '/path/to/output.ts',
      stackName: 'stack',
    });
  });

  test('pulls outs output dir correctly', () => {
    expect(parse(args)).toMatchObject({
      outputDir: '/path/to',
    });
  });

  test('pulls outs output file correctly', () => {
    expect(parse(args)).toMatchObject({
      outputFile: 'output.ts',
    });
  });
});

describe('The validate function', () => {
  const existsPath = './I-DO-EXIST.md';
  const doesNotExistPath = './I-DONT-EXIST.md';

  beforeAll(() => {
    if (!fs.existsSync(existsPath)) {
      fs.writeFileSync(existsPath, 'test');
    }

    if (fs.existsSync(doesNotExistPath)) {
      throw new Error(
        `The file ${doesNotExistPath} should not exist as it will cause tests to fail. Either remove the file or change the "doesNotExistPath" value in "args.test.ts"`
      );
    }
  });

  afterAll(() => {
    if (fs.existsSync(existsPath)) {
      fs.unlinkSync(existsPath);
    }
  });

  test('does nothing if the file does exist', () => {
    expect(() => validate({ cfnPath: existsPath } as Config)).not.toThrow();
  });

  test('throws an error if the file does not exist', () => {
    expect(() => validate({ cfnPath: doesNotExistPath } as Config)).toThrow(
      'File not found - ./I-DONT-EXIST.md'
    );
  });
});
