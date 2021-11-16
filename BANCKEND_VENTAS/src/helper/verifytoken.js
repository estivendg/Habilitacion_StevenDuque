

const secrectKey="devApi"
const jwt=require('jsonwebtoken')

//Handler jwt
const verifyToken=(req, res, next)=>{
   const bearerHeader= req.headers['authorization'];
   if(typeof bearerHeader!=='undefined'){
       const token=bearerHeader.split(" ")[1];
       if(token){
            jwt.verify(token,secrectKey,(err,auth)=>{
                if(err){
                    res.send({error:"Not token bearer for authenticate"}); 
                }
                next();
            })
       }else{
        res.send({error:"Not token bearer for authenticate"}); 
       }
   }else{
        res.send({error:"Not token bearer for authenticate"}); 
   }
}

module.exports=verifyToken;