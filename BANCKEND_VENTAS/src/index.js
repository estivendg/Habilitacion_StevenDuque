const express=require('express')
const app=express();
const routeUser=require("./routes/users.routes")
const routeProducts=require("./routes/products.routes")
const routeVentas=require("./routes/ventas.routes")

//settings
app.set('port',process.env.PORT || 3000)

//Middlewares
app.use(express.json())

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

//ROUTES
//app.use(routes)
app.get("/",(req,res)=>res.send("Corriendo Api"))

//API USERS
app.use('/users',routeUser)
//API PRODUCTS
app.use('/products',routeProducts)
//API VENTAS
app.use('/sales',routeVentas)

app.listen(app.get('port'),()=>{
    console.log("SERVER ON PORT ", app.get('port'))
})

module.exports= app;