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
    try {
        const { originalUrl } = req.body;

        const validUrl = URL.canParse(originalUrl.trim())

        if (validUrl) {
            const shortUrl = shortid.generate();
            const newUrl = new Url({ originalUrl, shortUrl})
            await newUrl.save();
            res.status(201).json({ originalUrl, shortUrl })
        } else {
            return res.status(400).json({ message: "Invalid URL format" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internarl server error" })
    }
})

// Redirect API

app.get("/:shortUrl", async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });

        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json("URL not found")
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

// GET All Url

app.get("/api/urllist", async (req, res) => {
    try {
        const urlList = await Url.find();

        if (urlList.length > 0) {
            return res.status(200).json({ urlList });
        } else {
            return res.status(404).json({ message: "No URL found" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

// Delete URL

app.delete("/api/delete/:shortUrl", async (req, res) => {
    try {
        const { shortUrl } = req.params;

        const result = await Url.deleteOne({shortUrl})

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "URL not found" });
        }

        return res.status(204);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))