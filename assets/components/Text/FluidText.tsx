import { PropsWithChildren } from 'react';

const fluidTextStyles = {
  fontSize: '1.2em',
};

export default function FluidText({ children }: PropsWithChildren) {
  return <span style={fluidTextStyles}>{children}</span>;
}
