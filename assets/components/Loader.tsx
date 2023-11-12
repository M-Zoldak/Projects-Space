import { PropsWithChildren } from 'react';
import { FlexboxGrid, Loader } from 'rsuite';

type LoaderOptions = PropsWithChildren<{
  loaded: boolean;
}>;

export default function ContentLoader({ children, loaded }: LoaderOptions) {
  return loaded ? (
    children
  ) : (
    <FlexboxGrid align="middle" justify="center" style={{ height: 100 + '%' }}>
      <Loader content="Loading..." vertical />
    </FlexboxGrid>
  );
}
