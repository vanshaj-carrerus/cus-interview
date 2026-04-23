import vm from "node:vm";
import ts from "typescript";
import type { TopicData } from "@/app/practice/data/types";

export function parseTopicDataFromUploadedTsFile(source: string): TopicData {
  const sourceWithoutImports = source.replace(/^\s*import[\s\S]*?;?\s*$/gm, "");
  const transpiled = ts.transpileModule(sourceWithoutImports, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const moduleExports: Record<string, unknown> = {};
  const sandbox: { module: { exports: Record<string, unknown> }; exports: Record<string, unknown> } = {
    module: { exports: moduleExports },
    exports: moduleExports,
  };
  vm.runInNewContext(transpiled, sandbox, { timeout: 1000 });

  const exportedValues = [...Object.values(sandbox.module.exports ?? {}), ...Object.values(sandbox.exports ?? {})];
  const candidate = exportedValues.find((value) => {
    if (!value || typeof value !== "object") return false;
    const maybeTopic = value as Partial<TopicData>;
    return (
      typeof maybeTopic.slug === "string" &&
      typeof maybeTopic.title === "string" &&
      typeof maybeTopic.intro === "string" &&
      Array.isArray(maybeTopic.levels)
    );
  });

  if (!candidate) {
    throw new Error("Uploaded file must export a TopicData object.");
  }

  return candidate as TopicData;
}
