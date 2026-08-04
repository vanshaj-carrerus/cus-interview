export type ProblemTestCase = {
  sampleInput: string;
  expectedOutput: string;
};

export type ValidationResult = "correct" | "wrong" | "unchecked";

export type ProblemContext = {
  questionId: string | null;
  questionText: string;
  sampleInput: string;
  expectedOutput: string;
  hasAutoCheck: boolean;
};

type SupportedLanguage = "javascript" | "python" | "java" | "cpp";

function normalizeOutput(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function parseExpectedTokens(expectedOutput: string): string[] {
  const lines = expectedOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines.map((line) => line.toLowerCase());
  }

  return normalizeOutput(expectedOutput)
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
}

function isNumericToken(token: string): boolean {
  return /^-?\d+(?:\.\d+)?$/.test(token);
}

function isBooleanToken(token: string): boolean {
  return token === "true" || token === "false";
}

function tokensShareType(expected: string[], actual: string[]): boolean {
  if (expected.every(isBooleanToken)) {
    return actual.every(isBooleanToken);
  }

  if (expected.every(isNumericToken)) {
    return actual.every(isNumericToken);
  }

  return true;
}

function findTokensInOrder(actual: string, expectedTokens: string[]): boolean {
  let searchFrom = 0;
  const lowerActual = actual.toLowerCase();

  for (const token of expectedTokens) {
    if (isBooleanToken(token)) {
      const pattern = new RegExp(`\\b${token}\\b`, "i");
      const match = pattern.exec(lowerActual.slice(searchFrom));
      if (!match) return false;
      searchFrom += match.index + match[0].length;
      continue;
    }

    if (isNumericToken(token)) {
      const pattern = new RegExp(`(?<![\\d.])${escapeRegex(token)}(?![\\d.])`);
      const match = pattern.exec(lowerActual.slice(searchFrom));
      if (!match) return false;
      searchFrom += match.index + match[0].length;
      continue;
    }

    const index = lowerActual.indexOf(token, searchFrom);
    if (index === -1) return false;
    searchFrom = index + token.length;
  }

  return true;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractOrderedTokens(actual: string, expectedTokens: string[]): string[] {
  const found: string[] = [];
  let searchFrom = 0;
  const lowerActual = actual.toLowerCase();

  for (const token of expectedTokens) {
    if (isBooleanToken(token)) {
      const pattern = new RegExp(`\\b(true|false)\\b`, "i");
      const match = pattern.exec(lowerActual.slice(searchFrom));
      if (!match) return [];
      found.push(match[0].toLowerCase());
      searchFrom += match.index + match[0].length;
      continue;
    }

    if (isNumericToken(token)) {
      const pattern = /-?\d+(?:\.\d+)?/g;
      pattern.lastIndex = searchFrom;
      const match = pattern.exec(lowerActual);
      if (!match) return [];
      found.push(match[0]);
      searchFrom = match.index + match[0].length;
      continue;
    }

    const index = lowerActual.indexOf(token, searchFrom);
    if (index === -1) return [];
    found.push(token);
    searchFrom = index + token.length;
  }

  return found;
}

function numericSetsMatch(expected: string[], actual: string[]): boolean {
  if (!expected.every(isNumericToken) || !actual.every(isNumericToken)) {
    return false;
  }

  if (expected.length !== actual.length) return false;

  const expectedNumbers = expected.map(Number).sort((a, b) => a - b);
  const actualNumbers = actual.map(Number).sort((a, b) => a - b);

  return expectedNumbers.every((value, index) => value === actualNumbers[index]);
}

function flexibleOutputMatches(
  stdout: string,
  expectedOutput: string,
  questionText?: string
): boolean {
  const actual = stdout.trim();
  const expected = expectedOutput.trim();
  if (!actual || !expected) return false;

  if (normalizeOutput(actual) === normalizeOutput(expected)) {
    return true;
  }

  const expectedTokens = parseExpectedTokens(expected);
  const actualTokens = extractOrderedTokens(actual, expectedTokens);

  if (
    actualTokens.length === expectedTokens.length &&
    tokensShareType(expectedTokens, actualTokens) &&
    actualTokens.every((token, index) => token === expectedTokens[index])
  ) {
    return true;
  }

  if (findTokensInOrder(actual, expectedTokens)) {
    return true;
  }

  const lowerQuestion = (questionText ?? "").toLowerCase();
  if (isBinaryTreeDepthProblem(questionText ?? "")) {
    const actualDepth = Number(actual.trim());
    const expectedDepth = Number(expected.trim());
    if (
      Number.isFinite(actualDepth) &&
      Number.isFinite(expectedDepth) &&
      actualDepth === expectedDepth
    ) {
      return true;
    }
  }

  const asksForMax = asksForArrayMaximum(questionText ?? "");
  const asksForMin = asksForArrayMinimum(questionText ?? "");

  if (
    asksForMax &&
    asksForMin &&
    expectedTokens.length === 2 &&
    expectedTokens.every(isNumericToken) &&
    actualTokens.length === 2 &&
    numericSetsMatch(expectedTokens, actualTokens)
  ) {
    return true;
  }

  if (expectedTokens.length === 1 && !isNumericToken(expectedTokens[0])) {
    if (actual.toLowerCase().includes(expectedTokens[0])) {
      return true;
    }
  }

  const actualAsString = extractStringFromFlexibleOutput(actual);
  if (actualAsString && actualAsString.toLowerCase() === expected.toLowerCase()) {
    return true;
  }

  return false;
}

function isReverseStringProblem(questionText: string): boolean {
  const lower = questionText.toLowerCase();
  return (
    lower.includes("reverse") &&
    lower.includes("string") &&
    !lower.includes("polish")
  );
}

function extractStringArrayFromOutput(stdout: string): string[] | null {
  const bracketMatch = stdout.trim().match(/\[[\s\S]*\]/);
  if (!bracketMatch) return null;

  const chars = [...bracketMatch[0].matchAll(/['"]([^'"]*)['"]/g)].map(
    (match) => match[1]
  );
  return chars.length > 0 ? chars : null;
}

function extractStringFromFlexibleOutput(stdout: string): string | null {
  const arrayValues = extractStringArrayFromOutput(stdout);
  if (arrayValues) {
    return arrayValues.join("");
  }

  const trimmed = stdout.trim();
  if (/^\[\s*\]/.test(trimmed)) {
    return "";
  }

  return null;
}

function extractStringArraysFromCode(sourceCode: string): string[][] {
  const arrays: string[][] = [];
  const pattern = /\[(?:\s*['"][^'"]*['"]\s*,?)+\s*\]/g;

  for (const match of sourceCode.matchAll(pattern)) {
    const values = [...match[0].matchAll(/['"]([^'"]*)['"]/g)].map(
      (item) => item[1]
    );
    if (values.length >= 2) {
      arrays.push(values);
    }
  }

  return arrays;
}

function extractStringInputsFromCode(sourceCode: string): string[] {
  const inputs = new Set<string>();

  for (const array of extractStringArraysFromCode(sourceCode)) {
    inputs.add(array.join(""));
  }

  for (const match of sourceCode.matchAll(/=\s*['"]([^'"]+)['"]/g)) {
    if (!match[0].includes("require(")) {
      inputs.add(match[1]);
    }
  }

  return Array.from(inputs);
}

function collectReverseInputCandidates(stdin: string, sourceCode: string): string[] {
  const candidates = new Set<string>();

  if (stdin.trim()) {
    candidates.add(stdin.trim());
  }

  for (const value of extractStringInputsFromCode(sourceCode)) {
    candidates.add(value);
  }

  return Array.from(candidates);
}

function isValidReverseOutput(originalInput: string, stdout: string): boolean {
  if (!originalInput) return false;

  const expected = originalInput.split("").reverse().join("");
  const actualString = extractStringFromFlexibleOutput(stdout) ?? stdout.trim();

  return actualString.toLowerCase() === expected.toLowerCase();
}

function parseNumberList(input: string): number[] {
  return input
    .trim()
    .split(/\s+/)
    .map(Number)
    .filter((value) => Number.isFinite(value));
}

type SimpleTreeNode = {
  val: number;
  left: SimpleTreeNode | null;
  right: SimpleTreeNode | null;
};

function isBinaryTreeDepthProblem(questionText: string): boolean {
  const lower = questionText.toLowerCase();
  return (
    (lower.includes("binary tree") ||
      (lower.includes("tree") && lower.includes("root"))) &&
    (lower.includes("depth") || lower.includes("height"))
  );
}

function asksForArrayMaximum(questionText: string): boolean {
  if (isBinaryTreeDepthProblem(questionText)) return false;

  const lower = questionText.toLowerCase();
  return (
    lower.includes("maximum") ||
    lower.includes("largest") ||
    lower.includes("max element") ||
    /\bmax\b/.test(lower)
  );
}

function asksForArrayMinimum(questionText: string): boolean {
  if (isBinaryTreeDepthProblem(questionText)) return false;

  const lower = questionText.toLowerCase();
  return (
    lower.includes("minimum") ||
    lower.includes("smallest") ||
    lower.includes("min element") ||
    /\bmin\b/.test(lower)
  );
}

function buildTreeFromLevelOrder(values: number[]): SimpleTreeNode | null {
  if (values.length === 0) return null;

  const nodes: (SimpleTreeNode | null)[] = values.map((val) => ({
    val,
    left: null,
    right: null,
  }));

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) continue;

    const leftIndex = 2 * index + 1;
    const rightIndex = 2 * index + 2;
    if (leftIndex < nodes.length) node.left = nodes[leftIndex];
    if (rightIndex < nodes.length) node.right = nodes[rightIndex];
  }

  return nodes[0];
}

