// constant variables (DOM elements)
const windows = document.getElementById('windowProperties'),
      plant_detail = document.getElementById('plant_detail'),
      plant_detail_wrapper = document.getElementById('plant_detail_wrapper'),
      pages = document.getElementById('pages'),
      table_wrapper = document.getElementById('table_wrapper'),
      table_body = document.getElementById('table_body'),
      loading = document.getElementById('loading'),
      recipe_wrapper = document.getElementById('recipe_wrapper'),
      nutrientsChart = document.getElementById('nutrientsChart'),
      game_entry = document.getElementById('game_entry'),
      user_icon = document.getElementById('user_icon');

// global assignable variables
let myChart = null;
let navigatingIndex = 0;
let searched_keyword = '';

// ADD A GLOBAL KEYBOARD LISTENER
function escapeHit(inGame) {

    // if not in the game section
    if (!inGame) {
        
        // add keydown event listeners
        document.getElementById('search').addEventListener('keydown', (e) => {

            // if escape key is pressed, search for plants
            if (e.key === 'Enter') searchPlants(1, 0);
        });

    } else {
        const ingame_input_field = document.getElementById('ingame_input_field');
        ingame_input_field.addEventListener('keydown', (e) => {
            
            if (e.key === 'Enter') {

                for (let i = 0; i < weapons.length; i++) {

                    // compare the input string and the plant name
                    const isMatched = weapons[i].compare(ingame_input_field.value.toLowerCase().replace(/^\s+|\s+$/g, ''));

                    // if they match
                    if (isMatched) {

                        // create new bullet instance at the same position as the weapon's
                        bullet = new Bullets(weapons[i].x, weapons[i].y, 10);
                        bullets.push(bullet);

                        // set the styling to default
                        ingame_input_field.style.border = '1px solid black';

                        // reset the input field to empty
                        ingame_input_field.value = '';
                    }
                }
            }
        });
    }
}

// RESTRUCTURE STRINGS
async function reconstructStrings(name) {
    
    let letters = '',
        words = '';

    let isSplit = false;

    // search for any whitespaces
    if (name.indexOf(' ') !== -1) {

        // split all white spaces in a string
        words = name.split(' ');
        isSplit = true;

    // otherwise, if there is no whitespaces
    } else {
        
        // search for any underscore
        if (name.indexOf('_') !== -1) {

            // split all white spaces in a string
            words = name.split('_');
            isSplit = true;
        
        // otherwise, if there is no underscore either
        } else {
            
            words = name;
            isSplit = false;
        }
    } 

    // restructure the string
    // loop through the length of a string
    for (let i = 0; i < words.length; i++) {

        // if the case is with either whitespaces or underscores
        if (isSplit) {
            
            for (let j = 0; j < words[i].length; j++) {

                // pass a character from the string to another variable
                let word = words[i];
    
                // uppercase all the initial characters
                if (j === 0) word = words[i][j].toUpperCase();
                else word = words[i][j];
    
                // re-structure all the letters, form a new string
                letters += word;
            }
    
            // add a white space after a word
            letters += ' ';

        // if the string is a single word
        } else {

            // pass a character from the string to another variable
            let word = words[i];
    
            // uppercase all the initial characters
            if (i === 0) word = words[i].toUpperCase();

            // re-structure all the letters, form a new string
            letters += word;
        }
    }    
    return letters;
}

// CHECK AN OBJECT'S PROPERTIES
function isEmpty(obj) {

    // loop through the obj
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

// REMOVE ELEMENTS
function removeElements(childNodes) {
    
    // loop through all the nodes backwards to not miss any element
    for (let i = childNodes.length - 1; i >= 0; i--) {
        
        // remove each of them
        childNodes[i].remove();
    }
}

// MODIFY INDEX NUMBER
function getModifiedIndexNumber(on_page_num, switched) {
    
    let result = 0;

    // if the selected page number is 1
    if (on_page_num === 1) {

        if (switched) result = result;
        else result = on_page_num;
    }

    // otherwise
    else result = on_page_num;

    return result;
}

// DETECTING MOBILE DEVICES 
function isMobile() {

    if ( (typeof window.orientation !== "undefined") || 
    ( navigator.userAgent.indexOf('IEMobile') !== -1 ) )  
        return true;
    else return false;
}

// WIKIPEDIA
async function getWikipedia(param, turns) {
    
    turns++;
    
    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // get an endpoint to the server side to retrieve data
    // pass in parameters
    const request = await fetch(`/wiki/${param}/image`, options);
    const wiki = await request.json();
    const isObjEmpty = isEmpty(wiki);
    
    // check for any property inside the obj
    if (!isObjEmpty) {
        
        let IMG_URL = '',
            title = '';
        
        if (wiki.file_name !== '') {

            // get the title
            title = wiki.title;

            // turn an object value into an array
            const wiki_img_info = Object.values(wiki.file_name.query.pages)[0];
            
            // get the img url from the Wikipedia page
            IMG_URL = wiki_img_info.imageinfo[0].url;

        } else {
            IMG_URL = '#';
            title = '';
        }
        return { title, IMG_URL, turns };
    }
}

function nextPrevButtons(recipe) {

    let buttons = [];

    // create 2 new h5 tags
    for (let i = 0; i < 3; i++) {
        
        // create two buttons and append them to the wrapper
        buttons[i] = document.createElement('div');
        buttons[i].className = 'recipe_nav_buttons';
        recipe_wrapper.appendChild(buttons[i]);

        // if i is the first array element
        i === 0 ? 
            (buttons[i].innerHTML = '<',

            // add event listener
            // scroll to top everytime a button is clicked
            buttons[i].addEventListener('click', () => {
                if (navigatingIndex > 0) {
                    navigatingIndex--;
                    recipe_wrapper.scrollTo({ top: 0, behavior: 'smooth' });
                    chartData(null, null, 1);
                    showRecipe(recipe);
                }
                else {
                    navigatingIndex = 0;
                    recipe_wrapper.scrollTop = 0;
                    chartData(null, null, 1);
                    showRecipe(recipe);
                }
            })) :

        // if i is the last array element
        i === 2 ? 
            (buttons[i].innerHTML = '>', 
            buttons[i].addEventListener('click', () => {
                
                const max = recipe.hits.length - 1;

                if (navigatingIndex < max) {
                    navigatingIndex++;
                    recipe_wrapper.scrollTop = 0;
                    chartData(null, null, 1);
                    showRecipe(recipe);
                }
            })) :
        
        // otherwise
        (buttons[i].innerHTML = navigatingIndex,
            buttons[i].id = 'navigatingIndex');
    }
}

function chartData(total_vals, Xlabels, num_case) {

    // destroy old charts to avoid glitchy effects
    // from overlaying charts created by creating instances of charts
    if (num_case === 1) myChart.destroy();
    else {

        nutrientsChart.style.display = 'block';

        myChart = new Chart(nutrientsChart, {
            type: 'bar',
            data: {
                labels: Xlabels,
                datasets: [{
                    label: 'Nutrient Values',
                    data: total_vals,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 10
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        align: 'center'
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 9
                        }
                    }]
                }
            }
        });
    }
}

