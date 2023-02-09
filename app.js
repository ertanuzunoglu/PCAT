const express = require('express');
const path = require('path');
const app = express();

const myLogger = (req, res, next) => {
    console.log('ertan');
    next();
};

//middlewares
app.use(express.static('public'));
app.use(myLogger);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './temp/index.html'));
});
const port = 4000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
