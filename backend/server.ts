import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import shortid from 'shortid';
import 'dotenv/config';

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGODB_CONNECTION_STRING || 'mongodb://admin:secret@localhost';


async function connectToDatabase() {
    await mongoose.connect(mongoUrl)
}

connectToDatabase()

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
})

const Url = mongoose.model('Url', urlSchema)

// Shorten API

app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = shortid.generate();
    const newUrl = new Url({ originalUrl, shortUrl})
    await newUrl.save();
    res.status(201).json({ originalUrl, shortUrl })
})

// Redirect API

app.get("/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });

    if (url) {
        return res.redirect(url.originalUrl);
    } else {
        return res.status(404).json("URL not found")
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))