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
import { DataTable } from "../components/Forms/Datatable";

const FormVenta = ({ onFinish, loading, edit, venta,buyers, products, handleChange,onDelete,onEdit,columnsDetails,addDetails }) => {
  return (
    <Form>
        
        <FormGroup>
          <FormSelect
            value={venta.buyer}
            size="lg"        
            name="buyer"
            onChange={e => handleChange(e)}
          >
              <option value="">Seleccione una opción</option>
              {buyers && buyers.map((buyer)=>{
                return <option value={buyer._id}>{buyer.last_name +" "+buyer.first_name}</option>
              })}           
          </FormSelect>
        </FormGroup> 

         <FormGroup>
          <FormSelect
            value={venta.product}
            size="lg"
            name="product"
            onChange={e => handleChange(e)}>
              <option value="">Seleccione una opción</option>
              {products && products.map((product)=>{
                return <option value={product._id}>{product.name}</option>
              })}           
          </FormSelect>
        </FormGroup>
      <FormGroup>
        <FormInput
          style={{ fontSize: "17px" }}
          size="lg"
          id="cantidad"
          type="number"
          name="cantidad"
          onChange={e => handleChange(e)}
          value={venta.cantidad && venta.cantidad}
          className="mb-2"
        />
      </FormGroup>
      <FormGroup>
        <FormInput
          style={{ fontSize: "17px" }}
          size="lg"
          disabled
          id="priceproduct"
          type="number"
          name="priceproduct"         
          value={venta && venta.price}
          className="mb-2"
        />
      </FormGroup>
      <ButtonOther         
          onClick={addDetails}
          style={{ fontSize: "17px" }}
          pill
          theme="info"
        >
          Agregar detalle
        </ButtonOther>
        <br/><br/>
      <DataTable columnsFlag={columnsDetails} data={venta.details} />
     <br/>
     <FormGroup>
     <FormInput
          style={{ fontSize: "17px" }}
          size="lg"
          id="price"
          type="number"
          name="total"
          disabled          
          value={venta.total && venta.total}
          className="mb-2"
        />
      </FormGroup>
      {edit && (
        <FormGroup>
          <FormSelect
            value={venta.status}
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
              disabled={venta && venta.buyer? false : true}
              onClick={onFinish}
              style={{ fontSize: "17px" }}
              pill
              theme="success"
            >
              Guardar Venta
            </ButtonOther>
          )}
        </FormGroup>
      )}
      {edit && (
        <ButtonOther
          disabled={venta && venta.buyer?  false : true}
          onClick={onEdit}
          style={{ fontSize: "17px" }}
          pill
          theme="info"
        >
          Editar venta
        </ButtonOther>
      )}

      {edit && (
        <ButtonOther
          disabled={venta && venta.buyer?  false : true}
          onClick={onDelete}
          style={{ fontSize: "17px" }}
          pill
          theme="danger"
        >
          Eliminar venta
        </ButtonOther>
      )}
    </Form>
  );
};

export default FormVenta;
