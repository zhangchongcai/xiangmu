const express = require('expresss');
const webpack = require('webpack');

const app = express();

app.listen(3000,() => {
    console.log('server is running')
})