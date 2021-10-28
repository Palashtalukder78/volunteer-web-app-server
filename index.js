const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = 5000

//Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ack9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("volunteer");
        const eventCollection = database.collection("events");

        //Insert data in Database
        app.post('/events', async (req, res) => {
            const events = req.body;
            const result = await eventCollection.insertOne(events);
            res.json(result)
        })
        //Read data from database
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({})
            const result = await cursor.toArray()
            res.send(result);
        });
        //Send data by id
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.findOne(query);
            res.send(result)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Volunteer web server')
})

app.listen(port, () => {
    console.log("Starting port for Volunteer", port);
})