// SHOW RECIPE ONCE THE NOTIFICATION IS CLICKED
function showRecipe(recipe) {

    // display index page inside recipe section
    const recipe_pages = document.getElementById('navigatingIndex');
    if (recipe_pages !== null) recipe_pages.innerHTML = navigatingIndex;

    let nutrients_labels = [],
        nutrients_values = [],
        nutrients_daily = [],
        recipe_calories = [],
        recipe_img_url = [],
        recipe_label = [];

    
    // check for a valid length of the array
    if (recipe.hits.length > 0) {

        const childNodes = plant_detail.childNodes;

        childNodes.forEach(node => {

            // if a node's style is defined
            node.style !== undefined ? 

                // if the node's id is table_wrapper
                node.id === 'table_wrapper' ? 
                    (node.style.right = '-100%', node.style.position = 'absolute') :

                    // or if the node's id is nutrientsChart
                node.id === 'nutrientsChart' ? 
                    (node.style.bottom = '0px') :

                    // or if the node's id is recipe_wrapper
                node.id === 'recipe_wrapper' ? 
                    (node.style.zIndex = 2) :

                    // otherwise
                    (node.style.left = '-100%') :
            undefined;
        });
        
        // loop through the array
        for (let i = 0; i < recipe.hits.length; i++) {

            recipe_calories.push(recipe.hits[i].recipe.calories + 'kcal / serving');
            recipe_img_url.push(recipe.hits[i].recipe.image);
            recipe_label.push(recipe.hits[i].recipe.label);

            const recipe_digest = recipe.hits[i].recipe.digest;

            // loop through digest array
            for(let j = 0; j < recipe_digest.length; j++) {
                
                nutrients_labels.push(recipe_digest[j].label);
                nutrients_values.push(recipe_digest[j].total);
                nutrients_daily.push(recipe_digest[j].daily);
            }
        }

        
        // divide the total number of recipes into individual one
        const divided = nutrients_values.length / recipe.hits.length;

        // create next and previous buttons for the recipe detail navigations
        if (document.querySelector('.recipe_nav_buttons') === null)
            nextPrevButtons(recipe);
        else if (document.querySelector('.recipe_detail_img_container') !== null) {
            removeElements(document.getElementsByTagName('h4'));
            removeElements([document.querySelector('.recipe_detail_img_container')]);
        }
        
        const img = document.createElement('img'),
              img_div = document.createElement('div');
        img.src = recipe_img_url[navigatingIndex];
        img.className = 'recipe_detail_img'
        img_div.className = 'recipe_detail_img_container';
        img_div.style.display = 'block';

        // append the img to the img div
        img_div.appendChild(img);

        // create the title of the recipe
        const title = document.createElement('h4');
        title.innerHTML = recipe_label[navigatingIndex];
        
        // append the title to recipe_wrapper div as the first element
        recipe_wrapper.insertAdjacentElement('afterbegin', title);

        // append the img div to recipe_wrapper div as the next sibling of title header
        title.parentNode.insertBefore(img_div, title.nextSibling);

        // default value for the display, in order to show the first recipe
        nutrients_values = nutrients_values.slice(divided * navigatingIndex, divided * (navigatingIndex + 1));
        nutrients_labels = nutrients_labels.slice(divided * navigatingIndex, divided * (navigatingIndex + 1));

        // draw a chart with the total number of recipes,
        // all recipe's total values, all the corresponding labels, and healthy daily consumption of the nutrients
        chartData(nutrients_values, nutrients_labels, 2);
    }
}

