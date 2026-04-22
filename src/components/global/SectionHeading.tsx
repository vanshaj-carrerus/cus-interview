type SectionHeadingProps = {
  title: string;
  emphasis?: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  title,
  emphasis,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
        {title}{" "}
        {emphasis && <span className="text-primary font-extrabold">{emphasis}</span>}
      </h2>
      <div className="h-1 w-24 rounded-full bg-primary/70" />
      {description && (
        <p className="max-w-3xl text-sm md:text-base text-slate-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
