const express = require('express');
const filesRouter = require('./routes/files');
const showRouter = require('./routes/show');
const downloadRouter = require('./routes/download');
const PORT = process.env.PORT || 3001;
const path = require('path');


const app = express();

const connectDB = require('./config/bd');

connectDB();
app.use(express.static('public'));
app.use(express.json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use('/api/files', filesRouter);
app.use('/files', showRouter);
app.use('/files/download', downloadRouter);

app.listen(PORT, ()=>{
    console.log(`listening on poert ${PORT}`);
})