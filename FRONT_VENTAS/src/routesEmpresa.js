// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import ViewConsultas from "./views/AdminConsultas";

export default [
  {
    path: "/",
    layout: DefaultLayout,
    component: ViewConsultas
  },

];
