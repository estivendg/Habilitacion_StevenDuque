import React, { useEffect, useState } from "react";
import {
  Form,
  FormInput,
  FormGroup,
  Card,
  Row,
  Col,
  Button as ButtonOther,
  Modal,
  ModalBody,
  ModalHeader,
  InputGroup,
  Alert,
  Container
} from "shards-react";
import { Divider, Space, Spin, Row as RowAntd, message, Tag } from "antd";
import { firestore } from "../../firebase";
import { Tabs } from "antd";
import { DataTable } from "./Datatable";
import FormProduct from "../../views/formProduct";
import AxiosInstance from "../../utils/axiosInstance";

const { TabPane } = Tabs;

export const Empresas = () => {
  let productClean = { name: "", description: "", price: "" };
  const [productFound, setProductFound] = useState();
  const [loading, setloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(productClean);
  const [search, setSearch] = useState();

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price"
    },

    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render(key, val) {
        return (
          <Tag color={val.status == "active" ? "green" : "purple"}>{key}</Tag>
        );
      }
    }
  ];

  useEffect(() => {
    loadProduts();
  }, []);

  function handleChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function handleChangeEdit(e) {
    setProductFound({ ...productFound, [e.target.name]: e.target.value });
  }

  const HandleSearch = async () => {
    if (search) {
      let resp = await AxiosInstance.get("products/filter/" + search);
      if (resp.data) {
        if (resp.data.length > 0) {
          setProductFound(resp.data[0]);
        }
      }
    }
  };

  const loadProduts = async () => {
    let resp = await AxiosInstance.get("products");
    if (resp.data) {
      setProducts(resp.data);
    }
  };

  const onDelete = async () => {
    setloading(true);
    let resp = await AxiosInstance.delete("products/" + productFound._id);
    if (resp.data) {
      message.success("Producto eliminado correctamente");
      handleReset();
      setSearch("");
      await loadProduts();
      setProductFound(undefined);
    }
    setloading(false);
  };

  const onEdit = async () => {
    setloading(true);
    if (productFound) {
      let resp = await AxiosInstance.put(
        "products/" + productFound._id,
        productFound
      );
      if (resp.data) {
        message.success("Producto actualizado correctamente");
        handleReset();
        await loadProduts();
        setProductFound(undefined);
      }
    }
    setloading(false);
  };

  async function SaveProduct() {
    setloading(true);
    let resp = await AxiosInstance.post("products", product);
    if (resp.data._id) {
      message.success("Producto creado correctamente");
      handleReset();
      await loadProduts();
    } else {
      message.error(resp.data.error);
    }
    setloading(false);
  }

  function handleReset() {
    setProduct(productClean);
  }

  const onFinish = () => {
    SaveProduct();
  };

  return (
    <Card style={{ padding: "10px" }}>
      <Row justify="center">
        <Col className="col-lg mb-4">
          <h4 style={{ color: "#8593A7" }}>Administrar productos</h4>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Nuevo producto" key="1">
              <FormProduct
                product={product}
                handleChange={handleChange}
                onFinish={onFinish}
              />
            </TabPane>
            <TabPane tab="Consultas y modificaciones" key="2">
              <InputGroup>
                <FormInput
                  onChange={e => setSearch(e.target.value)}
                  style={{ fontSize: "17px" }}
                  size="lg"
                  value={search}
                  placeholder="Nombre del producto a buscar"
                />
                {loading ? (
                  <Spin size="large" />
                ) : (
                  <ButtonOther
                    disabled={search ? false : true}
                    onClick={HandleSearch}
                  >
                    Buscar
                  </ButtonOther>
                )}
              </InputGroup>{" "}
              <br />
              {productFound && (
                <FormProduct
                  product={productFound}
                  handleChange={handleChangeEdit}
                  edit={1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </TabPane>
            <TabPane tab="Listado de productos" key="3">
              <DataTable columnsFlag={columns} data={products} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
};

const ConsultasCrud = ({
  setloading,
  loading,
  handleChange,
  isOpen,
  setisOpen
}) => {
  const [nittoSearch, setnittoSearch] = useState();
  const [dataempresa, setdataempresa] = useState(null);
  const [isEdit, setisEdit] = useState(false);

  const HandleDelete = () => {
    setloading(true);

    firestore
      .collection("empresas")
      .where("nit", "==", nittoSearch)
      .get()
      .then(querySnapshot => {
        console.log("querySnapshot", querySnapshot.docs[0].id);
        firestore
          .collection("empresas")
          .doc(querySnapshot.docs[0].id)
          .delete()
          .then(function() {
            setloading(false);
            setdataempresa(null);
            setnittoSearch("");
            setisOpen({
              status: !isOpen.status,
              text: "Eliminado correctamente",
              type: "sucess"
            });
          })
          .catch(function(error) {
            setloading(false);
            setisOpen({
              status: !isOpen.status,
              text: "Error eliminando",
              type: "error"
            });
            setdataempresa(null);
            setnittoSearch("");
          });
      });
  };

  const HandleSearch = () => {
    setloading(true);
    firestore
      .collection("empresas")
      .where("nit", "==", nittoSearch)
      .get()
      .then(querySnapshot => {
        let data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        setdataempresa(data);
        setloading(false);
      })
      .catch(error => {
        setloading(false);
        console.log("Error getting documents: ", error);
      });
  };

  return (
    <>
      <InputGroup>
        <FormInput
          onChange={e => setnittoSearch(e.target.value)}
          style={{ fontSize: "17px" }}
          size="lg"
          value={nittoSearch}
          placeholder="Nit ó cedula de representante"
        />
        {loading ? (
          <Spin size="large" />
        ) : (
          <ButtonOther
            disabled={nittoSearch ? false : true}
            onClick={HandleSearch}
          >
            Buscar
          </ButtonOther>
        )}
      </InputGroup>{" "}
      {!isEdit && dataempresa != null && dataempresa[0] ? (
        <>
          <RowAntd justify="center">
            <h4 style={{ color: "#8593A7" }}>Información de la empresa</h4>
          </RowAntd>
          <Divider />
          <Form>
            <FormGroup>
              <FormInput
                value={dataempresa[0] && dataempresa[0].nit}
                disabled={true}
                onChange={e => handleChange(e)}
                style={{ fontSize: "17px" }}
                size="lg"
                type="number"
                name="nit"
                placeholder="Nit ó cedula de representante"
                className="mb-2"
              />
            </FormGroup>

            <FormGroup>
              <FormInput
                value={dataempresa[0] && dataempresa[0].nombre}
                onChange={e => handleChange(e)}
                disabled={true}
                style={{ fontSize: "17px" }}
                size="lg"
                id="#username"
                name="nombre"
                placeholder="Nombre completo de la empresa"
                className="mb-2"
              />
            </FormGroup>

            <FormGroup>
              <FormInput
                disabled
                style={{ fontSize: "17px" }}
                size="lg"
                id="#username"
                name="username"
                value={`Usuario: ${
                  dataempresa[0].username
                    ? dataempresa[0].username
                    : "sin asignar"
                }`}
                className="mb-2"
              />
            </FormGroup>

            <FormGroup>
              <FormInput
                disabled
                style={{ fontSize: "17px" }}
                size="lg"
                value={`Clave: ${
                  dataempresa[0].password
                    ? dataempresa[0].password
                    : "sin asignar"
                }`}
                name="password"
                className="mb-2"
              />
            </FormGroup>

            <Space direction="horizontal">
              <ButtonOther onClick={() => setisEdit(true)} pill theme="info">
                Editar
              </ButtonOther>
              <ButtonOther pill theme="danger" onClick={HandleDelete}>
                Eliminar
              </ButtonOther>
            </Space>
          </Form>
        </>
      ) : dataempresa != null && !dataempresa[0] && !isEdit ? (
        <Alert theme="danger">
          Ninguna empresa esta registrada con este nit o cedula de representante
        </Alert>
      ) : (
        isEdit && (
          <EditarForm
            dataempresa={dataempresa[0]}
            setisOpen={setisOpen}
            isOpen={isOpen}
            setisEdit={setisEdit}
            setdataempresa={setdataempresa}
          />
        )
      )}
    </>
  );
};

const EditarForm = ({
  loading,
  dataempresa,
  setisOpen,
  isOpen,
  setisEdit,
  setdataempresa
}) => {
  const [empresa, setempresa] = useState();
  const [nit, setnit] = useState();
  const [nombre, setnombre] = useState();
  const [username, setusername] = useState();
  const [password, setpassword] = useState();

  useEffect(() => {
    if (dataempresa) {
      setempresa(dataempresa);
      setnit(dataempresa.nit);
      setnombre(dataempresa.nombre);
      setusername(dataempresa.username);
      setpassword(dataempresa.password);
    }
  }, [dataempresa]);

  function handleChange(e) {
    if (e.target.name == "nit") {
      setusername(e.target.value);
    }
    if (e.target.name == "nombre") {
      setpassword(e.target.value.split(" ")[0] + "_sointe2021");
    }
    setempresa({
      ...empresa,
      [e.target.name]: e.target.value
    });
  }

  const onFinish = () => {
    firestore
      .collection("empresas")
      .where("nit", "==", nit)
      .get()
      .then(querySnapshot => {
        firestore
          .collection("empresas")
          .doc(querySnapshot.docs[0].id)
          .update(empresa)
          .then(() => {
            let temp = [];
            temp.push(empresa);
            setdataempresa(temp);

            setisOpen({
              status: true,
              text: "Empresa actualizada correctamente",
              type: "success"
            });
            setisEdit(false);
          })
          .catch(error => {
            console.log(error);
            setisOpen({
              status: true,
              text: "Ocurrio un error al actualizar",
              type: "error"
            });
          });
      });
  };

  return (
    <>
      <RowAntd justify="center">
        <h4 style={{ color: "#8593A7" }}>Editar empresa</h4>
      </RowAntd>
      <Form>
        <FormGroup>
          <FormInput
            value={empresa && empresa.nit}
            onChange={e => handleChange(e)}
            style={{ fontSize: "17px" }}
            size="lg"
            type="number"
            name="nit"
            placeholder="Nit ó cedula de representante"
            className="mb-2"
          />
        </FormGroup>

        <FormGroup>
          <FormInput
            value={empresa && empresa.nombre}
            onChange={e => handleChange(e)}
            style={{ fontSize: "17px" }}
            size="lg"
            id="#username"
            name="nombre"
            placeholder="Nombre completo de la empresa"
            className="mb-2"
          />
        </FormGroup>

        <FormGroup>
          <FormInput
            disabled
            style={{ fontSize: "17px" }}
            size="lg"
            id="#username"
            name="username"
            value={`Usuario: ${username ? username : "sin asignar"}`}
            className="mb-2"
          />
        </FormGroup>

        <FormGroup>
          <FormInput
            disabled
            style={{ fontSize: "17px" }}
            size="lg"
            value={`Clave: ${password ? password : "sin asignar"}`}
            name="password"
            className="mb-2"
          />
        </FormGroup>

        <FormGroup>
          {loading ? (
            <Spin />
          ) : (
            <ButtonOther
              disabled={username && empresa.nombre ? false : true}
              onClick={onFinish}
              style={{ fontSize: "17px" }}
              pill
              theme="info"
            >
              Editar empresa
            </ButtonOther>
          )}
        </FormGroup>
      </Form>
    </>
  );
};
