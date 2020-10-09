// router module from express
const router = require('express').Router();

// fetch API in node
const fetch = require('node-fetch');

// trefle (search plants)
router.get('/:title/:PAGE', async (req, res) => {

    // get all the parameters passed in from the client and the main route
    const TITLE = req.params.title,
          PAGE = req.params.PAGE,
          TOKEN = req.info.TOKEN;
          
    // get the URL from trefle.io
    try {

        const URL = `https://trefle.io/api/v1/plants/search?q=${TITLE}&page=${PAGE}&token=${TOKEN}`;
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