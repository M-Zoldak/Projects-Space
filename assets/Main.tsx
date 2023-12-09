import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { CustomProvider } from "rsuite";
import Login from "./pages/Login/Login";
import Registration from "./pages/Login/Registration";
import Protected from "./components/Protection/Protected";
import RegistrationConfirmation from "./pages/Login/RegistrationConfirmation";
import GuestsOnly from "./components/Protection/GuestsOnly";
import CreateApp from "./pages/App/Create";
import OptionsApp from "./pages/App/Options";
import AppRoleOptions from "./pages/AppRole/Options";
import ProjectsList from "./pages/Project/List";
import AppsList from "./pages/App/List";
import NotificationsProvider from "./contexts/NotificationsContext";
import AppDataProvider from "./contexts/AppDataContext";
import Project from "./pages/Project/Project";
import Profile from "./pages/Profile";
import ClientsList from "./pages/Client/List";
import ClientOptions from "./pages/Client/Options";
import ContactOptions from "./pages/Client/Contact/Options";
import AddressOptions from "./pages/Client/Address/Options";
import WebsitesList from "./pages/Website/List";

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
          path="/websites"
          element={
            <Protected>
              <WebsitesList />
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
          path="/apps/create"
          element={
            <Protected>
              <CreateApp />
            </Protected>
          }
        />

        <Route
          path="/apps/:id/options"
          element={
            <Protected>
              <OptionsApp />
            </Protected>
          }
        />

        <Route
          path="app-roles/:id/options"
          element={
            <Protected>
              <AppRoleOptions />
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
          path="/projects/:id"
          element={
            <Protected>
              <Project />
            </Protected>
          }
        />

        <Route
          path="/clients"
          element={
            <Protected>
              <ClientsList />
            </Protected>
          }
        />

        <Route
          path="/clients/:id/options"
          element={
            <Protected>
              <ClientOptions />
            </Protected>
          }
        />

        <Route
          path="/clients/:id/addresses/:addressId/options"
          element={
            <Protected>
              <AddressOptions />
            </Protected>
          }
        />

        <Route
          path="/clients/:id/contacts/:contactId/options"
          element={
            <Protected>
              <ContactOptions />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
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