// SHOW TOASTR NOTIFICATIONS
function showRecipeNotification(recipe) {

    // a toaster options instance
    toastr.options = {
        'closeButton': true,
        'debug': false,
        'newestOnTop': true,
        'progressBar': true,
        'positionClass': 'toast-top-right',
        'preventDuplicates': true,
        'onclick': function(e) { showRecipe(recipe); },
        'showDuration': '50',
        'hideDuration': '1000',
        'timeOut': '5000',
        'extendedTimeOut': '1000',
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut'
    };
    
    // if recipe is NOT a null obj
    recipe !== null ?

        recipe.hits !== undefined ?

            // if the length of the object array is valid
            recipe.hits.length > 0 ? 

                // if the length is only 1
                recipe.hits.length === 1 ?

                    // display the toaster, with provided options
                    toastr.success('Click here to see more', `There is ${recipe.hits.length} recipe for this plant`, toastr.options) :
                    toastr.success('Click here to see more', `There are ${recipe.hits.length} recipes for this plant`, toastr.options) :
            toastr.warning(`There is no recipe for this plant`, toastr.options) :
        toastr.error('Cannot get the data at the moment', 'Error', toastr.options):

    // otherwise, recipe is a null obj
    toastr.error('Cannot get the data at the moment', 'Error', toastr.options);
}

// EDAMAM (RECIPE API)
async function getRecipe(name) {

    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // get an endpoint to the server side to retrieve data
    // pass in parameters
    const request = await fetch(`/recipe/${name}`, options);
    const recipe = await request.json();

    showRecipeNotification(recipe);
}

// DISTRIBUTION AREAS 
function distributedPlants(areas, td_body, tr_body, j, title) {

    // loop through the array if the object is not undefined and have a valid length
    if (areas !== undefined && areas.length > 0) {

        for (let k = 0; k < areas.length; k++) {

            // change text
            if (j === 0) td_body.innerHTML = title;
            else td_body.innerHTML += areas[k] + '<br />' + '<br />';

            // append the td_body to the tr_body element
            tr_body.appendChild(td_body);
        }

    // otherwise
    } else {

        // change text
        if (j === 0) td_body.innerHTML = title;
        else td_body.innerHTML = '*'

        // append the td_body to the tr_body element
        tr_body.appendChild(td_body);
    }
}

// DISPLAYING INFO ON A TABLE
async function displayTable(detail) {

    // detail info for the display
    const tabular_vals = Object.entries(detail.data);

    // tabular display variables
    let tr_body = [],
        td_body = [];
        
    // generate table (2 cols / row)
    // rows
    for (let i = 0; i < tabular_vals.length; i++) {

        // create a table row element and a class name each iteration
        tr_body[i] = document.createElement('tr');
        tr_body[i].className = 'tr_body';

        // append the number of tr according to countryData length to tbody 
        table_body.appendChild(tr_body[i]);

        let key = tabular_vals[i][0],
            value = tabular_vals[i][1];

        // columns (as Object.entries produces a collections of 2-d arrays, with each inner array containing 2 elements: a key and a value)
        for (let j = 0; j < tabular_vals[i].length; j++) {

            // ignore the following keys
            if (key !== 'id' && key !== 'main_species_id' && key !== 'image_url' && key !== 'bibliorgraphy' && 
                key !== 'genus_id' && key !== 'links' && key !== 'subspecies' && key !== 'varieties' && 
                key !== 'hybrids' && key !== 'forms' && key !== 'subvarieties' && key !== 'sources') {

                    // create a table td body and a class name each iteration
                    td_body[j] = document.createElement('td');
                    td_body[j].className = 'td_body';
                    
                    // check if the value variable is not another array
                    if (typeof(value) !== 'object') {
                            
                        Promise.all([

                            // if value is of type string
                            typeof(value) === 'string' ? 

                                    // reconstruct the strings
                                    // if j is 0
                                    ( j === 0 ? key = await reconstructStrings(key) :  

                                        // otherwise, if j is not 0
                                        value = await reconstructStrings(value) ) : 

                                    // otherwise, if value is of type number or boolean
                                    ( j === 0 ? key = await reconstructStrings(key) :
                                        value = String(value) )

                        ]);

                        // change text
                        if (j === 0) td_body[j].innerHTML = key;
                        else  td_body[j].innerHTML = value;

                        // append the td_body to the tr_body element
                        tr_body[i].appendChild(td_body[j]);
                        
                    // otherwise, if value is an object
                    } else {

                        // look for a key of main species
                        if (key === 'main_species') {

                            // if not a null object
                            if (value !== null) {

                                const native_plant = value.distribution.native;

                                // create two tr body elements in here
                                // because there two keys that need showing, but they are not in a separate iteration of a loop
                                distributedPlants(native_plant, td_body[j], tr_body[i], j, 'Native Distributions');

                            // otherwise, if it's null
                            } else {

                                key = await reconstructStrings(key)
                                    .then(() => {

                                        // change text
                                        if (j === 0) td_body[j].innerHTML = key;
                                        else td_body[j].innerHTML = '*'
            
                                        // append the td_body to the tr_body element
                                        tr_body[i].appendChild(td_body[j]);
                                    });
                            }
                        }
                    }
                }
        }
    }
}

