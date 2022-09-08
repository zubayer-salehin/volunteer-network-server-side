const express = require('express')
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Volunteer Network Server Side')
})


const uri = `mongodb+srv://${process.env.DB_USRR}:${process.env.DB_PASSWORD}@cluster0.5pmu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        await client.connect();
        const eventCollection = client.db("volunteerNetwork").collection("event");
        const orderCollection = client.db("volunteerNetwork").collection("order");

        app.get('/event', async (req, res) => {
            const query = {};
            const cursor = eventCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/event/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await eventCollection.findOne(query);
            res.send(result)
        })

        app.post('/event', async (req, res) => {
            const newEvent = req.body
            const result = await eventCollection.insertOne(newEvent);
            res.send(result)
        })

        app.delete("/event/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/order', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        app.get('/orders', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/zubayer', (req, res) => {
            res.send('My name is zubayer')
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
