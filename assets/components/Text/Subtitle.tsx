import { PropsWithChildren } from "react";

export default function Subtitle({ children }: PropsWithChildren) {
  return children ? (
    <h3 style={{ marginBottom: "15px" }}>{children}</h3>
  ) : (
    <h3 style={{ marginBottom: "15px" }}>Loading...</h3>
  );
}
