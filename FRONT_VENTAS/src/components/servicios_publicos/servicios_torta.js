import React from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import { DonaGrafico } from "../../charts/Torta";

const UsersByDevice = ({ data }) => {
  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        {data && <h6 className="m-0">{data.title}</h6>}
      </CardHeader>
      <CardBody className="d-flex py-0">
        {data && <DonaGrafico databar={data} />}
      </CardBody>
    </Card>
  );
};

export default UsersByDevice;
