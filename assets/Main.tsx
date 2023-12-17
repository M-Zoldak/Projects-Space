import React, { StrictMode, createContext, useContext, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/Regular/About";
import Contact from "./pages/Regular/Contact";
import NotFound from "./pages/Regular/NotFound";
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
import WebsiteOptions from "./pages/Website/Options";
import Website from "./pages/Website/Website";
import Client from "./pages/Client/Client";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Regular/Home";
import Calendar from "./pages/calendar/Calendar";
import AccessControlProvider from "./contexts/PlaceContext";
import ProjectOptions from "./pages/Project/Options";
import { CookiesProvider } from "react-cookie";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
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
              <Dashboard />
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
          path="/websites/:id/options"
          element={
            <Protected>
              <WebsiteOptions />
            </Protected>
          }
        />
        <Route
          path="/websites/:id"
          element={
            <Protected>
              <Website />
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
          path="/projects/:id/options"
          element={
            <Protected>
              <ProjectOptions />
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
          path="/clients/:id"
          element={
            <Protected>
              <Client />
            </Protected>
          }
        />

        <Route
          path="/calendar"
          element={
            <Protected>
              <Calendar />
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

        <Route path="*" element={<NotFound />} />
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
      <CookiesProvider>
        <AppDataProvider>
          {/* <AccessControlProvider> */}
          <CustomProvider theme="dark">
            <NotificationsProvider>
              <Main />
            </NotificationsProvider>
          </CustomProvider>
          {/* </AccessControlProvider> */}
        </AppDataProvider>
      </CookiesProvider>
    </StrictMode>
  );
}
