import { Spin } from "antd";
import React from "react";
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
  Container,
  FormSelect
} from "shards-react";

const FormProduct = ({ onFinish, loading, edit, product, handleChange,onDelete,onEdit }) => {
  return (
    <Form>
      <FormGroup>
        <FormInput
          value={product && product.name}
          onChange={e => handleChange(e)}
          style={{ fontSize: "17px" }}
          size="lg"
          type="text"
          name="name"
          placeholder="Nombre del producto"
          className="mb-2"
        />
      </FormGroup>

      <FormGroup>
        <FormInput
          value={product && product.description}
          onChange={e => handleChange(e)}
          style={{ fontSize: "17px" }}
          size="lg"
          id="description"
          name="description"
          placeholder="Descripción del producto"
          className="mb-2"
        />
      </FormGroup>

      <FormGroup>
        <FormInput
          style={{ fontSize: "17px" }}
          size="lg"
          id="price"
          type="number"
          name="price"
          onChange={e => handleChange(e)}
          value={product && product.price}
          className="mb-2"
        />
      </FormGroup>

      {edit && (
        <FormGroup>
          <FormSelect
            value={product.status}
            size="lg"
            name="status"
            onChange={e => handleChange(e)}
          >
            <option value="">Seleccione una opción</option>
            <option value="active">Activo</option>
            <option value="disabled">Agotado</option>
          </FormSelect>
        </FormGroup>
      )}

      {!edit && (
        <FormGroup>
          {loading ? (
            <Spin />
          ) : (
            <ButtonOther
              disabled={product && product.name ? false : true}
              onClick={onFinish}
              style={{ fontSize: "17px" }}
              pill
              theme="success"
            >
              Guardar producto
            </ButtonOther>
          )}
        </FormGroup>
      )}
      {edit && (
        <ButtonOther
          disabled={product && product.name && product.price ? false : true}
          onClick={onEdit}
          style={{ fontSize: "17px" }}
          pill
          theme="info"
        >
          Editar producto
        </ButtonOther>
      )}

      {edit && (
        <ButtonOther
          disabled={product && product.name && product.price ? false : true}
          onClick={onDelete}
          style={{ fontSize: "17px" }}
          pill
          theme="danger"
        >
          Eliminar producto
        </ButtonOther>
      )}
    </Form>
  );
};

export default FormProduct;