// SHOW DETAIL OF A PLANT
async function showPlantDetails(detail, img_url) {

    // BRING THE DETAILS BACK TO DEFAULT STYLE IF A USER TRIES TO SEE OTHER INFO AFTER CLICKING THE TOASTR
    const childNodes = plant_detail.childNodes;
    
    // the default styling
    childNodes.forEach(node => {
        node.style !== undefined ? 
        
            // if the node's id is table_wrapper
            node.id === 'table_wrapper' ? 
                (node.style.right = '0', node.style.position = 'relative') :

            // or if the node's id is nutrientsChart
            node.id === 'nutrientsChart' ? 
                (node.style.bottom = '-100%') :

            // or if the node's id is recipe_wrapper
            node.id === 'recipe_wrapper' ? 
                (node.style.zIndex = 0) :
                
                // otherwise
                (node.style.left = '0') :
        undefined;
    });


    ////////////////////////////////////////
    // REMOVE OLD ELEMENTS
    ////////////////////////////////////////

    // select old div elements
    const oldDivs = document.querySelectorAll('div'),
          table_remover = document.querySelectorAll('.tr_body');

    // check if there are any one of them
    if (table_remover.length > 0) {

        // remove them
        removeElements(table_remover);
    }

    // check if the array has any child elements
    if (oldDivs.length > 0) {

        let temp_arr = [];
        
        // loop through the array
        for (let i = oldDivs.length - 1; i >= 0; i--) {

            // find the according class names
            if (oldDivs[i].className === 'plant_detail_img_container' || oldDivs[i].className === 'recipe_detail_img_container') {

                    // push those divs in a temporarily made array
                    temp_arr.push(oldDivs[i]);

                    // remove them
                    removeElements(temp_arr);
            }
        }
    }

    ////////////////////////////////
    // DISPLAY TABULAR DATA
    ////////////////////////////////
    
    // show the hidden elements
    plant_detail.style.display = 'block';
    plant_detail_wrapper.style.display = 'block';

    // create new DOM elements
    const img = document.createElement('img'),
          imgDiv = document.createElement('div');
    
    // append imgs and class names
    img.src = img_url;
    img.className = 'plant_detail_img';
    imgDiv.className = 'plant_detail_img_container';

    // most of the info and table creation is in this function
    displayTable(detail);

    // API call to Edamam
    detail.data.common_name !== null ? getRecipe(detail.data.common_name) :
        getRecipe(detail.data.scientific_name)

    imgDiv.appendChild(img);
    plant_detail.appendChild(imgDiv);
}

// GET DETAIL OF A PLANT
async function getPlantDetails(id, PAGE, img_url) {

    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // get an endpoint to the server side to retrieve data
    // pass in a parameter
    const request = await fetch(`/page/${PAGE}/detail/${id}`, options);
    const details = await request.json();

    showPlantDetails(details, img_url);
}

