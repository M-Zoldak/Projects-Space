import { Col, Divider, Panel, Row } from "rsuite";
import FluidText from "./Text/FluidText";
import MainTitle from "./Text/MainTitle";
import Subtitle from "./Text/Subtitle";
import Backlink from "./Buttons/Backlink";

type StandardViewProps = {
  mainTitle: string;
  items: StandardViewBlockProps[];
  backlink: string;
};

type StandardViewBlockProps = {
  subtitle?: string;
  items: any;
  textBlocks: TextBlockProps[];
};

type TextBlockProps =
  | {
      name: string;
      value: string;
      dynamicProp?: boolean;
      title?: boolean;
    }
  | any;

function StandardViewBlock({
  items,
  textBlocks,
  subtitle,
}: StandardViewBlockProps) {
  return (
    <>
      {subtitle &&
        ((Array.isArray(items) && items.length > 0) ||
          !Array.isArray(items)) && <Subtitle>{subtitle}</Subtitle>}
      <Row>
        {Array.isArray(items) ? (
          items.map((item, index) => (
            <TextBlock key={index} textBlocks={textBlocks} item={item} />
          ))
        ) : (
          <TextBlock textBlocks={textBlocks} />
        )}
      </Row>
    </>
  );
}

function TextBlock({
  textBlocks,
  item = null,
}: {
  textBlocks: TextBlockProps[];
  item?: any;
}) {
  return (
    <Col lg={12} sm={24} xxl={8} style={{ marginBottom: "10px" }}>
      <Panel bordered>
        <FluidText>
          {textBlocks &&
            textBlocks.map((i, index: number) =>
              (!i.dynamicProp && i.value) ||
              (i.dynamicProp && item[i.value]) ? (
                <p
                  key={index}
                  style={{
                    fontSize: i.title ? "1.2em" : "",
                    display: i.title ? "inline" : "",
                  }}
                >
                  {i.title ? "" : `${i.name}: `}
                  {i.dynamicProp ? item[i.value] : i.value}
                  {i.title ? " " : ""}
                </p>
              ) : (
                ""
              )
            )}
        </FluidText>
      </Panel>
    </Col>
  );
}

export default function StandardView({
  mainTitle,
  items,
  backlink,
}: StandardViewProps) {
  return (
    <div className="standardView">
      <Backlink link={backlink} />
      <br />
      <MainTitle>{mainTitle}</MainTitle>
      <Divider />
      {items &&
        items.map((i, index) => <StandardViewBlock {...i} key={index} />)}
    </div>
  );
}
