const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;


const mongoURI = 'mongodb+srv://sriram09877:hQeU0CdBEfQ4mDvf@cluster0.igv02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(mongoURI).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});


app.use(cors());
app.use(express.json());


const mockArticles = new mongoose.Schema({
    id:Number,
    title: String,
    exceprt: Number,
    category: String,
    tags: [String],
    readTime : String,
    author: {
        name : String,
        avatar : String
    }
});

const Article = mongoose.model('Article', mockArticles);


app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        console.error("Error retrieving articles:", error);
        res.status(500).json({ error: "Failed to fetch articles" });
    }
});

app.get('/articles/:id',async(req,res) => {
    try{
        const article = await Article.findOne({id:req.params.id});
        if(article){
            res.status(200).json(article)
        }else{
            res.status(404).json({error:"Article not found"})
        }
    }catch(error){
        console.error("Error retrieving article:", error);
        res.status(500).json({error : "Failed to fetch articles" });
    }
})


app.post('/articles', async (req, res) => {
    const{id,title,exceprt,category,tags,readTime,author} = req.body
    try {
        const article = new Article({
            id: id,
            title: title,
            exceprt: exceprt,
            category: category,
            tags: tags,
            readTime: readTime,
            author:{
                name: author.name,
                avatar: author.avatar
            }
        });
        
        await article.save();
        res.status(201).json(article);
    } catch (error) {
        console.error("Error adding article:", error);
        res.status(500).json({ error: "Failed to add article" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});