function measureTreeMaxDepth(root: SimpleTreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(measureTreeMaxDepth(root.left), measureTreeMaxDepth(root.right));
}

function computeMaxDepthFromStdin(stdin: string): number | null {
  const numbers = parseNumberList(stdin);
  if (numbers.length === 0) return null;
  return measureTreeMaxDepth(buildTreeFromLevelOrder(numbers));
}

function hasMaxDepthFunction(sourceCode: string): boolean {
  return /\b(maxDepth|max_depth|maximumDepth|treeMaxDepth)\b/.test(sourceCode);
}

function runMaxDepthFromSource(sourceCode: string, stdin: string): string | null {
  const numbers = parseNumberList(stdin);
  if (numbers.length === 0 || !hasMaxDepthFunction(sourceCode)) return null;

  try {
    const runner = new Function(`
      class TreeNode {
        constructor(val, left = null, right = null) {
          this.val = val;
          this.left = left;
          this.right = right;
        }
      }
      function __buildTree(values) {
        if (!values.length) return null;
        const nodes = values.map((val) => new TreeNode(val));
        for (let i = 0; i < nodes.length; i += 1) {
          const left = 2 * i + 1;
          const right = 2 * i + 2;
          if (left < nodes.length) nodes[i].left = nodes[left];
          if (right < nodes.length) nodes[i].right = nodes[right];
        }
        return nodes[0];
      }
      ${sourceCode}
      const __root = __buildTree(${JSON.stringify(numbers)});
      const fn =
        typeof maxDepth === "function"
          ? maxDepth
          : typeof max_depth === "function"
            ? max_depth
            : null;
      if (!fn) return null;
      const __result = fn(__root);
      return __result === undefined || __result === null ? null : String(__result);
    `);
    const result = runner();
    return typeof result === "string" && result.trim() ? result.trim() : null;
  } catch {
    return null;
  }
}

function parseInputLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let previous = 0;
  let current = 1;

  for (let index = 2; index <= n; index += 1) {
    const next = previous + current;
    previous = current;
    current = next;
  }

  return current;
}

function isPalindromeValue(value: string): boolean {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned.length > 0 && cleaned === cleaned.split("").reverse().join("");
}

export function computeExpectedOutputForProblem(
  questionText: string,
  stdin: string
): string | null {
  if (looksLikeMcqPrompt(questionText) || !stdin.trim()) {
    return null;
  }

  const lower = questionText.toLowerCase();
  const lines = parseInputLines(stdin);

  if (isBinaryTreeDepthProblem(questionText)) {
    const depth = computeMaxDepthFromStdin(stdin);
    return depth === null ? null : String(depth);
  }

  const asksForMax = asksForArrayMaximum(questionText);
  const asksForMin = asksForArrayMinimum(questionText);

  if (lower.includes("sum") && (lower.includes("array") || lower.includes("elements"))) {
    const numbers = parseNumberList(stdin);
    if (numbers.length === 0) return null;
    return String(numbers.reduce((total, value) => total + value, 0));
  }

  if (asksForMax && asksForMin) {
    const numbers = parseNumberList(stdin);
    if (numbers.length === 0) return null;
    return `${Math.max(...numbers)} ${Math.min(...numbers)}`;
  }

  if (asksForMax) {
    const numbers = parseNumberList(stdin);
    if (numbers.length === 0) return null;
    return String(Math.max(...numbers));
  }

  if (asksForMin) {
    const numbers = parseNumberList(stdin);
    if (numbers.length === 0) return null;
    return String(Math.min(...numbers));
  }

  if (lower.includes("reverse") && !lower.includes("polish")) {
    const text = stdin.trim();
    if (!text || /^\d+$/.test(text)) return null;
    return text.split("").reverse().join("");
  }

  if (lower.includes("factorial")) {
    const value = Number(stdin.trim());
    if (!Number.isInteger(value) || value < 0) return null;

    let result = 1;
    for (let index = 2; index <= value; index += 1) {
      result *= index;
    }
    return String(result);
  }

  if (/\beven\b/.test(lower) || /\bodd\b/.test(lower)) {
    const value = Number(stdin.trim());
    if (!Number.isInteger(value)) return null;
    return value % 2 === 0 ? "even" : "odd";
  }

  if (lower.includes("parking") && lower.includes("system")) {
    if (lines.length < 2) return null;

    const [big, medium, small] = parseNumberList(lines[0]);
    if ([big, medium, small].some((slot) => !Number.isFinite(slot))) return null;

    let bigSlots = big;
    let mediumSlots = medium;
    let smallSlots = small;
    const results: string[] = [];

    for (const carLine of lines.slice(1)) {
      const carType = Number(carLine);
      if (carType === 1 && bigSlots > 0) {
        bigSlots -= 1;
        results.push("true");
      } else if (carType === 2 && mediumSlots > 0) {
        mediumSlots -= 1;
        results.push("true");
      } else if (carType === 3 && smallSlots > 0) {
        smallSlots -= 1;
        results.push("true");
      } else {
        results.push("false");
      }
    }

    return results.join("\n");
  }

  if (lower.includes("two sum") || lower.includes("pair with sum")) {
    if (lines.length < 2) return null;

    const numbers = parseNumberList(lines[0]);
    const target = Number(lines[1]);
    if (numbers.length === 0 || !Number.isFinite(target)) return null;

    const indexMap = new Map<number, number>();
    for (let index = 0; index < numbers.length; index += 1) {
      const complement = target - numbers[index];
      if (indexMap.has(complement)) {
        return `${indexMap.get(complement)} ${index}`;
      }
      indexMap.set(numbers[index], index);
    }

    return null;
  }

  if (lower.includes("palindrome")) {
    const value = stdin.trim();
    if (!value) return null;
    return isPalindromeValue(value) ? "true" : "false";
  }

  if (lower.includes("fibonacci")) {
    const value = Number(stdin.trim());
    if (!Number.isInteger(value) || value < 0) return null;
    return String(fibonacci(value));
  }

  if (
    lower.includes("count") &&
    (lower.includes("array") || lower.includes("element"))
  ) {
    const numbers = parseNumberList(stdin);
    if (numbers.length === 0) return null;
    return String(numbers.length);
  }

  if (lower.includes("linear search") || lower.includes("find index")) {
    if (lines.length < 2) return null;

    const numbers = parseNumberList(lines[0]);
    const target = Number(lines[1]);
    if (numbers.length === 0 || !Number.isFinite(target)) return null;

    const index = numbers.indexOf(target);
    return String(index);
  }

  if (lower.includes("binary search")) {
    if (lines.length < 2) return null;

    const numbers = parseNumberList(lines[0]);
    const target = Number(lines[1]);
    if (numbers.length === 0 || !Number.isFinite(target)) return null;

    let left = 0;
    let right = numbers.length - 1;

    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      if (numbers[middle] === target) {
        return String(middle);
      }
      if (numbers[middle] < target) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }

    return "-1";
  }

  return null;
}

