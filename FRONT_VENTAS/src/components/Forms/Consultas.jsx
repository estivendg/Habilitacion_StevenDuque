import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  ModalHeader,
  ModalBody,
  Modal,
  FormInput,
  FormGroup
} from "shards-react";
import { Divider, Space, Spin, Row as RowAntd, message } from "antd";
import { firestore } from "../../firebase";
import { Tabs } from "antd";
import { Select, DatePicker, Table, Tag,Input } from "antd";
import { DataTable } from "./Datatable";
import moment from "moment";
import FormVenta from "../../views/formVentas";
import AxiosInstance from "../../utils/axiosInstance";
const { Option } = Select;
const { TabPane } = Tabs;

export const Consultas = () => {
  const [buyers, setBuyers] = useState([]);
  const [products, setProducts]=useState([])
  const [ventas,setVentas]=useState([])
  const ventaNew={
    buyer:'',
    seller:'',
    details:[],
    product:'',
    cantidad:'',
    total:0,
    price:'',
    productName:''
  }
  const [venta,setVenta]=useState(ventaNew)
  
  const columsDetails=[
    {
      title: "Producto",
      dataIndex: "product",
      key: "product",      
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",      
    },

    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",      
    },
    {
      title: "$",
      dataIndex: "total",
      key: "total",  
    }
  ]
  const columns = [
    {
      title: "Comprador",
      dataIndex: "buyer",
      key: "buyer",
      render: (key,text) => <>{key && (key.last_name +" "+key.first_name)}</>
    },
    {
      title: "Vendedor",
      dataIndex: "seller",
      key: "seller",
      render: (key,text) => <>{console.log(key,text)}{ key && (key.last_name +" "+key.first_name)}</>
    },
    {
      title: "Total venta",
      dataIndex: "total",
      key: "total"
    },
    {
      title: "Fecha venta",
      dataIndex: "date",
      key: "date"
    },   
  ];

  useEffect(() => {
    loadBuyersaAndProducts();
    loadVentas();
  }, []);


  const loadVentas=async()=>{
    let resp=await AxiosInstance.get("sales");
    if(resp.data){  
      console.log(resp.data)    
      setVentas(resp.data)
    }
  }

  useEffect(()=>{
    if(venta && venta.details.length>0){
      let total=0
      venta.details.map((details)=>{
        total+=details.total;
      })
      setVenta({...venta,total})
    }
  },[venta.details])

  const loadBuyersaAndProducts=async()=>{
    let respProduct=await AxiosInstance.get("products")
    let respBuyer=await AxiosInstance.get("users")
    if(respProduct.data){
        setProducts(respProduct.data)
    }
    if(respBuyer.data){
      setBuyers(respBuyer.data)
    }
  }

 async function saveVenta() {  
   let seller=localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))._id;
   let listDetails=[]
   if(venta.details.length>0){
    venta.details.map((detail)=>{
      let detailn={product:detail.productId,price:detail.price,total:detail.cantidad}
      listDetails.push(detailn)
    })
   }
   let Nventa={
     seller,
     buyer:venta.buyer,
     details:listDetails,
     status:"process"
   }
   
   let respSales=await AxiosInstance.post("sales",Nventa);
   if(respSales.data._id){
     console.log(respSales.data)
     setVenta(ventaNew)
     await loadVentas()
     alert("AGREGADA LA VENTA CORRECTAMENTE")
   }
  }


  const agregarDetalleventa=()=>{
      if(venta && venta.product && venta.cantidad){
        let total=+venta.price*venta.cantidad
        let detail={productId:venta.product,product:venta.productName,price:venta.price,cantidad:venta.cantidad,total:total}
        setVenta({...venta,details:[...venta.details,detail]})
       // calcularTotal()
      }else{
        alert("INGRESE PRODUCTO y/O CANTIDAD")
      }
  }

 

  function onChange(e) {
    setVenta({...venta,[e.target.name]:e.target.value})
    if(e.target.name=='product'){
      products && products.map((product)=>{
        if(product._id==e.target.value){
          setVenta({...venta,[e.target.name]:e.target.value,price:product.price,productName:product.name})
        }
      })
    }
  }

  function handleConsultarbyCedula() {
    
  }

  return (
    <Card style={{ padding: "10px" }}>
      <Row justify="center">
        <Col className="col-lg mb-4">
          <h4 style={{ color: "#8593A7" }}>Gestión de ventas</h4>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Nueva venta" key="1">
            <FormVenta onFinish={saveVenta} addDetails={agregarDetalleventa} handleChange={onChange} venta={venta}  columnsDetails={columsDetails} buyers={buyers} products={products}/>
            </TabPane>
            <TabPane tab="Consultas y modificaciones" key="2">
                        
            </TabPane>
            <TabPane tab="Ventas realizadas" key="3">
              {<DataTable columnsFlag={columns} data={ventas} />}
            </TabPane>
          </Tabs>
        </Col>
      </Row>           
    </Card>
  );
};
