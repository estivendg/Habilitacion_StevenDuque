const {Router}=require('express');
const connectToDatabase  = require("../database");
const ObjectId =require('mongodb').ObjectId
const verifyToken=require('../helper/verifytoken')

router=Router()

//GET USERS
router.get('/',verifyToken,async (req,res)=>{
    //Conectar a base de datos
    const db= await connectToDatabase()
    //obtener todos los usuarios
    const result =await db.collection('products').find({}).toArray();
    res.json(result)
});

//CREATE PRODUCTS
router.post('/', verifyToken,async(req,res)=>{
    if(req.body.name && req.body.description && req.body.price){    
    const db= await connectToDatabase();
    const product={
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,        
        status:'active',        
    }
    const result =await db.collection("products").insertOne(product)
    res.json({...product})
}else{
    res.json({error:"fields name,description, and price has mandatory"})
}
  
});


//Search by name products
router.get('/filter/:search',async(req,res)=>{
    const db= await connectToDatabase();
    const search =req.params.search;
    let result;
    try {
      result= await db.collection('products').find({'name':new RegExp("/*"+search+"/*",'i')}) .toArray()
    } catch (error) {
        result={error:"product notfound"+error}
    }   
    res.json(result)
});


router.get('/:id',verifyToken,async(req,res)=>{
    const db= await connectToDatabase();
    const {id} =req.params;
    let result;
    try {
      result= await db.collection('products').findOne({_id:ObjectId(id)})
      if(result==null){
          result={error:"Product notFound"}
      }  
    } catch (error) {
        result={error:"Product notfound"}
    }   
    res.json(result)
});

router.delete('/:id',verifyToken,async(req,res)=>{
    const db= await connectToDatabase();
    const {id} =req.params;
    let result;
    try {
      result= await db.collection('products').deleteOne({_id:ObjectId(id)})  
      if(result==null){
        result={error:"product notfound"}
      }
    } catch (error) {
        result={error:"product notfound"}
    }   
    res.json(result)
});

router.put('/:id',verifyToken,async(req,res)=>{
    const db= await connectToDatabase();
    const {id} =req.params;
    const product={
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,        
        status:req.body.status,        
    }
    let result;
    try {
      await db.collection('products').updateOne({_id:ObjectId(id)},{$set:product}) 
      result= userUpdated; 
    } catch (error) {
        result={error:"Product notfound"}
    }   
    res.json(result)
});

module.exports=router;