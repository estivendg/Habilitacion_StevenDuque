import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import routes from "./routes";
import routesEmpresa from "./routesEmpresa";
import withTracker from "./withTracker";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/shards-dashboards.1.1.0.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "shards-ui/dist/css/shards.min.css"
import "chartjs-plugin-labels";
import "antd/dist/antd.css";
import SignIn from "./views/Login";

export default () => (
  <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <div>
      {localStorage.getItem("user") ?(
        routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={withTracker(props => {
                return (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                );
              })}
            />
          );
        })
      ) : (
        <>
         <SignIn />
          {" "}
        </>
      )}
    </div>
  </Router>
);
