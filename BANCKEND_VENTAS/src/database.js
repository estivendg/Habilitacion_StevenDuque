const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:admin2021@cluster0.rrgak.mongodb.net";
const dbName = "dbTest";
const client = new MongoClient(url);

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("CONECTED TO MONGODB")
    return db;
  } catch (error) {
    console.log("Error to connect database", error);
  }
}
module.exports=connectToDatabase;