function isParkingSystemProblem(questionText: string): boolean {
  const lower = questionText.toLowerCase();
  return lower.includes("parking") && lower.includes("system");
}

function isHashSetDesignProblem(questionText: string): boolean {
  const lower = questionText.toLowerCase();
  return (
    lower.includes("hashset") ||
    lower.includes("hash set") ||
    (lower.includes("design") && lower.includes("hash") && lower.includes("set"))
  );
}

function isDesignDataStructureProblem(questionText: string): boolean {
  const lower = questionText.toLowerCase();
  return (
    isParkingSystemProblem(questionText) ||
    isHashSetDesignProblem(questionText) ||
    isBinaryTreeDepthProblem(questionText) ||
    isStackSimulationProblem(questionText) ||
    (lower.includes("design") &&
      (lower.includes("class") ||
        lower.includes("implement") ||
        lower.includes("hashmap") ||
        lower.includes("hash map") ||
        lower.includes("linked list") ||
        lower.includes("minstack") ||
        lower.includes("min stack") ||
        lower.includes("queue") ||
        lower.includes("stack") ||
        lower.includes("iterator") ||
        lower.includes("cache") ||
        lower.includes("trie")))
  );
}

function getDesignClassReferenceOutput(questionText: string): string | null {
  if (isHashSetDesignProblem(questionText)) {
    return "true\nfalse";
  }
  return null;
}

