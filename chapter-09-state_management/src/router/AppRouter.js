// src/router/AppRouter.js
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const CatalogPage = lazy(() => import("../pages/CatalogPage"));
const PlayerPage = lazy(() => import("../pages/PlayerPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/player/:id" element={<PlayerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
