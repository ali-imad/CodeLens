// Constants for cleaning generated code
import * as ts from 'typescript';

export const START_TOKEN = '[[[START]]]';
export const END_TOKEN = '[[[END]]]';

export function cleanGenCodeNoToken(generatedFunction: string) {
  const start = generatedFunction.indexOf('function');
  const end = generatedFunction.lastIndexOf('}');
  generatedFunction = generatedFunction.substring(start, end);
  return generatedFunction;
}

// Removes the start and end tokens from the generated code
export function cleanGenCodeWithToken(
  generatedFunction: string,
  start_token: string,
  end_token: string,
) {
  const start = generatedFunction.indexOf(start_token);
  const end = generatedFunction.indexOf(end_token);
  generatedFunction = generatedFunction
    .substring(start, end)
    .replace(start_token, '')
    .replace(end_token, '');
  return generatedFunction;
}

// Enum for the language of the function
export enum Language {
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  None = 'None',
}

// Returns the language of the function based on the type hinting
export function getLanguage(fnStr: string): Language {
  if (containsTypeHinting(fnStr)) return Language.TypeScript;

  try {
    new Function(fnStr);
    return Language.JavaScript;
  } catch (error) {
    return Language.None;
  }
}

// Helper function that checks if the function contains type hinting
function containsTypeHinting(fnStr: string): boolean {
  // Regular expression to match type annotations in parameters and return types
  const typeHintingRegex = /:\s*\w+|\):\s*\w+\s*=>/;
  return typeHintingRegex.test(fnStr);
}

// Transpiles TypeScript code to JavaScript code
export function transpile(tsCode: string): string {
  // Use the transpileModule function from the TypeScript API
  const result = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      noImplicitAny: true,
    },
  });

  return result.outputText;
}

// Ensures code is suitable for execution by equivalence runner
export function cleanCode(fnStr: string): string {
  if (getLanguage(fnStr) === Language.None) {
    throw new Error('Invalid function string');
  }

  if (getLanguage(fnStr) === Language.TypeScript) {
    fnStr = transpile(fnStr);
  }

  return fnStr.trim();
}
