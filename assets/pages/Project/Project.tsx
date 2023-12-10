import { Link, useParams } from "react-router-dom";
import StandardLayout from "../../layouts/StandardLayout";
import { MouseEventHandler, SyntheticEvent, useEffect, useState } from "react";
import { http_methods } from "../../Functions/Fetch";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import Backlink from "../../components/Buttons/Backlink";
import {
  Button,
  ButtonToolbar,
  Col,
  Grid,
  Row,
  SelectPicker,
  Steps,
} from "rsuite";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { TaskType } from "../../interfaces/EntityTypes/TaskType";
import CommonList from "../../components/Data/CommonList";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import MainTitle from "../../components/Text/MainTitle";
import { SelectDataType } from "../../interfaces/DefaultTypes";
import Subtitle from "../../components/Text/Subtitle";
import { AppType } from "../../interfaces/EntityTypes/AppType";
import { isButtonElement } from "react-router-dom/dist/dom";

export default function Project() {
  const params = useParams();
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [app, setApp] = useState<AppType>(null);
  // const [stepsWidth, setStepsWitdh] = useState(500);
  const [project, setProject] = useState<ProjectType>(null);
  const [tasks, setTasks] = useState<TaskType[]>(null);
  const [clientsSelect, setClientsSelect] = useState<SelectDataType[]>([]);
  const [websitesSelect, setWebsitesSelect] = useState<SelectDataType[]>([]);

  useEffect(() => {
    http_methods
      .fetch<ProjectType>(appData.token, `/projects/${params.id}`)
      .then(({ project, clientsSelect, websitesSelect }) => {
        setProject(project);
        setTasks(project.tasks);
        setClientsSelect(clientsSelect);
        setWebsitesSelect(websitesSelect);
        let app = appData.apps.find(
          (app) => app.id == appData.currentUser.userOptions.selectedAppId
        );
        setApp(app);
      });
  }, []);

  const updateProjectClient = (clientId: string) => {
    http_methods
      .put<ProjectType>(
        `/projects/${project.id}/updateClient`,
        {
          clientId,
        },
        appData.token
      )
      .then((proj) => setProject({ ...proj }));
  };

  const updateProjectWebsite = (websiteId: string) => {
    http_methods
      .put<ProjectType>(
        `/projects/${project.id}/updateWebsite`,
        {
          websiteId,
        },
        appData.token
      )
      .then((proj) => setProject({ ...proj }));
  };

  const setProjectState = (id: string) => {
    http_methods
      .put<ProjectType>(
        `/projects/${project.id}/updateState/${id}`,
        [],
        appData.token
      )
      .then((project) => setProject(project));
  };

  console.log(project);
  console.log(app?.projectStates);

  return (
    <StandardLayout title="Project overview" activePage="Projects">
      <Grid fluid={true} style={{ width: "100%" }}>
        <Row>
          <Col style={{ width: "75%" }}>
            <ButtonToolbar style={{ marginBottom: "20px" }}>
              <Backlink link="/projects" />
              <SimpleCreateModal<TaskType>
                entity="tasks"
                prependQuery={`/projects/${params.id}`}
                buttonText="Create new Task"
                title="Create new task"
                onSuccess={(task) => {
                  setTasks([...tasks, task]);
                  addNotification({
                    text: `Task ${task.name} was created succesfully!`,
                    notificationProps: { type: "success" },
                  });
                }}
              />
            </ButtonToolbar>
            <MainTitle>{project && project.name}</MainTitle>
            <Steps
              // vertical={stepsWidth < 700}
              style={{
                cursor: "pointer",
                // marginTop: "20px",
                padding: "20px 0",
                // border: "1px solid grey",
                minWidth: `700px`,
                // width: "100%",
              }}
              current={project?.projectState?.position ?? 0}
            >
              {app?.projectStates
                ?.sort((i, i2) => (i.position > i2.position ? 1 : 0))
                .map((state, index) => {
                  return (
                    <Steps.Item
                      key={index}
                      title={state.name}
                      onClick={() => setProjectState(state.id)}
                    />
                  );
                })}
            </Steps>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col>
            <Subtitle>Tasks</Subtitle>
            {tasks && (
              <CommonList<TaskType>
                onEmpty="This project don't have any tasks yet. Create one!"
                label={(task) => task.name}
                entity="tasks"
                items={tasks}
                linkPrepend={`/projects/${params.id}`}
                sortingItems={[{ label: "Name", value: "name" }]}
                sortingDefaults={{ field: "name" }}
                onDelete={(task) => {
                  addNotification({
                    text: `Task ${task.name} was deleted`,
                    notificationProps: { type: "success" },
                  });
                  let newTasks = tasks.filter((t) => t.id != task.id);
                  setTasks(newTasks);
                }}
              />
            )}
          </Col>
          <Col>
            <Subtitle>{project ? "Project informations" : ""}</Subtitle>
            {project && (
              <div style={{ marginBottom: "10px" }}>
                <SelectPicker
                  label={"Client: "}
                  data={clientsSelect}
                  value={project?.client?.id}
                  onChange={updateProjectClient}
                />
                {project?.client?.id && (
                  <Button
                    style={{ marginLeft: "15px" }}
                    as={Link}
                    appearance="ghost"
                    color="cyan"
                    to={`/clients/${project.client.id}/options`}
                  >
                    To client
                  </Button>
                )}
              </div>
            )}
            {project && (
              <div style={{ marginBottom: "10px" }}>
                <SelectPicker
                  label={"Website: "}
                  data={websitesSelect}
                  value={project?.website?.id}
                  onChange={updateProjectWebsite}
                />
                {project?.website?.id && (
                  <Button
                    style={{ marginLeft: "15px" }}
                    as={Link}
                    appearance="ghost"
                    color="cyan"
                    to={`/websites/${project.website.id}/options`}
                  >
                    To website
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Grid>
    </StandardLayout>
  );
}
