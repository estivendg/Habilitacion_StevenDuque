import React from 'react'

import { Table, Tag, Space } from "antd";

const columns = [
  {
    title: "Documento",
    dataIndex: "documento",
    key: "documento",
  },
  {
    title: "Nombre",
    dataIndex: "first_name",
    key: "first_name"
  },
  {
    title: "Apellidos",
    dataIndex: "last_name",
    key: "last_name"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },

  {
    title: "Contraseña",
    dataIndex: "password",
    key: "password"
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    render(key,val){
     return( <Tag color={val.status=='pending'?"purple":"green"}>{key}</Tag>)
    }
  },

  {
    title: "Rol",
    dataIndex: "role",
    key: "role",
    render(key,val){
     return( <Tag color={"blue"}>{key==null?"Sin rol":key}</Tag>)
    }
  },


 
];

// const data = [
//   {
//     key: "1",
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     tags: ["nice", "developer"]
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     tags: ["loser"]
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     age: 32,
//     address: "Sidney No. 1 Lake Park",
//     tags: ["cool", "teacher"]
//   }
// ];

export const DataTable = ({data,columnsFlag}) => {
  return <Table columns={columnsFlag || columns} dataSource={data} />;
};
