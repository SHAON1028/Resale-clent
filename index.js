const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('colors')
require("dotenv").config();

//middleware
app.use(cors())
app.use(express.json())
//MongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvl7r98.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//MongoFunction
const run = async()=>{
    try{
       //collection
       const categoriesCOllections = client.db('Resale').collection('categories')
       const usersCollection = client.db('Resale').collection('users')
       const productsCollection = client.db('Resale').collection('products')
       const ordersCollection = client.db('Resale').collection('orders')


    //    endpooint

    app.get('/categories',async (req,res)=>{
        const query = {}
        const categories = await categoriesCOllections.find(query).toArray()
        res.send(categories)
    })    

    //user
    app.post('/users', async (req, res) => {
        const user = req.body;
       
        const result = await usersCollection.insertOne(user);
        console.log(result)

        res.send({result});
    });


    // products
    app.get('/products/:category',async (req,res) =>{
        const category = req.params.category
        const query = {category: category}
        const products = await productsCollection.find(query).toArray()
        res.send(products)
    })

    // Orders
    app.post('/orders', async (req, res) => {
        const order = req.body;
        // console.log(order);
        const result = await ordersCollection.insertOne(order);
        res.send(result);
    });
    // checkAdmin
    app.get('/users/checkAdmin/:email', async (req, res) => {
        const email = req.params.email
        const query = {email}
        const result = await usersCollection.findOne(query)
        res.send({isAdmin:result?.role === 'admin'})
    });
    
    //check seller
    app.get('/users/checkSeller/:email', async (req, res) => {
        const email = req.params.email
        const query = {email}
        const result = await usersCollection.findOne(query)
        res.send({isSeller:result?.role === 'Seller'})
    });
    // end bracket
    }

    finally{

    }
}
run().catch(err=>console.log(err))

//MongoDb
app.get('/',(req,res)=>{
    res.send('Resale Server is Runnig')
})
app.listen(port,(req,res)=>{
   console.log(`Server is running on ${port}`.cyan)
})
