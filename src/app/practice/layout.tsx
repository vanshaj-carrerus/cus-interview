
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex w-full flex-col gap-4 lg:flex-row">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="w-full lg:w-auto lg:sticky lg:top-16 lg:right-0 z-10 h-fit self-start overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-hidden">
      </div>
    </div>
  );
};

export default layout;
