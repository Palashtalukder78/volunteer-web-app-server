const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

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
        const registeredCollection = database.collection("registeredUser");

        //Insert data in Database from add-event page
        app.post('/events', async (req, res) => {
            const events = req.body;
            const result = await eventCollection.insertOne(events);
            res.json(result)
        })
        //Insert data in Database from register page
        app.post('/registered', async (req, res) => {
            const registeredUser = req.body;
            const result = await registeredCollection.insertOne(registeredUser);
            res.json(result)
        })
        //Read data for dashboard
        app.get('/registered', async (req, res) => {
            const cursor = registeredCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        });
        //Delete registered User from Dashboard
        app.delete('/registered/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await registeredCollection.deleteOne(query);
            res.json(result);
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