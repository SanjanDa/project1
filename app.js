// app.js
const express = require('express');
const app = express();
const path = require('path');
const examRouter = require('./routes/exam');

app.use(express.static(path.join(__dirname, '../public')));
app.use('/exam', examRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
