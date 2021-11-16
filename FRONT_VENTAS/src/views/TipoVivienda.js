import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, Badge } from "shards-react";
import axios from "axios";
import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import UsersOverview from "../components/blog/Estrato";
import UsersByDevice from "../components/blog/Estrato_pie";
import {PostsListOne} from './helper'
const baseurl = process.env.REACT_APP_APIBASE;
const BlogOverview = () => {
  const [datastats, setdatastats] = useState({ data: [], totalregistros: 0 });
  const handleLoadStats = () => {
    axios.get(`${baseurl}stats/data_home1_dash`).then(response => {
      setdatastats({
        data: response.data[0],
        totalregistros: response.data[1]
      });
    });
  };

  useEffect(() => {
    handleLoadStats();
  }, []);
  const smallStats = [
    {
      label: "Total viviendas encuestadas",
      value: datastats.totalregistros["total_registros"],
      percentage: "100%",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    }
  ];

 

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Dashboard"
          subtitle="Alcaldia de barrancas"
          className="text-sm-left mb-3"
        />
      </Row>

      <Row>
        {PostsListOne.map((post, idx) => (
          <Col lg="4" md="6" sm="6" className="mb-2" key={idx}>
            <Card small className="card-post card-post--1">
              <div
                className="card-post__image"
                style={{ backgroundImage: `url(${post.backgroundImage})` }}
              >
                <Badge
                  pill
                  className={`card-post__category bg-${post.categoryTheme}`}
                >
                  {post.category}
                </Badge>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Small Stats Blocks */}
      <Row>
        {smallStats.map((stats, idx) => (
          <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
            <SmallStats
              id={`small-stats-${idx}`}
              variation="1"
              chartData={stats.datasets}
              chartLabels={stats.chartLabels}
              label={stats.label}
              value={stats.value}
            />
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <UsersOverview nameroute="data_home1_dash" />
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <UsersByDevice nameroute="data_home1_dash" />
        </Col>
      </Row>
    </Container>
  );
};

BlogOverview.propTypes = {
  smallStats: PropTypes.array
};

export default BlogOverview;
