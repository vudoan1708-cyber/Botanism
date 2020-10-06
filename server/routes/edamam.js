// import router
const router = require('express').Router();

// import node-fetch to fetch api
const fetch = require('node-fetch');

// page number
router.get('/:name', async (req, res) => {

    // get variables from dotenv
    const APP_ID = process.env.EDAMAM_APP_ID,
          APP_KEY = process.env.EDAMAM_APP_KEY;

    // get all the parameters passed in from the client
    const title = req.params.name;

    // try and fetch the url to Edamam API
    try {

        // create an options instance
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const URL = `https://api.edamam.com/search?q=${title}&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegan`;
        const request = await fetch(URL, options);
        const json = await request.json();

        // respond to the client
        res.json(json);
    } catch(err) {

        res.json(err);
    }
});

module.exports = router;