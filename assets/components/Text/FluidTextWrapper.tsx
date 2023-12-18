import { PropsWithChildren } from "react";

const fluidTextStyles = {
  fontSize: "1.2em",
  maxWidth: "700px",
};

export default function FluidTextWrapper({
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
    <div
      className={className ?? ""}
      style={{ ...fluidTextStyles, ...styles }}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </div>
  );
}
