const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
    // console.log(req.query);
    // const photos = await Photo.find({}).sort('-dateCreated'); // dbdeki photoları alıyoruz.
    // res.render('index', {
    //     photos: photos,
    // }); // ikinci parametre olarak dbden aldığımız photoları koyuyoruz.

    const page = req.query.page || 1;
    const photosPerPage = 3;
    const totalPhotos = await Photo.find().countDocuments();
    const photos = await Photo.find({})
        .sort('-dateCreated')
        .skip((page - 1) * photosPerPage) //geçececeği fotoğraf sayısını belirtiyoruz.
        .limit(photosPerPage); //her sayfada kaç adet göstereceğini belirtiyoruz.
    res.render('index', {
        photos: photos,
        current: page, // anlık sayfa numarası
        pages: Math.ceil(totalPhotos / photosPerPage), //toplam sayfa sayısı // math ceil yukarı yuvarlamak için
    });
};

exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo: photo,
    });
};

exports.createPhoto = async (req, res) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    let uploadedImage = req.files.image;
    let uploadedPath = __dirname + '/../public/uploads/' + uploadedImage.name; // public içerisinde yüklenen görseli koyduğumuz klasörü oluşturur.

    uploadedImage.mv(uploadedPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadedImage.name,
        });
        res.redirect('/');
    });
};

exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    fvv;
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    let deletedImage = __dirname + '/../public' + photo.image;
    if (fs.existsSync(deletedImage)) {
        fs.unlinkSync(deletedImage);
    }
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
};