//LIST ALL THE PAGES
function listPages(total_plants, on_page_num, isSearched) {

    const total_pages = Math.floor(total_plants / 20),
          subtracted = total_pages - on_page_num;

    let num_pages = [],
        limit_bounds = [-1, 4];
    let old_pages = document.querySelectorAll('button');
    let switched = false;

    // hide all the detail-related elements
    plant_detail.style.display = 'none';
    plant_detail_wrapper.style.display = 'none';

    // check for any old buttons before loading new ones
    if (old_pages.length > 0) {

        // remove them
        removeElements(old_pages);
    } 

    // current page number is less than 20321
    if (on_page_num <= total_pages) {

        // change the currently selected page to one
        // so that the for loop below won't start with a negative number
        if (on_page_num === 0) {
            on_page_num = 1;
            switched = true;
        }

        // check if the current page reaches the 4 ending pages (upper limit)
        if (on_page_num > total_pages - 4) {

            // both limits will drop
            // upper limit should always be negative
            limit_bounds[0] = subtracted - 5;

            // lower limit should always be positive
            limit_bounds[1] = subtracted;
        }
        
        // create pages section at the bottom of a page
        // the loop starts with a page before the currently selected page
        // as the page progresses to the 4 ending pages, the index will start doing the calculation
        // so that, there is less numbers left on the right hand side and more on the left hand side of the selected page
        for (let i = on_page_num + limit_bounds[0]; i < on_page_num + limit_bounds[1]; i++) {

            // show the number of pages
            num_pages[i] = document.createElement('button');
            num_pages[i].innerHTML = i + 1;
            num_pages[i].className = 'page_number';
            pages.appendChild(num_pages[i]);

            // listen for a click event on one of the page numbers
            num_pages[i].addEventListener('click', async function () {

                // if the workflow chain starts with a search
                if (isSearched) {

                    // re-start the workflow, with a selected page index passed in 
                    // to get started from there instead of going back from scratch 
                    await searchPlants(i + 1, i);  

                // otherwise
                } else {

                    // same logic
                    await getPlants(i + 1, i);  
                }          
                
                // scroll the page to the top again
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // wait till the loop gets to the last element of the array
            if (i === on_page_num + limit_bounds[1] - 1) {

                const index = getModifiedIndexNumber(on_page_num, switched);
                
                // change the style of the currently selected button
                num_pages[index].style.backgroundColor = 'rgba(176, 245, 48, 0.699)';
                num_pages[index].style.fontSize = '10px';
            }
        }
    }
}

// SHOW GAME ENTRY
function showGameEntry(urls) {

    // pick a random icon
    const icon_url = urls[Math.floor(Math.random() * (urls.length))];
    
    // append src img
    user_icon.src = icon_url;
    plant_detail_wrapper.style.display = 'block';
    game_entry.style.display = 'block';
}

// BUTTONS FOR GAMIFICATIONS SECTION
function showGamificationButton(names, urls) {
    
    // create a button
    const gameButton = document.createElement('div'),
          gameStartButton = document.createElement('div');
    
    gameStartButton.innerHTML = 'START';
    gameStartButton.id = 'start_game_button';
    entry_info.parentNode.insertBefore(gameStartButton, entry_info.nextSibling);

    // assign an id to it
    gameButton.id = 'guess_game_button';

    // insert text
    gameButton.innerHTML = 'Guess A Plant';

    // append it next to the pages div tag as a next sibling element
    pages.parentNode.insertBefore(gameButton, pages.nextSibling);

    // add a mouseup event listener to the buttons
    gameButton.addEventListener('mouseup', () => {
        
        showGameEntry(urls);
    });
    gameStartButton.addEventListener('mouseup', () => {

        // if the text field for username input is not empty
        if (username.value !== '') {

            // hide the game start button
            gameStartButton.style.visibility = 'hidden';
            
            // set the container to be fullscreen
            game_entry.style.setProperty('transform', 'translate(0, 0)', 'important');
            game_entry.style.setProperty('width', '100%', 'important');
            game_entry.style.setProperty('height', '100%', 'important');

            init(names, urls);
        }
    });
}

// DISPLAY IMAGES
async function appendImages(img, plant_name, url, scientific_name, common_name, params, turns) {
    
    loading.style.display = 'block';
    document.body.parentNode.style.cursor = 'wait';
    
    // link img source to the image_url key in the JSON object
    // check if the common name is available in the array
    if (url !== null) {
        img.src = url;

        // wait for 3s for img to load
        setTimeout(async () => {

            // if the img url doesn't load
            // check for a fallback solution if the main url from Trefle doesn't work
            if (!img.complete) {

                // replace the old img url with null, so that the code will find another one via Wikipedia
                await appendImages(img, plant_name, null, scientific_name, common_name, '', 0);
            }
        }, 3000);
        
    // otherwise, call a function to get wikipedia info
    } else {

        if (turns === 0)
            params = await getWikipedia(plant_name, turns);

        // check for the validity of img_url
        if (params !== undefined) {

            if (params.IMG_URL === '#') {

                if (params.turns === 1) {
                
                    params = await getWikipedia(scientific_name, params.turns);
                    await appendImages(img, plant_name, url, scientific_name, common_name, params, params.turns);

                } else if (params.turns === 2) {
                
                    params = await getWikipedia(common_name, params.turns);
                }
            }
            img.src = await params.IMG_URL;
            
        // otherwise, if the returned object from wikipedia API call is undefined
        } else img.src = '#';
    }

    loading.style.display = 'none';
    document.body.parentNode.style.cursor = 'context-menu';

    return img.src;
}

// DISPLAY NAMES
async function appendNames(common_name, synonyms, scientific_name) {

    let plant_name = '';

    // check if the common name is available in the array
    if (common_name !== null) {

        // turn each inital character of a string to uppercase
        plant_name = await reconstructStrings(common_name);
    // otherwise, 
    } else {

        // check for synonyms first
        if (synonyms.length > 0) {
            
            plant_name = await reconstructStrings(synonyms[0]);
            
        // otherwise, call a function to get wikipedia info
        } else {
            
            const params = await getWikipedia(scientific_name, 1);

            // if the object comes back from a wikipedia API call contains a title param
            if (params.title !== '')

                // progress to restructuring the string
                plant_name = await reconstructStrings(params.title);

            // otherwise, default back to the scientific name
            else plant_name = scientific_name;
        }
    }
    return plant_name;
}

//DISPLAY ALL THE PLANTS ON THE SCREEN
async function showPlants(plants, PAGE, on_page_num, isSearched) {
    
    let newPlants = [],
        newDivs = [],
        newImgs = [],
        newDiv_Imgs = [],
        newDiv_Plants = [],
        oldDivs = [];

    // to store names and images that are already MODIFIED
    let allPlantsNames = [],
        allPlantsImages = [];

    let plant_name = '',
        plant_img = '';

    // select all the old divs to fill in new ones when a user clicks to different pages
    oldDivs = document.querySelectorAll('div');
    
    // loop through the nodelist object array
    for (let n = 0; n < oldDivs.length; n++) {

        // check for a div of id windowProperties
        if (oldDivs[n].id === 'windowProperties') {

            // check if there are any childnodes in the div
            if (oldDivs[n].childNodes.length > 0)

                // remove them
                removeElements(oldDivs[n].childNodes);

            // otherwise, break out of the loop
            else break;
        }
    }
    
    // loop through the object array
    for (let i = 0; i < plants.data.length; i++) {

        // create new span elements
        newDivs[i] = document.createElement('div');
        newDivs[i].className = 'wrapper';

        // create new imgs
        newImgs[i] = document.createElement('img');

        // create each div that contains img
        newDiv_Imgs[i] = document.createElement('div');

        // create each div that contains a button
        newDiv_Plants[i] = document.createElement('div');

        // add names
        plant_name = await appendNames(plants.data[i].common_name, plants.data[i].synonyms, plants.data[i].scientific_name);
        allPlantsNames.push(plant_name);

        // create p elements
        newPlants[i] = document.createElement('p');
        newPlants[i].innerHTML = plant_name;
        newDiv_Plants[i].className = 'plant_names';

        // add images, with any name comes out from the plant_name variable
        plant_img = await appendImages(newImgs[i], plant_name, plants.data[i].image_url, plants.data[i].scientific_name, plants.data[i].common_name, '', 0);
        allPlantsImages.push(plant_img);

        newDiv_Imgs[i].className = 'plant_imgs';

        // append those div elements to a div element of id windowProperties
        windows.appendChild(newDivs[i]);

        // append both the div elements with imgs and p to each containing div element
        newDivs[i].appendChild(newDiv_Imgs[i]);
        newDivs[i].appendChild(newDiv_Plants[i]);

        // append all the p and images to the each div element
        newDiv_Imgs[i].appendChild(newImgs[i]);
        newDiv_Plants[i].appendChild(newPlants[i]);

        // listen for a click event on one of the containing divs
        newDivs[i].addEventListener('click', async function () {

            // get a plant detail
            await getPlantDetails(plants.data[i].id, PAGE, newImgs[i].src); 

            // scroll the detail page to the top again
            table_wrapper.scrollTop = 0;
        });
    }

    // create a section for gamification
    showGamificationButton(allPlantsNames, allPlantsImages);

    // list out 20321 pages
    listPages(plants.meta.total, on_page_num, isSearched);
}

// GET RECIPE FROM TREFLE
async function getPlants(PAGE, on_page_num) {
    
    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // get an endpoint to the server side to retrieve data
    // pass in a parameter
    const request = await fetch(`/page/${PAGE}`, options);
    const plants = await request.json();

    // show the plants
    showPlants(plants, PAGE, on_page_num, false);
}

// SEARCH PLANTS
async function searchPlants(PAGE, on_page_num) {

    // pass the searched keyword to a global variable, so that later on, the search field will be emptied out
    if (searched_title.value !== '') {

        searched_keyword = searched_title.value;
    
        // create an options instance
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // make a request to the server side
        const request = await fetch(`/search/${searched_keyword}/${PAGE}`, options);
        const results = await request.json();

        // reset the text field to an empty string after search results come back
        searched_title.value = '';

        // keep the search area focused after search
        searched_title.focus();

        // show the plants
        showPlants(results, PAGE, on_page_num, true);
    }
}

// LOAD NECESSARRY FUNCTIONALITIES OF THE WEB APP AS SOON AS IT OPENS
window.onload = function() {

    // getPlants(a, b)
    // a: real page number on the web app
    // b: index number from a for loop
    getPlants(1, 0);

    // close the pop-up detail
    // add a mouseup event listener on #plant_detail_wrapper (mouse release)
    plant_detail_wrapper.addEventListener('mouseup', function (event) {
            
        // check if a mouse click is not registered on #plant_detail and #game_entry
        if (!plant_detail.contains(event.target) && !game_entry.contains(event.target)) {
            
            // hide all the detail-related elements
            plant_detail_wrapper.style.display = 'none';
            plant_detail.style.display = 'none';
            game_entry.style.display = 'none';

            // reset the index variable used for navigation in recipe section
            navigatingIndex = 0;

            // look for a valid class name of chartjs, to see if it's appended to the DOM
            document.querySelector('.chartjs-size-monitor') !== null ? 

                // if there is, destroy the chart
                (chartData(null, null, 1), 
                
                // and get rid of the h4 tags and the nav buttons
                removeElements(document.getElementsByTagName('h4')),
                removeElements(document.querySelectorAll('.recipe_nav_buttons'))
                ) :
            
            // otherwise, if a chart is not displayed
            undefined;

        }
    });

    // global keyboard event listeners
    // passing parameter is to wait for other programatically created DOM elements to form
    escapeHit(false);
}


/////////////////////////////////
// GAME
////////////////////////////////

// class(es)
let weapons = [],
    bullets = [],
    insects = [],
    imgDOM = [];

// all paths to the images
const PATHS = ['./assets/static_files/pesticide.png',
                './assets/static_files/ant.png'];

// windows properties settings
let width = window.innerWidth,
    height = window.innerHeight;

// create a PIXI Application instance
const app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: 0x1A1702,
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
});

