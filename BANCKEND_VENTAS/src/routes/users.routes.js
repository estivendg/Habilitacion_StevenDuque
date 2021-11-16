const {Router}=require('express');
const connectToDatabase  = require("../database");
const ObjectId =require('mongodb').ObjectId
const jwt=require('jsonwebtoken')
const secrectKey="devApi"

const verifyToken=require('../helper/verifytoken')

router=Router()

//GET USERS
router.get('/', verifyToken,async (req,res)=>{
    //Conectar a base de datos
    const db= await connectToDatabase()
    //obtener todos los usuarios
    const result =await db.collection('users').find({}).toArray();
    res.json(result)
});

//CREATE USERS
router.post('/', async(req,res)=>{
    if(req.body.documento && req.body.first_name && req.body.last_name && req.body.password && req.body.email){    
    const db= await connectToDatabase();
    const user={
        documento:req.body.documento,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        password:req.body.password,
        email:req.body.email,
        status:'pending',
        role:null
    }
    const result =await db.collection("users").insertOne(user)
    res.json({...user})
}else{
    res.json({error:"fields documento,first_name,last_name, password and email has mandatory"})
}
  
});

//Search by email or document
router.get('/filter/:search',async(req,res)=>{
    const db= await connectToDatabase();
    const search =req.params.search;
    let result;
    try {
      result= await db.collection('users').find({$or:[{"documento": new RegExp("/*"+search+"/*")},{'email':new RegExp("/*"+search+"/*",'i')}]}) .toArray()
    } catch (error) {
        result={error:"User notfound"+error}
    }   
    res.json(result)
});


router.get('/:id',verifyToken,async(req,res)=>{
    const db= await connectToDatabase();
    const {id} =req.params;
    let result;
    try {
      result= await db.collection('users').findOne({_id:ObjectId(id)})  
    } catch (error) {
        result={error:"User notfound"}
    }   
    res.json(result)
});



router.delete('/:id',verifyToken,async(req,res)=>{
    const db= await connectToDatabase();
    const {id} =req.params;
    let result;
    try {
      result= await db.collection('users').deleteOne({_id:ObjectId(id)})  
    } catch (error) {
        result={error:"User notfound"}
    }   
    res.json(result)
});

router.put('/:id',verifyToken,async(req,res)=>{
    const db= await connectToDatabase();
    const {id} =req.params;
    const userUpdated={
        documento:req.body.documento,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        password:req.body.password,
        email:req.body.email,
        status:req.body.status,
        role:req.body.role
    }
    let result;
    try {
      await db.collection('users').updateOne({_id:ObjectId(id)},{$set:userUpdated}) 
      result= userUpdated; 
    } catch (error) {
        result={error:"User notfound"}
    }   
    res.json(result)
});

router.post('/login',async (req,res)=>{    
    if(req.body.email && req.body.password){
        const db= await connectToDatabase();
        const result= await db.collection('users').findOne({email:req.body.email,password:req.body.password}) 
        if(result==null){
            res.json({error:"Email or password incorrect"})
        }else if(result.status=="active" || result.status=="pending"){
            jwt.sign({user:result},secrectKey,(err,token)=>{
             res.json({
                 ...result,
                 token
             })
            })
            
        }else{
            res.json({error:"user has not active status"})
        }        
    }else{
        res.json({error:"email and password has required"})
    }

})



module.exports=router;