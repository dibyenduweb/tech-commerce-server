const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const port =  process.env.PORT || 5000;
//
//server conection
//const uri = "mongodb+srv://dibyendupr:<password>@cluster0.aeupb94.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://dibyendupr:XU3UFi47B93AdknK@cluster0.aeupb94.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const productCollection =client.db("productDB").collection("products");
//post data method
    app.post("/products", async(req, res)=>{
        const product =  req.body;
        const result = await
        productCollection.insertOne(product);
        console.log(result);
        res.send(result);
    });
//post read method
    app.get("/products", async(req, res)=>{
      const result = await productCollection.find().toArray();
      console.log(result);
      res.send(result);
  });

  //get all data

  app.get("/products/:brandName", async(req, res)=>{
  const brandName =req.params.brandName;
  //console.log('brand', brand);
  const query ={brand : brandName};
  const cursor =productCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});



// app.get("/products/:brand", async(req, res)=>{
//   const brand =req.params.brand;
//   const query ={brand : brand};
//   const result = await productCollection.find(qyery).toArray();
//   console.log(result);
//   res.send(result);
// });



  //post delete methood
  app.delete("/products/:id", async(req, res)=>{
    const id = req.params.id;
    console.log('id', id);
    const query ={
      _id : new ObjectId(id),
    }
    const result = await productCollection.deleteOne(query);
    //console.log(result);
    res.send(result);
  });

  //update data
  app.get("/products/:id", async(req, res)=>{
    const id = req.params.id;
    //console.log('id', id);
    const query ={
      _id : new ObjectId(id),
    };
    const result = await productCollection.findOne(query);
    //console.log(result);
    res.send(result);
  });




  //updated data
  app.put("/products/:id", async(req, res)=>{
    const id = req.params.id;
    const data = req.body;
    const options ={upsert:true};
    const filter ={
      _id : new ObjectId(id),
    };
    const updatedData ={
      $set:{
            image:data.image, 
            name:data.name, 
            brand:data.brand, 
            type:data.type, 
            price:data.price, 
            shortDescription:data.shortDescription, 
            rating:data.rating,
      },
    };
    const result = await productCollection.updateOne(filter,updatedData,options);
    res.send(result);


  });




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);











app.get("/", (req, res) => {
    res.send("Server is running...");
 });


app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});