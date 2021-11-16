import React from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import { BarGrafico } from "../../charts/Bar/index";

const UsersOverview = ({data}) => {
  return (
    <Card  style={{height: "auto" }} className="h-100">
      <CardHeader className="border-bottom">
        {data != null && <h6 className="m-0">{data.title}</h6>}
      </CardHeader>
      <CardBody className="pt-0">
        {data != null && <BarGrafico databar={data} />}
      </CardBody>
    </Card>
  );
};

export default UsersOverview;
