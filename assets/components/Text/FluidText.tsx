import { PropsWithChildren } from "react";

const fluidTextStyles = {
  fontSize: "1.2em",
  maxWidth: "700px",
};

export default function FluidText({
  children,
  className,
  styles,
  dangerouslySetInnerHTML,
}: PropsWithChildren<{
  className?: string;
  styles?: object;
  dangerouslySetInnerHTML?: { __html: TrustedHTML };
}>) {
  return (
    <p
      className={className ?? ""}
      style={{ ...fluidTextStyles, ...styles }}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </p>
  );
}
