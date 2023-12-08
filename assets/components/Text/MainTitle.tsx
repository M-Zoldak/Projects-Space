import { PropsWithChildren } from "react";

export default function MainTitle({ children }: PropsWithChildren) {
  return children ? <h2>{children}</h2> : "Loading...";
}
