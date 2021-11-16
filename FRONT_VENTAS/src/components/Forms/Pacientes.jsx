import React, { useEffect, useState } from "react";
import {
  Form,
  FormInput,
  FormGroup,
  Card,
  Row,
  Col,
  FormSelect,
  Button as ButtonOther,
  Modal,
  ModalBody,
  ModalHeader,
  Progress
} from "shards-react";
import { Upload, message, Space, Button, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { SaveDataUser } from "./actions";
import { firestore } from "../../firebase";
import { Select } from "antd";
const { Option } = Select;

export const Pacientes = () => {
  const [user, setuser] = useState();
  const [fileuser, setfileuser] = useState();
  const [isOpen, setisOpen] = useState({ status: false, text: "", type: "" });
  const [loading, setloading] = useState(false);
  const [empresas, setempresas] = useState([]);

  function handlechangeempresa(empresa) {
    setuser({ ...user, empresa: empresa });
  }

  const loadEmpresas = () => {
    let empresastemp = [];
    firestore.collection("empresas").onSnapshot(docs => {
      docs.forEach(doc => {
        let temp = doc.data();
        empresastemp.push(temp);
      });
      setempresas(empresastemp);
    });
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  function handleLoading(percent) {
    if (percent != 100) {
      setloading(true);
    } else {
      setloading(false);
    }
  }

  function handleResetfiedls() {
    setuser({
      cedula: "",
      nombre: "",
      empresastemp: "",
      empresa: "",
      tipo_archivo: ""
    });
  }

  function SaveUser(user) {
    firestore
      .collection("pacientes")
      .add(user)
      .then(docRef => {
        // console.log("Document written with ID: ", docRef.id);
        setloading(false);
        setisOpen({
          status: !isOpen.status,
          text: "Guardado correctamente",
          type: "sucess"
        });
        handleResetfiedls();
      })
      .catch(error => {
        setloading(false);
        setisOpen({
          status: !isOpen.status,
          text: "Eror guardando",
          type: "error"
        });
        handleResetfiedls();
      });
  }

  function handleChange(e) {
    setuser({
      ...user,
      [e.target.name]: e.target.value
    });
  }

  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      setfileuser(info.file);
      setuser({
        ...user,
        file: info.file
      });
    }
  };

  const onFinish = () => {
    if (!fileuser) {
      setisOpen({
        status: !isOpen.status,
        text: "Rellene todos los datos para continuar",
        type: "error"
      });
    } else {
      //guardar paciente
      setloading(true);
      SaveDataUser(user, handleLoading, SaveUser);
    }
  };

  return (
    <Card style={{ padding: "10px" }}>
      <Row justify="center">
        <Col className="col-lg mb-4">
          <h4 style={{ color: "#8593A7" }}>Administrar pacientes</h4>
        </Col>
      </Row>

      <Form>
        <FormGroup>
          <FormInput
            value={user && user.cedula}
            required={true}
            onChange={e => handleChange(e)}
            style={{ fontSize: "17px" }}
            size="lg"
            type="number"
            id="cedula"
            name="cedula"
            placeholder="Cedula"
            className="mb-2"
          />
        </FormGroup>

        <FormGroup>
          <FormInput
            value={user && user.nombre}
            required={true}
            onChange={e => handleChange(e)}
            style={{ fontSize: "17px" }}
            size="lg"
            id="#username"
            name="nombre"
            placeholder="Nombres completos"
            className="mb-2"
          />
        </FormGroup>

        <FormGroup>
          {/* <label>Selecccione el tipo: </label> */}
          <FormSelect
            value={user && user.tipo_archivo}
            required={true}
            name="tipo_archivo"
            onChange={e => handleChange(e)}
            style={{ fontSize: "17px" }}
          >
            <option value="N/A">Selecccione el tipo de archivo</option>
            <option value="Concepto Medico">Concepto Medico</option>
            <option value="Laboratorios">Laboratorios</option>
            <option value="Historia clinica">Historia clinica</option>
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <Select
            value={user && user.empresa}
            onChange={value => handlechangeempresa(value)}
            style={{ fontSize: "17px", width: "100%" }}
            showSearch
            placeholder="Empresa del paciente"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {empresas &&
              empresas.map((item, index) => {
                return (
                  <Option key={index} value={item.nit}>
                    {item.nombre}
                  </Option>
                );
              })}
          </Select>
        </FormGroup>

        <FormGroup>
          <Upload {...props}>
            <Button
              size="large"
              type="primary"
              shape="round"
              icon={<UploadOutlined />}
            >
              Cargar el PDF
            </Button>
          </Upload>
        </FormGroup>

        <FormGroup>
          {loading ? (
            <Spin />
          ) : (
            <ButtonOther
              onClick={onFinish}
              style={{ fontSize: "17px" }}
              pill
              theme="success"
            >
              Guardar paciente
            </ButtonOther>
          )}
        </FormGroup>
      </Form>

      <div>
        <Modal
          open={isOpen.status}
          toggle={() =>
            setisOpen({ status: !isOpen.status, text: "", type: "" })
          }
        >
          <ModalHeader>
            {isOpen.type === "error" ? "🚩 Error" : "✅ Exito"}
          </ModalHeader>
          <ModalBody>{isOpen.text}</ModalBody>
        </Modal>
      </div>
    </Card>
  );
};
