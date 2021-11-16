import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import { BarGrafico } from "../../charts/Bar/index";
import axios from "axios";
const baseurl = process.env.REACT_APP_APIBASE;

const UsersOverview = ({nameroute}) => {
  const [datastats, setdatastats] = useState();

  useEffect(() => {
    async function fetchData() {
      await axios.get(`${baseurl}stats/${nameroute}`).then(response => {
        setdatastats(response.data[0]);
      });
    }

    fetchData();
  }, []);

  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        {datastats != null && <h6 className="m-0">{datastats.title}</h6>}
      </CardHeader>
      <CardBody className="pt-0">
        {datastats != null && <BarGrafico databar={datastats} />}
      </CardBody>
    </Card>
  );
};

export default UsersOverview;
