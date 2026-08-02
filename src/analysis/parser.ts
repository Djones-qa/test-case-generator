export interface Parameter {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
}

export interface FunctionSignature {
  name: string;
  params: Parameter[];
  returnType: string;
  hasAsync: boolean;
}

function parseParams(paramString: string): Parameter[] {
  if (!paramString.trim()) return [];

  const params: Parameter[] = [];
  let depth = 0;
  let current = '';

  for (const char of paramString) {
    if (char === '<' || char === '(' || char === '{' || char === '[') depth++;
    if (char === '>' || char === ')' || char === '}' || char === ']') depth--;
    if (char === ',' && depth === 0) {
      params.push(parseOneParam(current.trim()));
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    params.push(parseOneParam(current.trim()));
  }

  return params;
}

function parseOneParam(param: string): Parameter {
  const optional = param.includes('?');
  const cleanParam = param.replace('?', '');

  let name: string;
  let type = 'unknown';
  let defaultValue: string | undefined;

  if (cleanParam.includes('=')) {
    const [declaration, defVal] = cleanParam.split('=').map((s) => s.trim());
    defaultValue = defVal;
    if (declaration.includes(':')) {
      [name, type] = declaration.split(':').map((s) => s.trim());
    } else {
      name = declaration;
    }
  } else if (cleanParam.includes(':')) {
    [name, type] = cleanParam.split(':').map((s) => s.trim());
  } else {
    name = cleanParam;
  }

  return { name, type, optional, defaultValue };
}

export function parseFunctions(code: string): FunctionSignature[] {
  const signatures: FunctionSignature[] = [];

  // Match named function declarations
  const funcRegex =
    /(?:export\s+)?(?:(async)\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*([^\s{]+))?\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = funcRegex.exec(code)) !== null) {
    const hasAsync = match[1] === 'async';
    const name = match[2];
    const paramString = match[3];
    const returnType = match[4] || 'void';

    signatures.push({
      name,
      params: parseParams(paramString),
      returnType,
      hasAsync,
    });
  }

  // Match arrow function declarations
  const arrowRegex =
    /(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:(async)\s+)?\(([^)]*)\)\s*(?::\s*([^\s=>]+))?\s*=>/g;

  while ((match = arrowRegex.exec(code)) !== null) {
    const name = match[1];
    const hasAsync = match[2] === 'async';
    const paramString = match[3];
    const returnType = match[4] || 'void';

    signatures.push({
      name,
      params: parseParams(paramString),
      returnType,
      hasAsync,
    });
  }

  return signatures;
}