function hasParkingSystemClass(sourceCode: string): boolean {
  return /class\s+ParkingSystem\b/.test(sourceCode) && /\baddCar\s*\(/.test(sourceCode);
}

function hasHashSetClass(sourceCode: string): boolean {
  return (
    /class\s+(MyHashSet|HashSet)\b/.test(sourceCode) &&
    /\badd\s*\(/.test(sourceCode) &&
    /\bremove\s*\(/.test(sourceCode) &&
    /\bcontains\s*\(/.test(sourceCode)
  );
}

function hasDesignClassImplementation(questionText: string, sourceCode: string): boolean {
  if (isParkingSystemProblem(questionText)) return hasParkingSystemClass(sourceCode);
  if (isHashSetDesignProblem(questionText)) return hasHashSetClass(sourceCode);
  if (isBinaryTreeDepthProblem(questionText)) return hasMaxDepthFunction(sourceCode);
  if (!/class\s+[A-Z]\w*/.test(sourceCode)) return false;

  const lower = questionText.toLowerCase();
  if (!lower.includes("design") && !lower.includes("implement")) return false;

  return /\b(add|remove|contains|push|pop|insert|delete|get|put|addCar|top|empty)\s*\(/i.test(
    sourceCode
  );
}

/** Runs a ParkingSystem class definition against stdin when no driver code prints output. */
function runParkingSystemFromSource(sourceCode: string, stdin: string): string | null {
  const lines = parseInputLines(stdin);
  if (lines.length < 2) return null;

  const [big, medium, small] = parseNumberList(lines[0]);
  if ([big, medium, small].some((value) => !Number.isFinite(value))) return null;

  const carTypes = lines
    .slice(1)
    .map((line) => Number(line.trim()))
    .filter((value) => Number.isFinite(value));
  if (carTypes.length === 0) return null;

  try {
    const runner = new Function(`
      ${sourceCode}
      const ps = new ParkingSystem(${big}, ${medium}, ${small});
      const carTypes = ${JSON.stringify(carTypes)};
      return carTypes
        .map((carType) => String(ps.addCar(carType)).toLowerCase())
        .join("\\n");
    `);
    const result = runner();
    return typeof result === "string" && result.trim() ? result : null;
  } catch {
    return null;
  }
}

/** Runs a HashSet / MyHashSet class against a built-in operation sequence. */
function runHashSetFromSource(sourceCode: string): string | null {
  try {
    const runner = new Function(`
      ${sourceCode}
      const SetClass =
        typeof MyHashSet !== "undefined"
          ? MyHashSet
          : typeof HashSet !== "undefined"
            ? HashSet
            : null;
      if (!SetClass) return null;
      const hs = new SetClass();
      hs.add(1);
      hs.add(2);
      const containsOne = hs.contains(1);
      hs.add(3);
      hs.remove(2);
      const containsTwo = hs.contains(2);
      return String(containsOne).toLowerCase() + "\\n" + String(containsTwo).toLowerCase();
    `);
    const result = runner();
    return typeof result === "string" && result.trim() ? result.trim() : null;
  } catch {
    return null;
  }
}

export function getClassSimulationOutput(
  questionText: string,
  sourceCode: string,
  stdin: string,
  sampleInput = ""
): string | null {
  if (isHashSetDesignProblem(questionText) && hasHashSetClass(sourceCode)) {
    return runHashSetFromSource(sourceCode);
  }

  const effectiveStdin = stdin.trim() || sampleInput.trim();
  if (!effectiveStdin) return null;

  if (isParkingSystemProblem(questionText) && hasParkingSystemClass(sourceCode)) {
    return runParkingSystemFromSource(sourceCode, effectiveStdin);
  }

  if (isBinaryTreeDepthProblem(questionText) && hasMaxDepthFunction(sourceCode)) {
    return runMaxDepthFromSource(sourceCode, effectiveStdin);
  }

  return null;
}

/** @deprecated Use getClassSimulationOutput */
export const getSolutionSimulationOutput = getClassSimulationOutput;

function validateClassOnlyDesignProblem(
  questionText: string,
  sourceCode: string,
  stdin: string,
  sampleInput: string,
  expectedOutput: string,
  stdout = ""
): boolean {
  const effectiveStdin = stdin.trim() || sampleInput.trim();
  const simulated = getClassSimulationOutput(
    questionText,
    sourceCode,
    effectiveStdin,
    sampleInput
  );

  if (!simulated && !hasDesignClassImplementation(questionText, sourceCode)) {
    return false;
  }

  const actual = stdout.trim();
  if (simulated && actual && normalizeOutput(actual) !== normalizeOutput(simulated)) {
    return false;
  }

  const expected =
    computeExpectedOutputForProblem(questionText, effectiveStdin) ??
    (expectedOutput.trim() ? expectedOutput : null) ??
    getDesignClassReferenceOutput(questionText);

  if (simulated && expected) {
    return flexibleOutputMatches(simulated, expected, questionText);
  }

  if (simulated) {
    return true;
  }

  return hasDesignClassImplementation(questionText, sourceCode);
}

function supportsDynamicValidation(questionText: string): boolean {
  return (
    inferProblemTestCase(questionText).expectedOutput.trim().length > 0 ||
    isStackSimulationProblem(questionText) ||
    isParkingSystemProblem(questionText) ||
    isBinaryTreeDepthProblem(questionText) ||
    isDesignDataStructureProblem(questionText)
  );
}

function isStackSimulationProblem(questionText: string): boolean {
  const lower = questionText.toLowerCase();
  return (
    lower.includes("stack") &&
    (lower.includes("queue") || lower.includes("implement"))
  );
}

type StackProgramOp =
  | { kind: "push"; value: number }
  | { kind: "top" | "pop" | "empty"; logged: boolean };

function parseStackProgramFromCode(sourceCode: string): StackProgramOp[] {
  const operations: StackProgramOp[] = [];

  for (const line of sourceCode.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) {
      continue;
    }

    if (/^\s*(push|pop|top|empty)\s*\(/.test(trimmed)) {
      continue;
    }

    if (trimmed.includes("this.")) {
      continue;
    }

    const pushMatch = trimmed.match(/\b\w+\.push\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)/);
    if (pushMatch) {
      operations.push({ kind: "push", value: Number(pushMatch[1]) });
      continue;
    }

    const isLogged = /console\.log|print\s*\(/i.test(trimmed);

    if (/\.top\s*\(\s*\)/.test(trimmed)) {
      operations.push({ kind: "top", logged: isLogged });
    } else if (/\.pop\s*\(\s*\)/.test(trimmed)) {
      operations.push({ kind: "pop", logged: isLogged });
    } else if (/\.empty\s*\(\s*\)/.test(trimmed)) {
      operations.push({ kind: "empty", logged: isLogged });
    }
  }

  return operations;
}

function simulateStackProgram(operations: StackProgramOp[]): string[] {
  const stack: number[] = [];
  const outputs: string[] = [];

  for (const operation of operations) {
    if (operation.kind === "push") {
      stack.push(operation.value);
      continue;
    }

    if (operation.kind === "top") {
      if (operation.logged && stack.length > 0) {
        outputs.push(String(stack[stack.length - 1]));
      }
      continue;
    }

    if (operation.kind === "pop") {
      if (stack.length === 0) continue;
      const value = stack.pop();
      if (operation.logged && value !== undefined) {
        outputs.push(String(value));
      }
      continue;
    }

    if (operation.kind === "empty" && operation.logged) {
      outputs.push(String(stack.length === 0));
    }
  }

  return outputs;
}

function normalizeOutputLines(stdout: string): string[] {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function outputLinesMatch(stdout: string, expectedLines: string[]): boolean {
  const actualLines = normalizeOutputLines(stdout);
  if (actualLines.length !== expectedLines.length) {
    return false;
  }

  return expectedLines.every((expected, index) => {
    const actual = actualLines[index].toLowerCase();
    const target = expected.toLowerCase();
    return actual === target;
  });
}

function simulateDesignProblemOutput(
  questionText: string,
  sourceCode: string
): string[] | null {
  if (!isStackSimulationProblem(questionText)) {
    return null;
  }

  const operations = parseStackProgramFromCode(sourceCode);
  if (operations.length === 0) {
    return null;
  }

  const outputs = simulateStackProgram(operations);
  return outputs.length > 0 ? outputs : null;
}

export function resolveExpectedOutput(
  problem: ProblemContext,
  stdin: string,
  sourceCode = ""
): string | null {
  const simulatedOutput = simulateDesignProblemOutput(
    problem.questionText,
    sourceCode
  );
  if (simulatedOutput) {
    return simulatedOutput.join("\n");
  }

  if (isReverseStringProblem(problem.questionText)) {
    for (const input of collectReverseInputCandidates(stdin, sourceCode)) {
      return input.split("").reverse().join("");
    }
  }

  for (const array of extractNumberArraysFromCode(sourceCode)) {
    const fromCode = computeExpectedOutputForProblem(
      problem.questionText,
      array.join(" ")
    );
    if (fromCode !== null) {
      return fromCode;
    }
  }

  for (const input of collectInputCandidates(stdin, sourceCode)) {
    const dynamicExpected = computeExpectedOutputForProblem(
      problem.questionText,
      input
    );
    if (dynamicExpected !== null) {
      return dynamicExpected;
    }
  }

  if (!problem.expectedOutput.trim()) {
    return null;
  }

  const normalizedStdin = normalizeOutput(stdin);
  const normalizedSample = normalizeOutput(problem.sampleInput);
  if (!normalizedSample || normalizedStdin === normalizedSample) {
    return problem.expectedOutput;
  }

  return null;
}

function looksLikeMcqPrompt(prompt: string): boolean {
  const lower = prompt.trim().toLowerCase();
  return /^(what|which|how|why|when|where|who|is|are|does|do|can|should)\b/.test(
    lower
  );
}

export function inferProblemTestCase(prompt: string): ProblemTestCase {
  if (looksLikeMcqPrompt(prompt)) {
    return { sampleInput: "", expectedOutput: "" };
  }

  const lower = prompt.toLowerCase();

  if (isBinaryTreeDepthProblem(prompt)) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "3" };
  }

  if (isHashSetDesignProblem(prompt)) {
    return { sampleInput: "", expectedOutput: "true\nfalse" };
  }

  if (lower.includes("sum") && (lower.includes("array") || lower.includes("elements"))) {
    return { sampleInput: "1 2 3 4 5", expectedOutput: "15" };
  }

  const asksForMax = asksForArrayMaximum(prompt);
  const asksForMin = asksForArrayMinimum(prompt);

  if (asksForMax && asksForMin) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "9 1" };
  }

  if (asksForMax) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "9" };
  }

  if (asksForMin) {
    return { sampleInput: "3 7 2 9 1", expectedOutput: "1" };
  }

  if (lower.includes("reverse")) {
    return { sampleInput: "hello", expectedOutput: "olleh" };
  }

  if (lower.includes("factorial")) {
    return { sampleInput: "5", expectedOutput: "120" };
  }

  if (/\beven\b/.test(lower) || /\bodd\b/.test(lower)) {
    return { sampleInput: "4", expectedOutput: "even" };
  }

  if (lower.includes("parking") && lower.includes("system")) {
    return {
      sampleInput: "1 1 0\n1\n1\n2\n3",
      expectedOutput: "true\ntrue\nfalse\nfalse",
    };
  }

  if (lower.includes("two sum") || lower.includes("pair with sum")) {
    return { sampleInput: "2 7 11 15\n9", expectedOutput: "0 1" };
  }

  if (lower.includes("palindrome")) {
    return { sampleInput: "racecar", expectedOutput: "true" };
  }

  if (lower.includes("fibonacci")) {
    return { sampleInput: "6", expectedOutput: "8" };
  }

  if (
    lower.includes("count") &&
    (lower.includes("array") || lower.includes("element"))
  ) {
    return { sampleInput: "1 2 3 4 5", expectedOutput: "5" };
  }

  if (lower.includes("linear search") || lower.includes("find index")) {
    return { sampleInput: "10 20 30 40\n30", expectedOutput: "2" };
  }

  if (lower.includes("binary search")) {
    return { sampleInput: "1 3 5 7 9\n7", expectedOutput: "3" };
  }

  if (lower.includes("stack") && lower.includes("queue")) {
    return { sampleInput: "", expectedOutput: "2\n2\nfalse" };
  }

  return { sampleInput: "", expectedOutput: "" };
}

