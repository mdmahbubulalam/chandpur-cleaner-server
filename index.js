const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtufm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = process.env.PORT || 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("chandpurCleaner").collection("services");
    const ordersCollection = client.db("chandpurCleaner").collection("orders");

  
    console.log('DB connected');

    app.post('/addService', (req,res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/services', (req,res) => {
        serviceCollection.find()
        .toArray((err, items) => {
          res.send(items);
        })
    })

    app.delete('/delete/:id', (req,res) => {
        serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then( result => {
          res.send(result.deletedCount>0)
        })
    })

    app.post('/addOrder', (req,res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
    })

    app.get('/orders', (req,res) => {
      console.log(req);
      ordersCollection.find({email:req.query.email})
      .toArray((err, items) => {
        res.send(items);
      })
    })
    
  });



app.listen(process.env.PORT || port);