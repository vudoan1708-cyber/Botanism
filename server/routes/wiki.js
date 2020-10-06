// import router
const router = require('express').Router();

// import node-fetch to fetch api
const fetch = require('node-fetch');

// page number
router.get('/image', async (req, res) => {

    const title = req.wiki_info.param;

    // get the URLs from wikipedia
    try {

        // create an options instance
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        }

        const IMG_URL = `https://en.wikipedia.org/w/api.php?action=query&prop=images&redirects=true&format=json&titles=${title}`;              
        const img_request = await fetch(IMG_URL, options);
        
        // receive the response in a form of json
        const wiki = await img_request.json();
        
        // turn an object property into an object array
        const img_files = Object.values(wiki.query.pages)[0];
        
        if (img_files.images !== undefined) {

            // loop through the array
            for (let i = 0; i < img_files.images.length; i++) {
                
                const name_split = img_files.images[i].title.split('.');
                const file_extension = name_split[name_split.length - 1].toLowerCase();
                
                // check for jpg file formats
                if (file_extension === 'jpg' || file_extension === 'jpeg') {
                    
                    // get the first one the loop gets to
                    const img_file = img_files.images[i].title;
                    
                    // get the url to get imageinfo from Wikipedia
                    const IMGINFO_URL = `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=${img_file}`;
                    const request = await fetch(IMGINFO_URL, options);
                    
                    // status
                    const status = request.status;

                    // if status is 400 (Bad Request)
                    if (status === 400) {

                        // ignore this iteration turn and continue with the loop
                        continue;

                    } else {

                        // receive the response in a form of json
                        const file_name = await request.json();

                        // send back to the client the image file url and the plant's new name
                        const data = {
                            file_name,
                            title: img_files.title
                        }
                        
                        res.json(data);
                        break;
                    }
                }
            }
        } else {

            // send back to the client the image file url and the plant's new name
            const data = {
                file_name: '',
                title: img_files.title
            }

            // respond to the client
            res.json(data);
        }

    // otherwise, respond the error to the client
    } catch(err) {
        console.warn(err);
        res.json(err);
    } 
});

module.exports = router;