// game score
let score = 0;

// PIXI loader
let loader = PIXI.Loader.shared;
let gameOverScene = new PIXI.Container(),
    gameScene = new PIXI.Container();
    message = new PIXI.Text(score);

// game state
let state = null;

function createLines(x1, y1, x2, y2, colour, thickness) {

    let lines = new PIXI.Graphics();

    // style the circle
    lines.lineStyle(thickness, colour, 1);

    // start point
    lines.moveTo(x1, y1);

    // end point
    lines.lineTo(x2, y2);

    // add the rect to the stage
    gameScene.addChild(lines);
}

function duplicatesCheck(duplicates, urls) {

    const index = Math.floor(Math.random() * urls.length);

    if (duplicates.length === 0)
        return index;
    else {
        
        // run through an array to check duplicates
        for (let i = 0; i < duplicates.length; i++) {

            if (duplicates[i] !== index) {
                return index;
            } else return '';
        }
    }
}

function drawWeapons(names, urls) {

    // rows
    const rows = 4;

    // account for checking duplicated index values
    let duplicates = [];

    let i = 0;

    // a while loop is necessary because the loop iteration flow needs to be interrupted
    // if there is a duplicate found during the production of a random number
    while (i < rows) {

        // sizes
        const size = 40;

        // get evenly divided rows, divide that result by 2 to centre the item,
        // increment it by i every iteration 
        const x = (((width / rows) * i) + ((width / rows) * (i + 1))) / 2;

        // y-coordinate
        const y = height - (size * 5);

        // a random value and check for duplicates
        const randIndex = duplicatesCheck(duplicates, urls); 
        
        // if the returned value is a number
        if (typeof(randIndex) === 'number') {

            // create instances of the weapon object
            weapons[i] = new Weapons(x, y, size, size, names[randIndex], urls[randIndex], PATHS[0]);

            // show all the instances
            weapons[i].show();

            // create and show instances of images corresponding to the weapons
            imgDOM[i] = new Image();
            imgDOM[i].className = 'ingame_plant_image';

            weapons[i].showImg(imgDOM[i]);

            // create lines that separate different rows
            createLines(((width / rows) * i), height - 5, ((width / rows) * i), 0, 0xFFFF99, 4);

            // append the index to the duplicates collection
            duplicates.push(randIndex);

            // increment i
            i++;
        } else {
            console.log(typeof(randIndex));
        }
    }

    // initialise the score
    showScoreInGame(0);
}

