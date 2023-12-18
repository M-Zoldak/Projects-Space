import { Col, Panel, Row } from "rsuite";
import FluidText from "../../components/Text/FluidText";
import PortalLayout from "../../layouts/PortalLayout";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import FluidTextWrapper from "../../components/Text/FluidTextWrapper";

type CardType = PropsWithChildren<{
  header: string;
}>;

const Card = ({ header, children }: CardType) => (
  <Panel shaded bordered header={header} style={{ textAlign: "center" }}>
    {children}
  </Panel>
);

export default function Home() {
  return (
    <PortalLayout activePage="Home" title="Homepage">
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        O projeckcie można przeczytać w zakładce About
      </h1>

      <FluidTextWrapper
        className="startpage"
        styles={{ maxWidth: 800, margin: "auto" }}
      >
        <p>
          Unleash your creativity and bring your ideas to life in our dedicated
          Projects Space. Whether you're a seasoned developer or just starting
          your coding journey, this is the place to turn your dreams into
          reality.
        </p>

        <h2 style={{ textAlign: "center", marginBlock: "1.5rem" }}>
          Why Projects Space?
        </h2>

        <Row gutter={16}>
          <Col md={8} sm={24}>
            <Card header="Community Collaboration">
              Connect with like-minded programmers, share insights, and
              collaborate on projects that matter to you.
            </Card>
          </Col>
          <Col md={8} sm={24}>
            <Card header="Skill Enhancement">
              Elevate your PHP and JavaScript skills by working on real-world
              projects, learning from peers, and receiving valuable feedback.
            </Card>
          </Col>
          <Col md={8} sm={24}>
            <Card header="Showcase Your Work">
              Display your projects proudly, build a portfolio, and let your
              accomplishments speak for themselves.
            </Card>
          </Col>
        </Row>

        <p style={{ textAlign: "center" }}>
          Ready to embark on your coding journey?
          <br /> <Link to="/register">Join Projects Space</Link> today and let
          your ideas take flight!
        </p>
      </FluidTextWrapper>
    </PortalLayout>
  );
}
