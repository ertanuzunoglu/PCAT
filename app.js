const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const ejs = require('ejs');

const Photo = require('./models/Photo');

const app = express();

//connect DB;
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/pcat-test-db', () => console.log('mongodb bağlantısı başarılı'));

//TEMPLATE ENGİNE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // urldeki datayı okumamızı sağlar
app.use(express.json()); // urldeki datayı json veritipine cevirmemizi sağlar.

//ROUTES
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.get('/', async (req, res) => {
    const photos = await Photo.find({}); // dbdeki photoları alıyoruz.
    res.render('index', {
        photos: photos,
    }); // ikinci parametre olarak dbden aldığımız photoları koyuyoruz.
    for (let i of photos) {
        console.log(i.title, i.description);
    }
});

//formdan gelen bilgiler

app.post('/photos', async (req, res) => {
    await Photo.create(req.body);
    res.redirect('/');
});




const port = 4000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
