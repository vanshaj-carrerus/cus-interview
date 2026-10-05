/**
 * LeetCode-style "function only" solutions (e.g. `var minCameraCover = function (root) {...}`
 * or `class Solution: def minCameraCover(self, root)`) never read stdin or print. This wraps
 * them so the custom input is passed in as arguments and the return value is printed:
 *
 * - one argument per input line, LeetCode format: `[0,0,null,0,0]`, `"abc"`, `5`
 *   (space-separated values like `3 7 2 9 1` are read as an array too)
 * - params named root / tree (or typed TreeNode) get a tree built from the level-order array
 * - params named head / l1 / l2 (or typed ListNode) get a linked list
 * - the result is printed as JSON (trees / lists turned back into arrays); a function that
 *   returns nothing prints its first argument, for "modify in place" problems
 *
 * JavaScript and Python only. The TreeNode / ListNode header is prepended on one line.
 */

export type FunctionHarness = {
  /** Code to send to the runner. */
  code: string;
  /** The entry function that is called with the input (null when no input was given). */
  entryName: string;
  /** True when the input was passed to the function. */
  calledWithInput: boolean;
};

type ArgKind = "tree" | "list" | "value";
type HarnessArg = { kind: ArgKind; value: unknown };

const JS_READS_STDIN = /readFileSync\s*\(\s*(0|["'`]\/dev\/stdin)|process\.stdin|require\(\s*["'`]readline["'`]\s*\)/;
const PY_READS_STDIN = /\binput\s*\(|sys\.stdin/;

/** One input line → a JS value (JSON first, then space-separated tokens). */
function parseInputLine(line: string): unknown {
  const text = line.trim();
  const jsonish = text
    .replace(/\bNone\b/g, "null")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false");
  try {
    return JSON.parse(jsonish);
  } catch {
    // not JSON
  }
  const tokens = text.split(/[\s,]+/).filter(Boolean);
  const toValue = (token: string): unknown => {
    if (token === "null" || token === "None") return null;
    if (token === "true" || token === "false") return token === "true";
    const num = Number(token);
    return Number.isFinite(num) ? num : token.replace(/^["']|["']$/g, "");
  };
  return tokens.length > 1 ? tokens.map(toValue) : toValue(tokens[0] ?? "");
}

function argKind(paramName: string, annotation: string, value: unknown): ArgKind {
  if (!Array.isArray(value)) return "value";
  if (/TreeNode/.test(annotation) || /root|tree/i.test(paramName)) return "tree";
  if ((paramName === "p" || paramName === "q") && !/ListNode/.test(annotation)) return "tree";
  if (/ListNode/.test(annotation) || /^(head\w*|l\d|list\d*)$/i.test(paramName)) return "list";
  return "value";
}

type Param = { name: string; annotation: string };

/** Splits on commas outside brackets (type hints like `Dict[str, int]` contain commas). */
function splitTopLevel(raw: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of raw) {
    if ("[({<".includes(char)) depth++;
    if ("])}>".includes(char)) depth--;
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts;
}

function splitParams(raw: string): Param[] {
  return splitTopLevel(raw)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [nameAndType] = part.split("=");
      const [name, annotation = ""] = nameAndType.split(":");
      return { name: name.trim().replace(/^\.\.\./, ""), annotation: annotation.trim() };
    })
    .filter((param) => param.name && param.name !== "self" && param.name !== "cls");
}

function buildArgs(params: Param[], stdin: string): HarnessArg[] {
  const lines = stdin.split(/\r?\n/).filter((line) => line.trim());
  // One param but several lines: the lines are one array (e.g. a value per line).
  const values =
    params.length === 1 && lines.length > 1
      ? [lines.map(parseInputLine)]
      : lines.map(parseInputLine);
  return values.map((value, index) => {
    const param = params[index] ?? { name: "", annotation: "" };
    return { kind: argKind(param.name, param.annotation, value), value };
  });
}

// ---------- JavaScript ----------

function findJsEntry(code: string): { name: string; params: Param[] } | null {
  const patterns = [
    /^(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\s*\w*\s*\(([^)]*)\)/m,
    /^(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/m,
    /^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/m,
  ];
  let best: { index: number; name: string; params: Param[] } | null = null;
  for (const pattern of patterns) {
    const match = pattern.exec(code);
    if (match && (!best || match.index < best.index)) {
      best = { index: match.index, name: match[1], params: splitParams(match[2]) };
    }
  }
  // Helper constructors the user defined themselves are not the entry point.
  if (!best || /^(TreeNode|ListNode|Node)$/.test(best.name)) return null;
  return { name: best.name, params: best.params };
}

function jsHeader(code: string): string {
  const defs: string[] = [];
  if (!/\b(class|function)\s+TreeNode\b|\bTreeNode\s*=/.test(code)) {
    defs.push(
      "function TreeNode(val, left, right) { this.val = val === undefined ? 0 : val; this.left = left === undefined ? null : left; this.right = right === undefined ? null : right; }"
    );
  }
  if (!/\b(class|function)\s+ListNode\b|\bListNode\s*=/.test(code)) {
    defs.push(
      "function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; }"
    );
  }
  return defs.join(" ");
}

function jsDriver(entryName: string, args: HarnessArg[]): string {
  return `

;(function __cusRun() {
  const __args = ${JSON.stringify(args)};
  const __tree = (arr) => {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length && i < arr.length) {
      const node = queue.shift();
      if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
      i++;
      if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
      i++;
    }
    return root;
  };
  const __list = (arr) => { let head = null; for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head); return head; };
  const __isTree = (x) => x && typeof x === "object" && "val" in x && "left" in x && "right" in x;
  const __isList = (x) => x && typeof x === "object" && "val" in x && "next" in x;
  const __out = (x) => {
    if (__isTree(x)) {
      const res = []; const queue = [x];
      while (queue.length) { const n = queue.shift(); if (n) { res.push(n.val); queue.push(n.left, n.right); } else res.push(null); }
      while (res.length && res[res.length - 1] === null) res.pop();
      return res;
    }
    if (__isList(x)) { const res = []; for (let n = x, k = 0; n && k < 10000; n = n.next, k++) res.push(n.val); return res; }
    if (x instanceof Set) return [...x].map(__out);
    if (x instanceof Map) return Object.fromEntries([...x].map(([k, v]) => [k, __out(v)]));
    if (Array.isArray(x)) return x.map(__out);
    return x;
  };
  const __input = __args.map((a) => a.kind === "tree" ? __tree(a.value) : a.kind === "list" ? __list(a.value) : a.value);
  const __result = ${entryName}(...__input);
  const __shown = __result === undefined && __input.length ? __input[0] : __result;
  console.log(typeof __shown === "string" ? JSON.stringify(__shown) : JSON.stringify(__out(__shown)));
})();
`;
}

/** Already prints from top-level code — a full program, not a function-only solution. */
const JS_TOP_LEVEL_PRINT = /^(?:console\.log|process\.stdout\.write)\s*\(/m;
const PY_TOP_LEVEL_PRINT = /^print\s*\(/m;

function buildJsHarness(code: string, stdin: string): FunctionHarness | null {
  if (JS_READS_STDIN.test(code) || JS_TOP_LEVEL_PRINT.test(code) || /\.prototype\./.test(code)) {
    return null;
  }
  const entry = findJsEntry(code);
  if (!entry) return null;

  const header = jsHeader(code);
  const body = header ? `${header} ${code}` : code;
  if (!stdin.trim()) {
    return { code: body, entryName: entry.name, calledWithInput: false };
  }
  return {
    code: body + jsDriver(entry.name, buildArgs(entry.params, stdin)),
    entryName: entry.name,
    calledWithInput: true,
  };
}

// ---------- Python ----------

function findPyEntry(code: string): { call: string; params: Param[]; name: string } | null {
  // class Solution: its first public method.
  const classMatch = /^class\s+Solution\b/m.exec(code);
  if (classMatch) {
    const methods = /^[ \t]+def\s+([A-Za-z]\w*)\s*\(([^)]*)\)/gm;
    methods.lastIndex = classMatch.index;
    const method = methods.exec(code);
    if (method) {
      return { call: `Solution().${method[1]}`, params: splitParams(method[2]), name: method[1] };
    }
  }
  const fn = /^def\s+([A-Za-z]\w*)\s*\(([^)]*)\)/m.exec(code);
  if (fn && fn[1] !== "main") {
    return { call: fn[1], params: splitParams(fn[2]), name: fn[1] };
  }
  return null;
}

function pyHeader(code: string): string {
  const defs: string[] = [];
  if (!/^class\s+TreeNode\b/m.test(code)) {
    defs.push(
      "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val; self.left = left; self.right = right"
    );
  }
  if (!/^class\s+ListNode\b/m.test(code)) {
    defs.push(
      "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val; self.next = next"
    );
  }
  const execs = defs.map((def) => `exec("${def}")`).join("; ");
  // One line, so the user's line numbers don't move.
  return `from typing import *; import json, collections, math, heapq, bisect, itertools, functools, sys${execs ? `; ${execs}` : ""}`;
}

function pyDriver(call: string, args: HarnessArg[]): string {
  return `

def __cus_run():
    args = json.loads(${JSON.stringify(JSON.stringify(args))})
    def to_tree(arr):
        if not arr or arr[0] is None:
            return None
        root = TreeNode(arr[0]); queue = collections.deque([root]); i = 1
        while queue and i < len(arr):
            node = queue.popleft()
            if i < len(arr) and arr[i] is not None:
                node.left = TreeNode(arr[i]); queue.append(node.left)
            i += 1
            if i < len(arr) and arr[i] is not None:
                node.right = TreeNode(arr[i]); queue.append(node.right)
            i += 1
        return root
    def to_list(arr):
        head = None
        for v in reversed(arr):
            head = ListNode(v, head)
        return head
    def out(x):
        if hasattr(x, "left") and hasattr(x, "right") and hasattr(x, "val"):
            res = []; queue = collections.deque([x])
            while queue:
                n = queue.popleft()
                if n:
                    res.append(n.val); queue.append(n.left); queue.append(n.right)
                else:
                    res.append(None)
            while res and res[-1] is None:
                res.pop()
            return res
        if hasattr(x, "next") and hasattr(x, "val"):
            res = []; n = x; k = 0
            while n and k < 10000:
                res.append(n.val); n = n.next; k += 1
            return res
        if isinstance(x, (set, frozenset, tuple)):
            return [out(v) for v in x]
        if isinstance(x, list):
            return [out(v) for v in x]
        if isinstance(x, dict):
            return {str(k): out(v) for k, v in x.items()}
        return x
    values = [to_tree(a["value"]) if a["kind"] == "tree" else to_list(a["value"]) if a["kind"] == "list" else a["value"] for a in args]
    result = ${call}(*values)
    shown = values[0] if result is None and values else result
    print(json.dumps(out(shown)))

__cus_run()
`;
}

function buildPyHarness(code: string, stdin: string): FunctionHarness | null {
  if (
    PY_READS_STDIN.test(code) ||
    PY_TOP_LEVEL_PRINT.test(code) ||
    /__name__\s*==\s*["']__main__["']/.test(code)
  ) {
    return null;
  }
  const entry = findPyEntry(code);
  if (!entry) return null;

  // Python can't share line 1 with the user's code, so error line numbers are 1 higher.
  const body = `${pyHeader(code)}\n${code}`;
  if (!stdin.trim()) {
    return { code: body, entryName: entry.name, calledWithInput: false };
  }
  return {
    code: body + pyDriver(entry.call, buildArgs(entry.params, stdin)),
    entryName: entry.name,
    calledWithInput: true,
  };
}

/** null = not a function-style solution (run the code as-is). */
export function buildFunctionHarness(
  language: string,
  code: string,
  stdin: string
): FunctionHarness | null {
  if (language === "javascript") return buildJsHarness(code, stdin);
  if (language === "python") return buildPyHarness(code, stdin);
  return null;
}
