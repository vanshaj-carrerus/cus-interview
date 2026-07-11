export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-full flex-col gap-4 lg:flex-row">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="scrollbar-hidden h-fit w-full self-start overflow-y-auto max-h-[calc(100vh-64px)] lg:sticky lg:top-16 lg:right-0 lg:w-auto lg:z-10" />
    </div>
  );
}
