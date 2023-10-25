import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CreateSite from './pages/Site/CreateSite';
import Site from './pages/Site/Site';
import Sites from './pages/Sites';
import { CustomProvider } from 'rsuite';
import Login from './pages/Login/Login';
import Registration from './pages/Login/Registration';

function Main() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/site">
                    <Route index element={<Site />} />
                    <Route path="/site/:id" element={<Site siteId="" />} />
                    <Route path="/site/create" element={<CreateSite />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default Main;

if (document.getElementById('app')) {
    const rootElement = document.getElementById('app');
    const root = createRoot(rootElement);

    root.render(
        <CustomProvider theme="dark">
            <StrictMode>
                <Main />
            </StrictMode>
        </CustomProvider>
    );
}
