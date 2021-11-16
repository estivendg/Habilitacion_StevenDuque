const { Router } = require("express");
const connectToDatabase = require("../database");
const ObjectId = require("mongodb").ObjectId;
const verifyToken=require('../helper/verifytoken')
const moment=require('moment')

router = Router();

//GET USERS
router.get("/", verifyToken,async (req, res) => {
  //Conectar a base de datos
  const db = await connectToDatabase();
  //obtener todos los usuarios
  const result = await db.collection("sales").find({}).toArray();
  let saleswithUsers = [];
  if (result.length > 0) {
    await Promise.all(
      result.map(async (sale) => {
        const seller = await db
          .collection("users")
          .findOne({ _id: ObjectId(sale.seller) });
        const buyer = await db
          .collection("users")
          .findOne({ _id: ObjectId(sale.buyer) });
        let listproduct = [];
        await Promise.all(
          sale.details.map(async (detail) => {
            const product = await db
              .collection("products")
              .findOne({ _id: ObjectId(detail.product) });
            let detailProdut = {
              name: product.name,
              _id: product._id,
              price: detail.price,
              total: detail.total,
            };
            listproduct.push(detailProdut);
          })
        );
        let sales = {
          ...sale,
          buyer: buyer,
          seller: seller,
          details: listproduct,
        };
        saleswithUsers.push(sales);
      })
    );
  }
  res.json(saleswithUsers);
});

//CREATE USERS
router.post("/",verifyToken, async (req, res) => {
  if (
    (req.body.seller && req.body.buyer,
    req.body.details && Array.isArray(req.body.details))
  ) {
    const db = await connectToDatabase();
    let validSeller;
    let validBuyer;
    //SE VALIDA QUE EXISTE TANTO EL BUYER COMO EL SELLER
    try {
      validSeller = await db
        .collection("users")
        .findOne({ _id: ObjectId(req.body.seller) });
      validBuyer = await db
        .collection("users")
        .findOne({ _id: ObjectId(req.body.buyer) });
    } catch (error) {
      res.json({
        error: "seller or buyer invalid",
      });
    }

    if (validSeller !== null && validBuyer !== null) {
      let totalVenta = 0;
      let totalProducts = 0;
      try {
        //SE VALIDA SI LOS PRODUCTOS EXISTEN
        let listproduct = [];
        await Promise.all(
          req.body.details.map(async (element) => {
            const product = await db
              .collection("products")
              .findOne({ _id: ObjectId(element.product) });
            if (element.product && product !== null) {
              let detailProdut = {
                name: product.name,
                _id: product._id,
                price: element.price,
                total: element.total                
              };
              listproduct.push(detailProdut);
              if (element.price && element.total) {
                totalVenta += element.price * element.total;
                totalProducts++;
              }
            }
          })
        );
        //SE AGREGA LA VENTA
        const sale = {
          buyer: req.body.buyer,
          details: req.body.details,
          total: totalVenta,
          totalProducts: totalProducts,
          status: "proccess",
          seller: req.body.seller,
          date:moment().format("YYYY-MM-DD HH:mm:ss")
        };
        const result = await db.collection("sales").insertOne(sale);
        res.json({        
            ...sale,
            seller: validSeller,
            buyer: validBuyer,
            details: listproduct,        
            totalVenta: totalVenta,
            totalProducts: totalProducts,
        });
      } catch (error) {
        res.json({ error: "product not found" });
      }
    } else if (validSeller == null) {
      res.json({
        error: "seller notFound to sales",
      });
    } else if (validBuyer == null) {
      res.json({
        error: "buyer notFound to sales",
      });
    }
  } else {
    res.json({
      error: "fields seller, buyer and details is required. details is array",
    });
  }
});

router.get("/:id",verifyToken, async (req, res) => {
  const { id } = req.params;
  const result=await obtenerSales(id)
  res.json(result);
});

router.delete("/:id",verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  const { id } = req.params;
  let result;
  try {
    result = await db.collection("sales").deleteOne({ _id: ObjectId(id) });
  } catch (error) {
    result = { error: "User notfound" };
  }
  res.json(result);
});

router.put("/:id",verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  const { id } = req.params;
  const userUpdated = {
    status: req.body.status,
  };
  let result;
  try {
    await db
      .collection("sales")
      .updateOne({ _id: ObjectId(id) }, { $set: userUpdated });
    result = await obtenerSales(id);
  } catch (error) {
    result = { error: "sales notfound" };
  }
  res.json(result);
});


const obtenerSales=async (id)=>{
    const db = await connectToDatabase();  
  let result;
  try {
    result = await db.collection("sales").findOne({ _id: ObjectId(id) });
    if (result != null) {
      const seller = await db
        .collection("users")
        .findOne({ _id: ObjectId(result.seller) });
      const buyer = await db
        .collection("users")
        .findOne({ _id: ObjectId(result.buyer) });
      let listproduct = [];
      await Promise.all(
        result.details.map(async (detail) => {
          const product = await db
            .collection("products")
            .findOne({ _id: ObjectId(detail.product) });
          let detailProdut = {
            name: product.name,
            _id: product._id,
            price: detail.price,
            total: detail.total,
          };
          listproduct.push(detailProdut);
        })
      );
      let sales = {
        ...result,
        buyer: buyer,
        seller: seller,
        details: listproduct,
      };
      return sales;
      
    }else{
      return {error:"sales invalid"}
    }
  } catch (error) {
    return {error:"sales invalid"}
  }
}

module.exports = router;
