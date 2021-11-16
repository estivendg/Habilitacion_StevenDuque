import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "shards-react";
import Chart from "../../utils/chart";
import { DonaGrafico } from "../../charts/Torta";
import { colors } from "./helper";
import axios from "axios";
const baseurl = process.env.REACT_APP_APIBASE;

const UsersByDevice = ({nameroute}) => {

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
      {datastats&&(
         <h6 className="m-0">{datastats.title}</h6>
        )}
       
      </CardHeader>
      <CardBody className="d-flex py-0">
        {/* <canvas
          height="220"
          ref={this.canvasRef}
          className="blog-users-by-device m-auto"
        /> */}
        {datastats&&(
          <DonaGrafico databar={datastats}/>
        )}
      </CardBody>
     
    </Card>
  );
};

export default UsersByDevice;