export function buildProblemContext(
  questionId: string | null,
  questionText: string,
  dbTestCase?: { sampleInput?: string; expectedOutput?: string }
): ProblemContext {
  const inferred = inferProblemTestCase(questionText);
  const sampleInput = dbTestCase?.sampleInput?.trim()
    ? dbTestCase.sampleInput
    : inferred.sampleInput;
  const expectedOutput = dbTestCase?.expectedOutput?.trim()
    ? dbTestCase.expectedOutput
    : inferred.expectedOutput;

  return {
    questionId,
    questionText,
    sampleInput,
    expectedOutput,
    hasAutoCheck:
      Boolean(expectedOutput.trim()) ||
      supportsDynamicValidation(questionText) ||
      isDesignDataStructureProblem(questionText),
  };
}

export function parseProblemFromSearchParams(
  params: URLSearchParams
): ProblemContext | null {
  const questionText = params.get("question")?.trim();
  if (!questionText) return null;

  return buildProblemContext(params.get("questionId"), questionText);
}

export async function loadProblemContextFromQuestionId(
  questionId: string,
  questionText: string
): Promise<ProblemContext> {
  let dbSampleInput = "";
  let dbExpectedOutput = "";

  try {
    const response = await fetch(`/api/learning/questions/${questionId}`, {
      credentials: "include",
    });

    if (response.ok) {
      const payload = (await response.json()) as {
        question?: { sampleInput?: string; expectedOutput?: string };
      };
      dbSampleInput = payload.question?.sampleInput ?? "";
      dbExpectedOutput = payload.question?.expectedOutput ?? "";
    }
  } catch {
    // Fall back to keyword inference when the API is unavailable.
  }

  return buildProblemContext(questionId, questionText, {
    sampleInput: dbSampleInput,
    expectedOutput: dbExpectedOutput,
  });
}