function endGame() {

    gameScene.visible = false;
    gameOverScene.visible = true;
    
    // stop the loop
    // app.ticker.stop();
}

function createTriangle(xPos, yPos, btn_container, colour) {

    let triangle = new PIXI.Graphics();

    let triangleWidth = width / 50,
        triangleHeight = triangleWidth,
        triangleHalfway = triangleWidth/2;

    triangle.x = xPos - triangleWidth / 4;
    triangle.y = yPos;
    triangle.pivot.set(triangleHalfway, triangleHalfway)
    triangle.rotation = 1.56;

    // draw triangle 
    triangle.lineStyle(0, 0x0, 1);
    triangle.beginFill(colour, 1);
    triangle.moveTo(triangleWidth, 0);
    triangle.lineTo(triangleHalfway, triangleHeight); 
    triangle.lineTo(0, 0);
    triangle.lineTo(triangleHalfway, 0);
    triangle.endFill();

    // add the shape to the container
    btn_container.addChild(triangle);
}

function showEndGameDetail(fillState, fillState2, cnt) {

    ////////////////////////////
    // REMOVE DOM ELEMENTS
    ///////////////////////////

    // grab all the in-game images
    const IN_GAME_IMGS = document.querySelectorAll('.ingame_plant_image');
    const IN_GAME_INPUT = document.getElementById('ingame_input_field');

    // remove all of them
    if (IN_GAME_IMGS.length > 0 && IN_GAME_INPUT !== null) {
        removeElements(IN_GAME_IMGS);
        removeElements([IN_GAME_INPUT]);
    }

    //////////////////////////////
    // CREATE ELEMENTS
    /////////////////////////////

    // create a container
    let btn_container = new PIXI.Container();
    btn_container.interactive = true;

    // create a button to navigate out of the game canvas
    let back_btn = new PIXI.Graphics(),
        btn_noFill = new PIXI.Graphics();

    // clear 
    btn_noFill.clear();
    back_btn.clear();

    // a circle with no fills
    btn_noFill.lineStyle(2, 0x00FF00, 1);
    btn_noFill.beginFill(fillState);
    btn_noFill.drawCircle(width - width / 4, height / 2 + width / 25, width / 25);
    btn_noFill.endFill();

    // add it to the container
    btn_container.addChild(btn_noFill);

    // a circle with fills
    back_btn.lineStyle(2, 0x0, 1);
    back_btn.beginFill(0x90EE90);
    back_btn.drawCircle(width - width / 4, height / 2 + width / 25, width / 40);
    back_btn.endFill();

    // add it to the container
    btn_container.addChild(back_btn);

    // add a mouseover event listener to the container when on hovered
    btn_container.on('mouseover', () => {
        showEndGameDetail(0x488214, 0x397D02, 1);
    });

    // add a mouseout event listener to the container when not hovered
    btn_container.on('mouseout', () => {
        showEndGameDetail(0x1A1702, 0x696969, 1);
    });

    // add a pointer event listener to the container when a pointer registered on it
    btn_container.on('pointerdown', () => {

        // show the game start button
        document.getElementById('start_game_button').style.visibility = 'visible';
            
        // reset back to the css styling default
        game_entry.style.setProperty('transform', '', 'important');
        game_entry.style.setProperty('width', '', 'important');
        game_entry.style.setProperty('height', '', 'important');

        const game_canvas = document.getElementsByTagName('canvas');
        
        game_canvas[game_canvas.length - 1].style.setProperty('display', 'none', 'important');

        app.stage.removeChildren();
    });

    // create a triangle
    createTriangle(width - width / 4, height / 2 + width / 25, btn_container, fillState2);

    // add the container to the gameOverScene container
    gameOverScene.addChild(btn_container);

    if (cnt === 0) {

        // create a new PIXI garphics instance
        let style = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: width / 25,
            fill: 'white'
        });
        let message = new PIXI.Text('The End!' + '\n' + 'Your score is ' + score, style);
        message.x = width / 10;
        message.y = height / 2;
        gameOverScene.addChild(message);
    }
}

