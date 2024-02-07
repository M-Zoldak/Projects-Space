import { Link, useParams } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import Backlink from "../../components/Buttons/Backlink";
import {
  Button,
  ButtonToolbar,
  Col,
  FlexboxGrid,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faUserGear } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import FluidText from "../../components/Text/FluidText";
import { Editor } from "@tinymce/tinymce-react";
import ReactQuill, { Quill } from "react-quill";
import Notes from "../../components/Data/Notes";
import { useCookies } from "react-cookie";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { HoverTooltip } from "../../components/Text/Tooltip";

export default function Project() {
  const params = useParams();
  const [cookies] = useCookies();
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [app, setApp] = useState<AppType>(null);
  // const [stepsWidth, setStepsWitdh] = useState(500);
  const [project, setProject] = useState<ProjectType>(null);
  const [tasks, setTasks] = useState<TaskType[]>(null);
  const [clientsSelect, setClientsSelect] = useState<SelectDataType[]>([]);
  const [managerSelect, setManagerSelect] = useState<SelectDataType[]>([]);
  const [websitesSelect, setWebsitesSelect] = useState<SelectDataType[]>([]);

  useEffect(() => {
    http_methods
      .fetch<ProjectType>(`/projects/${params.id}`)
      .then(
        ({ project, clientsSelect, websitesSelect, projectManagerSelect }) => {
          setProject(project);
          setTasks(project.tasks);
          setClientsSelect(clientsSelect);
          setWebsitesSelect(websitesSelect);
          setManagerSelect(projectManagerSelect);
          let app = appData.apps.find(
            (app) => app.id == appData.currentUser.userOptions.selectedAppId
          );
          setApp(app);
        }
      );
  }, []);

  const updateProjectManager = (projectManagerId: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project.id}/updateProjectManager`, {
        projectManagerId,
      })
      .then((proj) => setProject({ ...proj }));
  };

  const updateProjectClient = (clientId: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project.id}/updateClient`, {
        clientId,
      })
      .then((proj) => setProject({ ...proj }));
  };

  const updateProjectWebsite = (websiteId: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project.id}/updateWebsite`, {
        websiteId,
      })
      .then((proj) => setProject({ ...proj }));
  };

  const setProjectState = (id: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project.id}/updateState/${id}`, [])
      .then((project) => setProject(project));
  };

  return (
    <AppLayout title="Project overview" activePage="Projects">
      <Grid fluid={true} style={{ width: "100%" }}>
        <Row>
          <Col style={{ width: "100%" }}>
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
              <Button
                appearance="ghost"
                color="red"
                startIcon={<FontAwesomeIcon icon={faFilePdf} />}
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  let token = cookies.token;
                  if (!token) return;
                  fetch(`/api/projects/${params.id}/toPDF`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then((res) => res.blob())
                    .then((blob) => {
                      var url = window.URL.createObjectURL(blob);
                      var a = document.createElement("a");
                      a.href = url;
                      a.download = `${project.name}`;
                      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                      a.click();
                      a.remove();
                    });
                }}
              >
                Generate PDF
              </Button>
            </ButtonToolbar>
            <MainTitle>{project && project.name}</MainTitle>
            {app?.projectStates.length > 0 && (
              <Steps
                // TODO make steps horizontal on smaller screens
                // vertical={stepsWidth < 700}
                style={{
                  cursor: "pointer",
                  // marginTop: "20px",
                  padding: "20px 0",
                  // border: "1px solid grey",
                  minWidth: `700px`,

                  width: "90%",
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
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col style={{ width: "70%" }}>
            <Subtitle>Tasks</Subtitle>
            {tasks && (
              <CommonList<TaskType>
                onEmpty={
                  tasks.length > 0
                    ? "All tasks are done! Great Job!"
                    : "This project don't have any tasks yet. Create one!"
                }
                label={(task) => task.name}
                entity="tasks"
                items={tasks.filter((t) => !t.completed)}
                linkPrepend={`/projects/${params.id}`}
                sortingItems={[{ label: "Name", value: "name" }]}
                sortingDefaults={{ field: "name" }}
                checkable={true}
                onCheck={(task) => {
                  let nTasks = tasks.map((t) => {
                    if (task.id == t.id) {
                      t.completed = task.completed;
                    }
                    return t;
                  });
                  setTasks(nTasks);
                }}
                additionalInfo={(t) => (
                  <FlexboxGrid style={{ gap: "1rem" }}>
                    {t.assignedTo && (
                      <FlexboxGridItem>
                        <HoverTooltip text="Laborer">
                          <FontAwesomeIcon icon={faUserGear} />{" "}
                          {t?.assignedTo?.name}
                        </HoverTooltip>
                      </FlexboxGridItem>
                    )}
                  </FlexboxGrid>
                )}
                onDelete={(task) => {
                  addNotification({
                    text: `Task ${task.name} was deleted`,
                    notificationProps: { type: "success" },
                  });
                  let nTasks = tasks.filter((t) => t.id != task.id);
                  setTasks(nTasks);
                }}
                buttons={{
                  hasView: false,
                  hasOptions:
                    appData.currentUser.currentAppRole.permissions.projects
                      .hasOptions,
                  deleteable:
                    appData.currentUser.currentAppRole.permissions.projects
                      .deleteable,
                }}
              />
            )}
            {tasks?.filter((t) => t.completed).length > 0 && (
              <>
                <Subtitle>Finished Tasks</Subtitle>
                <CommonList<TaskType>
                  onEmpty="This project don't have any tasks yet. Create one!"
                  label={(task) => task.name}
                  entity="tasks"
                  items={tasks.filter((t) => t.completed)}
                  linkPrepend={`/projects/${params.id}`}
                  sortingItems={[{ label: "Name", value: "name" }]}
                  sortingDefaults={{ field: "name" }}
                  checkable={true}
                  onCheck={(task) => {
                    let nTasks = tasks.map((t) => {
                      if (task.id == t.id) {
                        t.completed = task.completed;
                      }
                      return t;
                    });
                    setTasks(nTasks);
                    console.log("after set Tasks");
                  }}
                  onDelete={(task) => {
                    addNotification({
                      text: `Task ${task.name} was deleted`,
                      notificationProps: { type: "success" },
                    });
                    let nTasks = tasks.filter((t) => t.id != task.id);
                    setTasks(nTasks);
                  }}
                  buttons={{
                    hasView: false,
                    hasOptions: false,
                    deleteable:
                      appData.currentUser.currentAppRole.permissions.projects
                        .deleteable,
                  }}
                />
              </>
            )}
          </Col>
          <Col>
            <Subtitle>{project ? "Project informations" : ""}</Subtitle>

            {project && (
              <div style={{ marginBlock: "10px" }}>
                <SelectPicker
                  label={"Project manager: "}
                  data={managerSelect}
                  value={project?.manager?.id}
                  onChange={updateProjectManager}
                  disabled={
                    !appData?.currentUser?.currentAppRole?.permissions?.projects
                      .hasOptions
                  }
                />
              </div>
            )}
            <FluidText>
              {project?.startDate
                ? `Start date: ${new Date(
                    project?.startDate.date
                  ).toLocaleDateString("pl")}`
                : ""}
            </FluidText>
            <FluidText>
              {project?.endDate
                ? `Deadline: ${new Date(
                    project?.endDate.date
                  ).toLocaleDateString("pl")}`
                : ""}
            </FluidText>
            {project && (
              <div style={{ marginBlock: "10px" }}>
                <SelectPicker
                  label={"Client: "}
                  data={clientsSelect}
                  value={project?.client?.id}
                  onChange={updateProjectClient}
                  disabled={
                    !appData?.currentUser?.currentAppRole?.permissions?.projects
                      .hasOptions
                  }
                />
                {project?.client?.id && (
                  <Button
                    style={{ marginLeft: "15px" }}
                    as={Link}
                    appearance="ghost"
                    color="cyan"
                    to={`/clients/${project.client.id}`}
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
                  disabled={
                    !appData?.currentUser?.currentAppRole?.permissions?.projects
                      .hasOptions
                  }
                />
                {project?.website?.id && (
                  <Button
                    style={{ marginLeft: "15px" }}
                    as={Link}
                    appearance="ghost"
                    color="cyan"
                    to={`/websites/${project.website.id}`}
                  >
                    To website
                  </Button>
                )}
              </div>
            )}
          </Col>
          {project?.notes && (
            <Notes
              notes={project?.notes}
              postUrl={`/projects/${project?.id}/addNote`}
            />
          )}
        </Row>
      </Grid>
    </AppLayout>
  );
}