export function getProblemCodeStorageKey(
  language: string,
  questionId: string | null
): string {
  if (questionId) {
    return `cus_compiler_code_${questionId}_${language}`;
  }
  return `cus_compiler_code_problem_${language}`;
}

function commentLine(language: SupportedLanguage, text: string): string {
  if (language === "python") return `# ${text}`;
  return `// ${text}`;
}

export function getProblemStarterCode(language: string, question: string): string {
  const lang = (["javascript", "python", "java", "cpp"].includes(language)
    ? language
    : "javascript") as SupportedLanguage;

  const lower = question.toLowerCase();
  const parkingHints =
    lower.includes("parking") && lower.includes("system")
      ? [
          commentLine(lang, "Input line 1: big medium small slot counts"),
          commentLine(lang, "Next lines: car types (1=big, 2=medium, 3=small)"),
          commentLine(lang, "Print true/false for each addCar call on its own line"),
        ]
      : [];

  const parkingJavascriptDriver =
    lower.includes("parking") && lower.includes("system") && lang === "javascript"
      ? `

const fs = require("fs");
const lines = fs
  .readFileSync(0, "utf-8")
  .trim()
  .split(/\\r?\\n/)
  .map((line) => line.trim())
  .filter(Boolean);
const [big, medium, small] = lines[0].split(/\\s+/).map(Number);
const parkingSystem = new ParkingSystem(big, medium, small);
for (let i = 1; i < lines.length; i += 1) {
  console.log(parkingSystem.addCar(Number(lines[i])));
}
`
      : "";

  const lines = question
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => commentLine(lang, line));

  const header = [
    commentLine(lang, "Write your solution for the problem above."),
    commentLine(lang, "Read input from stdin and print the answer."),
    ...parkingHints,
    ...lines,
    "",
  ].join("\n");

  const templates: Record<SupportedLanguage, string> = {
    javascript:
      lower.includes("parking") && lower.includes("system")
        ? `${header}class ParkingSystem {
  constructor(big, medium, small) {
    this.slots = [0, big, medium, small];
  }

  addCar(carType) {
    if (this.slots[carType] > 0) {
      this.slots[carType] -= 1;
      return true;
    }
    return false;
  }
}
${parkingJavascriptDriver}`
        : `${header}const fs = require("fs");

const input = fs.readFileSync(0, "utf-8").trim();

// TODO: implement your solution here

console.log("");
`,
    python: `${header}import sys

input_data = sys.stdin.read().strip()

# TODO: implement your solution here

print("")
`,
    java: `${header}import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: implement your solution here
        System.out.println("");
    }
}
`,
    cpp: `${header}#include <iostream>
#include <string>

int main() {
    std::string input;
    std::getline(std::cin, input);
    // TODO: implement your solution here
    std::cout << "" << std::endl;
    return 0;
}
`,
  };

  return templates[lang];
}

function extractNumberArraysFromCode(sourceCode: string): number[][] {
  const arrays: number[][] = [];
  const pattern = /\[(?:[^\[\]]*\d[^\[\]]*)\]/g;

  for (const match of sourceCode.matchAll(pattern)) {
    const numbers = parseNumberList(match[0].replace(/[\[\]]/g, " "));
    if (numbers.length >= 2) {
      arrays.push(numbers);
    }
  }

  return arrays;
}