function showScoreInGame(cnt) {

    let container = new PIXI.Container();

    // only run through this code block once
    if (cnt === 0) {

        let rect = new PIXI.Graphics();

        // rect properties
        const x = width / 2,
            y = height / 2,
            w = width / 10,
            h = height / 10;
        rect.pivot.set(w / 2, h / 2);
        rect.lineStyle(0, 0xFF00FF, 1);
        rect.beginFill(0xFFFF33, 0.75);
        rect.drawRoundedRect(x, y, w, h, 15);
        rect.endFill();
        container.addChild(rect);
    }

    // create a new PIXI garphics instance
    let style = new PIXI.TextStyle({
        fontFamily: 'Montserrat',
        fontSize: width / 50,
        fill: 'black'
    });

    // style the message
    message.style = style;

    // reassign the text (increased score)
    message.text = score;

    // position the text
    message.anchor.set(.5);
    message.x = width / 2;
    message.y = height / 2;

    // add it to the container
    container.addChild(message);

    // add the container to the game scene
    gameScene.addChild(container);
}

function drawBullets() {

    // loop through the bullets array backwards
    for (let i = bullets.length - 1; i >= 0; i--) {

        // show the bullet
        bullets[i].load();

        // fire it, if it gets offscreen
        if (!bullets[i].fire()) {

            // clear the shape display
            bullets[i].shape.clear();

            // remove it from the array
            bullets.splice(i, 1);
        }
    }
}

function drawInsects() {

    const randNum = Math.random() * 1;
    const probability = 0.002;
    if (randNum < probability) {

        // choose random x coordinates to spawn the insects
        const index = Math.floor(Math.random() * weapons.length);

        const size = 40;

        const y = -size;

        // create instances of insects object and append them respectively to the array
        insects.push(new Insects(weapons[index].x, y, size, size, PATHS[1]));
    }

    // loop through the array
    for (let i = insects.length - 1; i >= 0; i--) {
        insects[i].show();
        insects[i].move();
        
        // loop through the bullets array
        for (let j = bullets.length - 1; j >= 0; j--) {
            
            // if an insect gets hit by a bullet
            if (insects[i].hitBy(bullets[j])) {

                // increment the score
                score++;

                // re-render the score text on the screen
                showScoreInGame(1);
                
                // clear the shape display
                bullets[j].shape.clear();

                // remove the sprite from the container
                insects[i].container.removeChild(insects[i].sprite);

                // remove elements out of the arrays
                bullets.splice(j, 1);
                insects.splice(i, 1);
            }
        }

        if (insects[i] !== undefined) {

            // loop through the weapons array backwards
            for (let w = weapons.length - 1; w >= 0; w--) {

                // if a weapon gets hit by an insect
                if (weapons[w].hitBy(insects[i])) {

                    showEndGameDetail(0x1A1702, 0x696969, 0);

                    // switch the game state to end the game
                    state = endGame;
                }
            }
        }
    }
}

function playGame(delta) {
    drawBullets();
    drawInsects();
}

function gameLoop(delta) {
    
    state(delta);
}

// INITIALISE THE CODE
function init(names, urls) {

    // check if WebGL is supported in a user's browser
    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
        type = "canvas"
    }

    PIXI.utils.sayHello(type);

    // set the game state to play
    state = playGame;

    // stylings
    // app.renderer.backgroundColor = 0x061639;
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';
    app.renderer.view.style.width = '100%';
    app.renderer.view.style.height = '100%';
    app.renderer.view.style.top = '0px';
    app.renderer.autoDensity = true;
    app.renderer.resize(width, height);

    // append the view to #game_entry
    game_entry.appendChild(app.view);
    
    // create a text input field
    const plant_name_input = document.createElement('input');
    plant_name_input.type = 'text';
    plant_name_input.placeholder = 'Type here!';
    plant_name_input.id = 'ingame_input_field';
    
    // style the input field
    plant_name_input.style.position = 'absolute';
    plant_name_input.style.transform = 'translateX(-50%)';
    plant_name_input.style.left = '50%';
    plant_name_input.style.bottom = '5px';
    plant_name_input.style.padding = '5px';

    // override the width property with !important rule from the scss file
    plant_name_input.style.setProperty('width', '20%', 'important');

    // append the input field to #game_entry
    game_entry.appendChild(plant_name_input);
    escapeHit(true);

    // focus on the text input field as soon as the game loop starts running
    document.getElementById('ingame_input_field').focus();

    // load all images exist in the current page using loader method from PIXI
    loader
        .add(PATHS)
        .load(() => {
            drawWeapons(names, urls);
        });

    // a game scene for playing the game and a game over scene for ending a gameplay added to the stage
    app.stage.addChild(gameOverScene);
    app.stage.addChild(gameScene);

    // first, set the game over scene to be invisible
    gameOverScene.visible = false;

    //Start the game loop by adding the `gameLoop` function to
    //Pixi's `ticker` and providing it with a `delta` argument.
    app.ticker.add(delta => gameLoop(delta));
}