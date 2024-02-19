import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { http_methods } from "../Functions/HTTPMethods";
import { Button, Col, Divider, Panel, Row } from "rsuite";
import CommonList from "../components/Data/CommonList";
import { TaskType } from "../interfaces/EntityTypes/TaskType";
import ContentLoader from "../components/Loader";
import PieChart from "../components/Data/PieChart";
import { ProjectType } from "../interfaces/EntityTypes/ProjectType";
import { Link } from "react-router-dom";

type DashboardData = {
  tasks: TaskType[];
  projects: ProjectType[];
  projectsCount: number;
  tasksCount: number;
  usersCount: number;
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    http_methods.fetch<DashboardData>("/dashboardData").then((res) => {
      setDashboardData(res);
      setLoaded(true);
    });
  }, []);

  return (
    <AppLayout title="Dashboard" activePage="Dashboard">
      <ContentLoader loaded={loaded}>
        <Row gutter={30} className="dashboard-header">
          <Col xs={8}>
            <Panel className="trend-box bg-gradient-red">
              {/* <img className="chart-img" src={images.PVIcon} /> */}
              <div className="title">Co-workers</div>
              <div className="value">{dashboardData?.usersCount}</div>
            </Panel>
          </Col>
          <Col xs={8}>
            <Panel className="trend-box bg-gradient-green">
              {/* <img className="chart-img" src={images.VVICon} /> */}
              <div className="title">Shared Projects</div>
              <div className="value">{dashboardData?.projectsCount}</div>
            </Panel>
          </Col>
          <Col xs={8}>
            <Panel className="trend-box bg-gradient-blue">
              {/* <img className="chart-img" src={images.UVIcon} /> */}
              <div className="title">Shared tasks</div>
              <div className="value">{dashboardData?.tasksCount}</div>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col xs={16}>
            {dashboardData?.projects.length > 0 && (
              <>
                <h3>Leaded projects</h3>
                <CommonList<ProjectType>
                  entity="projects"
                  label={(t) => t.name}
                  /** @ts-ignore */
                  items={dashboardData?.projects}
                  onDelete={() => {}}
                  additionalInfo={(t) => (
                    <>
                      {/* Space: {t.} */}
                      Days left:{" "}
                      {Math.floor(
                        (new Date(t.endDate.date).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </>
                  )}
                  sortingDefaults={{ direction: "asc", field: "endDate" }}
                  onEmpty="You don't have any assigned and uncompleted tasks!"
                  buttons={{
                    deleteable: false,
                    hasOptions: false,
                    hasView: true,
                  }}
                />
                <br />
              </>
            )}
            <h3>Most urgent Tasks</h3>
            <CommonList<TaskType>
              entity="projects"
              ownButtons={(t) => (
                <Button
                  appearance="ghost"
                  size="sm"
                  as={Link}
                  to={`/projects/${t.projectId}`}
                  color="blue"
                  // state={{ backlink: inViewBacklink }}
                >
                  Show
                </Button>
              )}
              label={(t) => t.name}
              /** @ts-ignore */
              items={dashboardData?.tasks}
              onDelete={() => {}}
              additionalInfo={(t) => (
                <>
                  {/* Space: {t.} */}
                  Days left:{" "}
                  {Math.floor(
                    (new Date(t.endDate.date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </>
              )}
              sortingDefaults={{ direction: "asc", field: "endDate" }}
              onEmpty="You don't have any assigned and uncompleted tasks!"
              buttons={{
                deleteable: false,
                hasOptions: false,
                hasView: true,
              }}
            />
          </Col>

          <Col xs={8}>
            <PieChart
              title="Statistics"
              data={[10000, 3000, 2000]}
              type="pie"
              labels={["Some", "Other", "Data"]}
            />
          </Col>
        </Row>
      </ContentLoader>
    </AppLayout>
  );
};

export default Dashboard;