function extractMinMaxPair(output: string): { min: number; max: number } | null {
  const text = output.trim();
  if (!text) return null;

  try {
    const jsonLike = text
      .replace(/([{,]\s*)([a-zA-Z_]\w*)(\s*:)/g, '$1"$2"$3')
      .replace(/'/g, '"');
    const parsed = JSON.parse(jsonLike) as { min?: unknown; max?: unknown };
    if (typeof parsed.min === "number" && typeof parsed.max === "number") {
      return { min: parsed.min, max: parsed.max };
    }
  } catch {
    // Fall through to regex parsing.
  }

  const minFirst = text.match(/min\D*(-?\d+(?:\.\d+)?)[\s\S]*max\D*(-?\d+(?:\.\d+)?)/i);
  if (minFirst) {
    return { min: Number(minFirst[1]), max: Number(minFirst[2]) };
  }

  const maxFirst = text.match(/max\D*(-?\d+(?:\.\d+)?)[\s\S]*min\D*(-?\d+(?:\.\d+)?)/i);
  if (maxFirst) {
    return { min: Number(maxFirst[2]), max: Number(maxFirst[1]) };
  }

  return null;
}

function isValidMinMaxForArray(
  numbers: number[],
  min: number,
  max: number
): boolean {
  if (numbers.length === 0) return false;
  return Math.min(...numbers) === min && Math.max(...numbers) === max;
}

function isMaxMinProblem(questionText: string): boolean {
  if (isBinaryTreeDepthProblem(questionText)) return false;
  return asksForArrayMaximum(questionText) && asksForArrayMinimum(questionText);
}

function collectInputCandidates(stdin: string, sourceCode: string): string[] {
  const candidates = new Set<string>();

  if (stdin.trim()) {
    candidates.add(stdin.trim());
  }

  for (const array of extractNumberArraysFromCode(sourceCode)) {
    candidates.add(array.join(" "));
  }

  return Array.from(candidates);
}

function validateUsingCodeInputs(
  questionText: string,
  stdout: string,
  sourceCode: string,
  stdin: string
): boolean {
  const simulatedOutput = simulateDesignProblemOutput(questionText, sourceCode);
  if (simulatedOutput && outputLinesMatch(stdout, simulatedOutput)) {
    return true;
  }

  if (isBinaryTreeDepthProblem(questionText)) {
    const actualPrinted = stdout.trim();
    const simulatedDepth = runMaxDepthFromSource(
      sourceCode,
      stdin.trim() || parseInputLines(stdin).join(" ")
    );

    if (simulatedDepth && !actualPrinted) {
      for (const input of collectInputCandidates(stdin, sourceCode)) {
        const expectedDepth = computeMaxDepthFromStdin(input);
        if (expectedDepth !== null && Number(simulatedDepth) === expectedDepth) {
          return true;
        }
      }
    }

    const actualDepth = Number(actualPrinted);
    if (Number.isFinite(actualDepth)) {
      for (const input of collectInputCandidates(stdin, sourceCode)) {
        const expectedDepth = computeMaxDepthFromStdin(input);
        if (expectedDepth !== null && actualDepth === expectedDepth) {
          return true;
        }
      }
    }
  }

  if (isMaxMinProblem(questionText)) {
    const pair = extractMinMaxPair(stdout);
    if (!pair) return false;

    for (const array of extractNumberArraysFromCode(sourceCode)) {
      if (isValidMinMaxForArray(array, pair.min, pair.max)) {
        return true;
      }
    }

    const stdinNumbers = parseNumberList(stdin);
    if (stdinNumbers.length > 0 && isValidMinMaxForArray(stdinNumbers, pair.min, pair.max)) {
      return true;
    }
  }

  if (isReverseStringProblem(questionText)) {
    for (const input of collectReverseInputCandidates(stdin, sourceCode)) {
      if (isValidReverseOutput(input, stdout)) {
        return true;
      }
    }
  }

  for (const input of collectInputCandidates(stdin, sourceCode)) {
    const expected = computeExpectedOutputForProblem(questionText, input);
    if (expected && flexibleOutputMatches(stdout, expected, questionText)) {
      return true;
    }
  }

  return false;
}

export function validateProblemOutput(
  stdout: string | null | undefined,
  expectedOutput: string,
  questionText?: string
): ValidationResult {
  const actual = (stdout ?? "").trim();
  if (!actual) return "wrong";

  return flexibleOutputMatches(actual, expectedOutput, questionText)
    ? "correct"
    : "wrong";
}

export function resolveProblemValidation(
  stdout: string | null | undefined,
  problem: ProblemContext,
  executionSucceeded: boolean,
  stdin = "",
  sourceCode = ""
): ValidationResult | null {
  if (!executionSucceeded) return null;

  const actual = (stdout ?? "").trim();

  if (
    validateClassOnlyDesignProblem(
      problem.questionText,
      sourceCode,
      stdin,
      problem.sampleInput,
      problem.expectedOutput,
      actual
    )
  ) {
    return "correct";
  }

  if (
    actual &&
    problem.hasAutoCheck &&
    validateUsingCodeInputs(problem.questionText, actual, sourceCode, stdin)
  ) {
    return "correct";
  }

  if (!actual) {
    if (!problem.hasAutoCheck) return "unchecked";
    return "wrong";
  }

  const expectedOutput = resolveExpectedOutput(problem, stdin, sourceCode);
  if (!expectedOutput) {
    return "unchecked";
  }

  return validateProblemOutput(actual, expectedOutput, problem.questionText);
}

export function buildProblemCompilerUrl(
  questionId: string,
  prompt: string,
  basePath = "/compiler",
): string {
  const params = new URLSearchParams({
    questionId,
    question: prompt,
  });

  return `${basePath}?${params.toString()}`;
}

export type ProblemSolveSyncResult = {
  ok: boolean;
  alreadySolved?: boolean;
  error?: string;
};

export const CUS_PROBLEM_SOLVED_EVENT = "cus-problem-solved";

function dispatchProblemSolvedEvent(questionId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CUS_PROBLEM_SOLVED_EVENT, { detail: { questionId } })
  );
}

function rememberLocalProblemSolve(questionId: string): void {
  try {
    const stored = localStorage.getItem("cus_solved_questions");
    const solved = stored ? (JSON.parse(stored) as string[]) : [];
    if (!solved.includes(questionId)) {
      solved.push(questionId);
      localStorage.setItem("cus_solved_questions", JSON.stringify(solved));
    }
  } catch {
    localStorage.setItem("cus_solved_questions", JSON.stringify([questionId]));
  }
}

export async function syncProblemSolveToServer(
  questionId: string | null
): Promise<ProblemSolveSyncResult> {
  if (!questionId || typeof window === "undefined") {
    return { ok: false, error: "Missing question id." };
  }

  rememberLocalProblemSolve(questionId);

  try {
    const response = await fetch(`/api/learning/questions/${questionId}/compiler-solve`, {
      method: "POST",
      credentials: "include",
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      result?: { tracked?: boolean; alreadySolved?: boolean };
    };

    if (!response.ok) {
      console.warn("[syncProblemSolveToServer] Server rejected solve:", payload.error);
      return { ok: false, error: payload.error ?? `Request failed (${response.status}).` };
    }

    dispatchProblemSolvedEvent(questionId);

    return {
      ok: true,
      alreadySolved: payload.result?.alreadySolved,
    };
  } catch (error) {
    console.warn("[syncProblemSolveToServer] Failed to sync solve to server:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network error.",
    };
  }
}

export function markProblemSolved(questionId: string | null): void {
  void syncProblemSolveToServer(questionId);
}
