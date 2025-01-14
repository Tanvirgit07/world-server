const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j10pchd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)


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
    // await client.connect();

    const spotCollection = client.db('spotDB').collection('spot');
    const countryCollection = client.db('spotDB').collection('country')


    app.get('/country',async (req,res) =>{
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/add',async(req,res) =>{
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/add/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const user = await spotCollection.findOne(query)
      res.send(user)

    });

    app.get('/get-by-country/:countryName',async (req,res) => {
      const name = req.params.countryName;
      console.log(name)
      // const query = {country_name : name}
      const result = await spotCollection.find({country_name : name}).toArray()
      res.send(result)
    })


    
    app.get('/myCart/:email', async(req,res) => {
      const result = await spotCollection.find({email : req.params.email}).toArray()
      res.send(result)
    });


    app.get('/add/:id',async (req,res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const user = await spotCollection.findOne(query)
      res.send(user);
    })

    app.put('/add/:id',async (req,res) =>{
      const id = req.params.id;
      const updateUser = req.body;
      console.log(updateUser)
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true}
      const updateData ={
        $set : {
          photo : updateUser.photo,
          spot_name : updateUser.spot_name,
          country_name : updateUser.country_name,
          location : updateUser.location,
          description : updateUser.description,
          cost : updateUser.cost,
          seasonality : updateUser.seasonality,
          time : updateUser.time,
          per_year : updateUser.per_year,
        }
      }
      const result = await spotCollection.updateOne(filter,updateData,options);
      res.send(result)
    });

    app.delete('/add/:id',async(req,res) =>{
      const id = req.params.id;
      console.log('id is',id)
      const query = {_id : new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result);
    })


    app.post('/add',async(req,res) =>{
        const newAdd = req.body;
        console.log(newAdd)
        const result = await spotCollection.insertOne(newAdd)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res) =>{
    res.send('world explore server is running')
});


app.listen(port,()=>{
    console.log(`world explore server is running : ${port}`)
})