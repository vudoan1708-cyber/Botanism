// import router
const router = require('express').Router();

// import node-fetch to fetch api
const fetch = require('node-fetch');

// page number
router.get('/', async (req, res) => {

    // get all the parameters passed in from the client and the main route
    const PAGE = req.page_info.PAGE,
          TOKEN = req.page_info.TOKEN;
          
    // get the URL from trefle.io
    try {
        
        const URL = `https://trefle.io/api/v1/plants?page=${PAGE}&token=${TOKEN}`;
        
        const request = await fetch(URL);
        const json = await request.json();

        // respond to the client
        res.json(json);
    } catch(err) {

        // respond the error to the client
        res.json(err);
    }
});

// trefle (plant detail)
router.get('/detail/:id', async (req, res) => {

    // get all the parameters passed in from the client and the main route
    const ID = req.params.id,
          TOKEN = req.page_info.TOKEN;
          
    // get the URL from trefle.io
    try {

        const URL = `https://trefle.io/api/v1/plants/${ID}?token=${TOKEN}`;
        const request = await fetch(URL);
        const json = await request.json();

        // respond to the client
        res.json(json);
    } catch(err) {

        // respond the error to the client
        res.json(err);
    }
});

module.exports = router;