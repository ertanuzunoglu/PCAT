const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override'); // put request her tarayıcı tarafından desteklenmediği için bu modülü kullanmamız gerekiyor. put request yerine post request olarak simule edeceğiz.
const ejs = require('ejs');

const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageController');

const app = express();

//connect DB;
mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb+srv://ertanuzunoglu:Ertan6161.@pcat-cluster.onosjb8.mongodb.net/pcat-db?retryWrites=true&w=majority')
    .then(() => console.log('mongodb bağlantısı başarılı'))
    .catch(err => console.log(err));

//TEMPLATE ENGİNE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // urldeki datayı okumamızı sağlar
app.use(express.json()); // urldeki datayı json veritipine cevirmemizi sağlar.
app.use(fileUpload());
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
); // hangi methodların dönüştürüleceğini belirtmemiz gerekiyor. çünkü methodoverride defaultda post requesti put ve delete request olarak simule eder. delete için photo.ejs sayfasında delete etiketi a etikedir. biz buna bastığımızda aslında bir get request yapıyoruz. bu nedenle burda methods içerisinde get requesti de eklemeiyiz.

//ROUTES

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPAge);
app.get('/photos/edit/:id', pageController.getEditPage);

app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);



const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
