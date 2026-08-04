import CompilerPage from "@/app/compiler/page";

export default function DashboardCompilerPage() {
  return (
    <div className="min-h-0">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
          Compiler
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-secondary/55">
          Write, compile, and run code instantly with support for multiple languages.
        </p>
      </header>

      <CompilerPage embedded />
    </div>
  );
}
