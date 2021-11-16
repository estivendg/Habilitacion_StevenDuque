import { Spin } from 'antd';
import React, { useState } from 'react';
import {Form,
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
    FormSelect,
    Container} from "shards-react";

const FormUser = ({user,handleChange,onFinish,loading,edit,onEdit,onDelete}) => { 
    return (
        <Form>
<FormGroup>
  <FormInput 
    value={user.documento}       
    onChange={e => handleChange(e)}
    style={{ fontSize: "17px" }}
    size="lg"
    type="number"
    name="documento"
    placeholder="Cédula o documento "
    className="mb-2"
  />
</FormGroup>

<FormGroup>
  <FormInput
   value={user.first_name}           
    onChange={e => handleChange(e)}
    style={{ fontSize: "17px" }}
    size="lg"
    id="#first_name"
    name="first_name"
    placeholder="Nombres"
    className="mb-2"
  />
</FormGroup>

<FormGroup>
  <FormInput
   value={user.last_name}           
    style={{ fontSize: "17px" }}
    size="lg"
    id="#last_name"
    name="last_name"
    placeholder="apellidos"
    onChange={e => handleChange(e)}          
    className="mb-2"
  />
</FormGroup>

<FormGroup>
  <FormInput
   value={user.email}            
    style={{ fontSize: "17px" }}
    size="lg"
    type="email"
    placeholder="Correo electrónico"          
    onChange={e=>handleChange(e)}
    name="email"
    className="mb-2"
  />
</FormGroup>

<FormGroup>
  <FormInput
   value={user.password}            
    style={{ fontSize: "17px" }}
    size="lg"
    type="password"
    placeholder="Contraseña"          
    name="password"
    className="mb-2"
    onChange={e=>handleChange(e)}
  />
</FormGroup>

{edit && <FormGroup>
    <FormSelect value={user.role} size="lg" name="role" onChange={e=>handleChange(e)}>
    <option value="">Seleccione una opción</option>
      <option value="Administrador">Administrador</option>
      <option value="Vendedor">Vendedor</option>      
    </FormSelect>
    </FormGroup>}

    {edit && <FormGroup>
    <FormSelect value={user.status} size="lg" name="status" onChange={e=>handleChange(e)}>
    <option value="">Seleccione una opción</option>
      <option value="active">Activo</option>
      <option value="pending">Pendiente</option>      
    </FormSelect>
    </FormGroup>}

<FormGroup>
  {loading ? (
    <Spin />
  ) : (
      <>
    {!edit && <ButtonOther
      disabled={user && user.first_name && user.documento ? false : true}
      onClick={onFinish}
      style={{ fontSize: "17px" }}
      pill
      theme="success"
    >
      Guardar usuario
    </ButtonOther>}
   { edit && <ButtonOther
    disabled={user && user.first_name && user.documento ? false : true}
    onClick={onEdit}
    style={{ fontSize: "17px" }}
    pill
    theme="info"
  >
    Editar usuario
  </ButtonOther>}

  { edit && <ButtonOther
    disabled={user && user.first_name && user.documento ? false : true}
    onClick={onDelete}
    style={{ fontSize: "17px" }}
    pill
    theme="danger"
  >
    Eliminar usuario
  </ButtonOther>}
  </>)}
</FormGroup>

</Form>
    )
}

export default FormUser;


