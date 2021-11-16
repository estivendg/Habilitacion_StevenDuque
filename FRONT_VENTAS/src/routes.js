import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import ViewPacientes from "./views/AdminPacientes";
import ViewEmpresas from "./views/Adminempresas";
import ViewConsultas from "./views/AdminConsultas";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/usuarios" />
  },
  {
    path: "/usuarios",
    layout: DefaultLayout,
    component: ViewPacientes
  },

  {
    path: "/productos",
    layout: DefaultLayout,
    component: ViewEmpresas
  },
  {
    path: "/ventas",
    layout: DefaultLayout,
    component: ViewConsultas
  }
];
