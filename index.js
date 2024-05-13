const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svv3meu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const alternativeProductCollection = client.db('alternativeProductDB').collection('products');
    const userCollection = client.db('alternativeProductDB').collection('user');

    const queriesCollection = client.db('alternativeProductDB').collection('queries');


    app.get('/products', async(req, res) =>{
        const cursor = alternativeProductCollection.find();
        const result = await cursor.toArray();
        res.send(result);

        app.post('/products', async(req, res) =>{
            const newQueries = req.body;
             newQueries.dateAdd = new Date();
            console.log(newQueries);
            const result = await alternativeProductCollection.insertOne(newQueries);
            res.send(result);
        })
    })
    app.get('/user', async(req, res) =>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })



    app.post('/user', async(req, res) =>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/queries', async(req, res) =>{
        const cursor = queriesCollection.find();
        const result =  await cursor.toArray();
        res.send(result);
    })

    app.post('/queries', async(req, res) =>{
        const queries = req.body;
        console.log(queries);
        const result = await queriesCollection.insertOne(queries);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send(' Alternative Product is running')
})

app.listen(port, () =>{
    console.log(`Alternative Product server is running on port ${port}`)
})