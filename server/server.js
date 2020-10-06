const express = require('express');
const app = express();

const port = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);

const path = require('path');

// import dotenv
require('dotenv').config();

// get access token from dotenv
const TOKEN = process.env.TREFLE_TOKEN;

server.listen(port, () => { console.log('Listening at port ' + port); });
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json({ limit: '1mb' }));


// Middlewares
// trefle (as soon as the web app starts)
const trefle_pages = require('./routes/trefle_pages');
app.use('/page/:PAGE', (req, res, next) => {

    // get the parameter from the client
    const PAGE = req.params.PAGE;

    // pack all the necessary variables into a request 
    req.page_info = { PAGE, TOKEN };
    next();

    // send it to the router
}, trefle_pages);

// wiki
const wiki = require('./routes/wiki');
app.use('/wiki/:param', async (req, res, next) => {

    // get the parameter from the client
    const param = req.params.param;

    // pack all the necessary variables into a request 
    req.wiki_info = { param };
    next();

    // send it to the router
}, wiki);

// edamam
const edamam = require('./routes/edamam');
app.use('/recipe', edamam);