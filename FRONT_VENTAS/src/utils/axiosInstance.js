import axios from "axios";


const baseURL=process.env.REACT_APP_APIBACK;
let token =localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).token:null

const AxiosInstance=axios.create({
    baseURL,
    headers:{Authorization:"Bearer "+token}
})

AxiosInstance.interceptors.request.use(async req=>{
    let token =localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).token:null
    req.headers.Authorization="Bearer "+token;
    return req;
})

export default AxiosInstance;