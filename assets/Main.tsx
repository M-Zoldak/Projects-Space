import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Sites from "./pages/Sites";
import { CustomProvider } from "rsuite";
import Login from "./pages/Login/Login";
import Registration from "./pages/Login/Registration";
import Protected from "./components/Protection/Protected";
import RegistrationConfirmation from "./pages/Login/RegistrationConfirmation";
import GuestsOnly from "./components/Protection/GuestsOnly";
import CreateApp from "./pages/App/Create";
import OptionsApp from "./pages/App/Options";
import OptionsAppRole from "./pages/AppRole/Options";
import ProjectsList from "./pages/Project/List";
import AppsList from "./pages/App/List";
import NotificationsProvider from "./contexts/NotificationsContext";
import AppDataProvider from "./contexts/AppDataContext";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={
            <GuestsOnly>
              <Login />
            </GuestsOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestsOnly>
              <Registration />
            </GuestsOnly>
          }
        />
        <Route
          path="/register/confirm"
          element={
            <GuestsOnly>
              <RegistrationConfirmation />
            </GuestsOnly>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="/sites"
          element={
            <Protected>
              <Sites />
            </Protected>
          }
        />
        <Route
          path="/apps"
          element={
            <Protected>
              <AppsList />
            </Protected>
          }
        />
        <Route
          path="/app/create"
          element={
            <Protected>
              <CreateApp />
            </Protected>
          }
        />
        <Route
          path="/apps/options/:id"
          element={
            <Protected>
              <OptionsApp />
            </Protected>
          }
        />

        <Route
          path="/projects"
          element={
            <Protected>
              <ProjectsList />
            </Protected>
          }
        />

        <Route
          path="/app_role/options/:id"
          element={
            <Protected>
              <OptionsAppRole />
            </Protected>
          }
        />

        <Route
          path="/about"
          element={
            <Protected>
              <About />
            </Protected>
          }
        />
        <Route
          path="/contact"
          element={
            <Protected>
              <Contact />
            </Protected>
          }
        />
        <Route element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default Main;

if (document.getElementById("app")) {
  const rootElement = document.getElementById("app") as HTMLElement;
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <AppDataProvider>
        <CustomProvider theme="dark">
          <NotificationsProvider>
            <Main />
          </NotificationsProvider>
        </CustomProvider>
      </AppDataProvider>
    </StrictMode>
  );
}
