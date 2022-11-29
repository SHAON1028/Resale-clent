const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
       const advertiseCollection = client.db('Resale').collection('advertise')


    //    endpooint

    app.get('/categories',async (req,res)=>{
        const query = {}
        const categories = await categoriesCOllections.find(query).toArray()
        res.send(categories)
    })    
    app.get('/advertise', async (req, res) => {
      
        const result = await productsCollection.find({add:'ok'}).limit(3).toArray()
        res.send(result)
    })

    //user
    app.post('/users', async (req, res) => {
        const user = req.body;
       
        const result = await usersCollection.insertOne(user);
        console.log(result)

        res.send({result});
    });
    // delete user
    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await usersCollection.deleteOne(filter);
        res.send(result);
    })
    // delete product
    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await productsCollection.deleteOne(filter);
        res.send(result);
    })


    // Advertise
    app.post('/advertise', async (req, res) => {
        const product = req.body
        const result = await advertiseCollection.insertOne(product);
        res.send(result);
    })

    // products
    app.get('/products/:category',async (req,res) =>{
        const category = req.params.category
        const query = {category: category}
        const products = await productsCollection.find(query).toArray()
        res.send(products)
    })
    app.post('/products', async (req, res) => {
        const product = req.body;
        const result = await productsCollection.insertOne(product);
        console.log(result)

        res.send({result});

    })
    app.put('/products/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                add: 'ok'
            }
        }
        const result = await productsCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    })
    app.get('/dashboard/myproduct/:email', async (req, res) => {
        const email = req.params.email
        const query = {email: email}
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
    // checkVerification
    app.get('/users/checkVerification/:email', async (req, res) => {
        const email = req.params.email
        const query = {email}
        const result = await usersCollection.findOne(query)
        res.send({isVerification:result?.status === 'verified'})
    });
    // advertise product
    
    //check seller
    app.get('/users/checkSeller/:email', async (req, res) => {
        const email = req.params.email
        const query = {email}
        const result = await usersCollection.findOne(query)
        res.send({isSeller:result?.role === 'Seller'})

     
    });
    app.get('/users/seller',async (req,res)=>{
        const query = {role: 'Seller'}
        const sellers = await usersCollection.find(query).toArray()
        res.send(sellers)
    }) 
    
    
    // Buyer

    app.get('/users/buyer',async (req,res)=>{
        const query = {role: 'Buyer'}
        const buyers = await usersCollection.find(query).toArray()
        res.send(buyers)
    })  

    // verification 

    app.put('/users/admin/:id',  async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                status: 'verified'
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
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
