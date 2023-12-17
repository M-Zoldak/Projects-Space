import React, { PropsWithChildren } from "react";
import svg from "../../images/errors/404.svg";
import FluidText from "../Text/FluidText";

export default function ErrorPage({
  code,
  children,
}: PropsWithChildren<{ code: number }>) {
  return (
    <div className="error-page">
      <div className="item" style={{ textAlign: "center" }}>
        <img
          src={svg.toString()}
          style={{
            width: "clamp(300px, 80%, 650px)",
            maxWidth: "100%",
            marginBottom: "2rem",
          }}
        />
        <div className="text">
          <h1 className="error-page-code">{code}</h1>
          <FluidText>{children}</FluidText>
        </div>
      </div>
    </div>
  );
}
