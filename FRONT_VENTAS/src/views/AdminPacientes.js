import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
Container} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import { DataTable } from "../components/Forms/Datatable";
import { message, Spin, Tabs } from "antd";
import AxiosInstance from "../utils/axiosInstance";
import FormUser from "./formUser";
const { TabPane } = Tabs;

const ViewPacientes = () => {
  const userClean={documento:'',first_name:'',last_name:'',email:'',password:''}
  const [loading,setLoading]=useState(false);
  const [user, setUser] = useState(userClean);
  const [users, setUsers] = useState([]);
  const [userFound, setUserFound] = useState();
  const [emailSearch,setEmailsearch]=useState()
  const [smallStats, setsmallStats] = useState([
    {
      label: "Total usuarios",
      value: 90,
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
  const loadUsers = async() => {
    let users= await AxiosInstance.get("users")
    if(users.data){
      setUsers(users.data)
    }
    console.log(users)
  };

  useEffect(() => {
    loadUsers();
  }, []);


  function handleChange(e) {        
    setUser({...user,
      [e.target.name]:e.target.value
    })  
  }

  function handleChangeEdit(e) {        
    setUserFound({...userFound,
      [e.target.name]:e.target.value
    })  
  }


  const HandleSearch=async ()=>{
    if(emailSearch){
      setLoading(true)     
      let resp= await AxiosInstance.get("users/filter/"+emailSearch)
      if(resp.data){
        if(resp.data.length>0){
          setUserFound(resp.data[0])
        }
      }
      setLoading(false)
    }
  }
  async function deleteUser(){
    setLoading(true)  
    let resp= await AxiosInstance.delete("users/"+userFound._id)  
    if(resp.data){
      await loadUsers()
      message.success("Usuario editado correctamente..")
      setUserFound(undefined)
      setEmailsearch("")
    }

    setLoading(false)  
  }
  async function EditUser() {
    setLoading(true)  
    let resp= await AxiosInstance.put("users/"+userFound._id, userFound)    
    if(resp.data.documento){
      await loadUsers()
      message.success("Usuario editado correctamente..")
      setUserFound(undefined)
      setEmailsearch("")
    }
    setLoading(false)
  }
  async function SaveUser() {
    setLoading(true)
   let resp=await AxiosInstance.post("users",user)  
   if(resp.data._id){     
     message.success("Usuario creado correctamente..")
     handleReset()
     await loadUsers()
   }else{
    message.error(resp.data.error)
    handleReset()
   }
   setLoading(false) 
  }

  function handleReset() {
   setUser(userClean)
  }

  const onFinish = () => {
    SaveUser()
  };

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

      <Card style={{ padding: "10px" }}>
      <Tabs defaultActiveKey="1">
            <TabPane tab="Nuevo usuario" key="1">
         <FormUser user={user} loading={loading} handleChange={handleChange} onFinish={onFinish} />
      </TabPane>
            <TabPane tab="Consultas y modificaciones" key="2">
              <>
            <InputGroup>
        <FormInput
          onChange={e => setEmailsearch(e.target.value)}
          style={{ fontSize: "17px" }}
          size="lg"
          value={emailSearch}
          placeholder="email o cedula a buscar"
        />
        {loading ? (
          <Spin size="large" />
        ) : (
          <ButtonOther
            disabled={emailSearch ? false : true}
            onClick={HandleSearch}
          >
            Buscar
          </ButtonOther>
        )}
      </InputGroup>{" "}
      <br/> 
      {userFound && <FormUser onDelete={deleteUser} onEdit={EditUser} user={userFound} handleChange={handleChangeEdit} edit={1} loading={loading} />}    
             
    </>
            </TabPane>
            <TabPane tab="Listado de usuarios" key="3">
             <DataTable data={users}/>
            </TabPane>
          </Tabs>
       {/* <Pacientes />*/}
      </Card>
    </Container>
  );
};

ViewPacientes.propTypes = {
  smallStats: PropTypes.array
};

export default ViewPacientes;
