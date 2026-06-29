const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGO_DB_URI;

const app = express()
const port = process.env.PORT


app.use(cors())
app.use(express.json())


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const db = client.db('Ebook_DB')
    const booksCollection = db.collection('books')
    const bookMarkCollection = db.collection('bookMark')
    const bookPurchesCollection = db.collection('bookPurches')
    const bookPaymentCollection = db.collection('bookPayment')
    const userCollection = db.collection('user')

    app.post('/api/book', async (req, res) => {
      const book = req.body;
      const result = await booksCollection.insertOne(book)
      res.send(result);
    })

    app.get('/api/books', async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    })

    app.get('/api/books/:id', async (req, res) => {
      const {id} = req.params;
      const result = await booksCollection.findOne({_id: new ObjectId(id)})
      res.send(result);
    })

    app.get('/api/bookswriter/:writerId', async (req, res) => {
      const {writerId} = req.params;
      const result = await booksCollection.find({writerId}).toArray();
      res.send(result);
    })

    app.patch("/updateBook/:id", async (req, res)=>{
      const {id} = req.params
      const updateData = req.body

      const result = await booksCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updateData}
      )
      res.send(result)
    })

    app.post('/api/bookmark', async (req, res) => {
      const bookMarks = req.body;
      const result = await bookMarkCollection.insertOne(bookMarks)
      res.send(result);
    })
    
    app.get('/api/bookmark', async (req, res) => {
      const result = await bookMarkCollection.find().toArray();
      res.send(result);
    })


    app.get('/api/bookmark/:userId', async (req, res) => {
      const {userId} = req.params;

      const result = await bookMarkCollection.find({userId}).toArray();
      res.send(result);
    })


    app.post('/api/bookPayment', async (req, res) => {
      const {sessionId, userId, transactionId, userEmail, price, date, title, description, genre, writerId, userName, writerName, coverImage } = req.body;

      const isExist = await bookPaymentCollection.findOne({sessionId})
      if(isExist){
        return res.json({msg: "Already Exist.."})
      }
      const result = await bookPaymentCollection.insertOne({sessionId,
        userId,
        transactionId,
        userEmail,
        title,
        price,
        coverImage,
        description,
        genre,
        writerId,
        userName,
        writerName,
        coverImage,
        date: new Date()})
      res.send(result);
    })


    app.post('/api/bookPurches', async (req, res) => {
      const purchesData = req.body;
      
      const result = await bookPurchesCollection.insertOne(purchesData)
      res.send(result);
    })

    app.get('/api/bookPurches', async (req, res) => {
      const result = await bookPaymentCollection.find().toArray();
      res.send(result);
    })

    app.get("/api/bookPurches/:userId", async (req, res) =>{
      const {userId} = req.params;
      const result = await bookPaymentCollection.find({userId}).toArray()
      res.send(result)
    })

    app.get('/api/writerBooksSale/:writerId', async (req, res) => {
      const {writerId} = req.params;
      const result = await bookPaymentCollection.find({writerId}).toArray();
      res.send(result);
    })

    app.get('/api/bookPurchesDetails/:id', async (req, res) => {
      const {id} = req.params;
      const result = await bookPaymentCollection.findOne({_id: new ObjectId(id)})
      res.send(result);
    })

    app.get('/api/user', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.delete("/UserDelete/:id", async(req, res)=>{
      const {id} = req.params;
      const result = await userCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result)
    })

    app.delete("/writerEbook/:id", async(req, res)=>{
      const {id} = req.params;
      const result = await booksCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result)
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})