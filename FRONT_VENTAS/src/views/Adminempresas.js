import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, Badge } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import { Empresas } from "../components/Forms/Empresas";
import { firestore } from "../firebase";

const ViewEmpresas = () => {
  // const [totalpacientes, settotalpacientes] = useState(0);
  const [smallStats, setsmallStats] = useState([
    {
      label: "Total empresas",
      value: 0,
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
  ]);
  const loadEmpresas = () => {
    firestore.collection("empresas").onSnapshot(doc => {
      let obj = smallStats[0];
      obj.value = doc.docs.length;
      let temp = [];
      temp.push(obj);
      setsmallStats(temp);
    });
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Dashboard"
          subtitle="Ventas LTDA"
          className="text-sm-left mb-3"
        />
      </Row>

      {/* Small Stats Blocks */}
      <Row>
        {smallStats &&
          smallStats.map((stats, idx) => (
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

      <Card>
        <Empresas />
      </Card>
    </Container>
  );
};

ViewEmpresas.propTypes = {
  smallStats: PropTypes.array
};

export default ViewEmpresas;
