import Link from "next/link";

export const LOGO_SRC = "/cus-interview-logo-cropped.png?v=20260714";
export const LOGO_ALT = "CUS Interview";

type LogoProps = {
  href?: string | null;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export default function Logo({
  href = "/",
  className = "",
  width = 140,
  height = 62,
  priority = false,
}: LogoProps) {
  const image = (
    // Plain img so width/height always apply (Next/Image was shrinking in the navbar).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`block shrink-0 object-contain ${className}`.trim()}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        maxWidth: "none",
      }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}
