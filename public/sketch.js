const windows = document.getElementById('windowProperties'),
      plant_detail = document.getElementById('plant_detail'),
      plant_detail_wrapper = document.getElementById('plant_detail_wrapper'),
      pages = document.getElementById('pages'),
      table_wrapper = document.getElementById('table_wrapper'),
      table_body = document.getElementById('table_body'),
      loading = document.getElementById('loading'),
      recipe_wrapper = document.getElementById('recipe_wrapper'),
      nutrientsChart = document.getElementById('nutrientsChart');

let myChart = null;
let navigatingIndex = 0;

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
    for (let i = 0; i < 2; i++) {
        
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
                    chartData(null, null, null, 1);
                    showRecipe(recipe);
                }
                else {
                    navigatingIndex = 0;
                    recipe_wrapper.scrollTop = 0;
                    chartData(null, null, null, 1);
                    showRecipe(recipe);
                }
            })) :

        (buttons[i].innerHTML = '>', 
        buttons[i].addEventListener('click', () => {
            
            const max = recipe.hits.length;

            if (navigatingIndex < max) {
                navigatingIndex++;
                recipe_wrapper.scrollTop = 0;
                chartData(null, null, null, 1);
                showRecipe(recipe);
            }
        }));
    }
}

function chartData(total_vals, Xlabels, daily_vals, num_case) {

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

    let nutrients_labels = [],
        nutrients_values = [],
        nutrients_daily = [],
        recipe_calories = [],
        recipe_img_url = [],
        recipe_label = [];

    
    // check for a valid length of the array
    if (recipe.hits.length > 0) {
        console.log(recipe);

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
        chartData(nutrients_values, nutrients_labels, nutrients_daily, 2);
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

    // close the pop-up detail
    // add a click event listener on #plant_detail_wrapper
    plant_detail_wrapper.addEventListener('click', function (event) {

        // check if a mouse click is not registered on #plant_detail
        if (!plant_detail.contains(event.target)) {
            
            // hide all the detail-related elements
            plant_detail.style.display = 'none';
            plant_detail_wrapper.style.display = 'none';

            // reset the index variable used for navigation in recipe section
            navigatingIndex = 0;

            // look for a valid class name of chartjs, to see if it's appended to the DOM
            document.querySelector('.chartjs-size-monitor') !== null ? 

                // if there is, destroy the chart
                (chartData(null, null, null, 1), 
                
                // and get rid of the h4 tags and the nav buttons
                removeElements(document.getElementsByTagName('h4')),
                removeElements(document.querySelectorAll('.recipe_nav_buttons'))
                ) :
            
            // otherwise, if a chart is not displayed
            undefined;
        }
    });
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
    console.log(details);

    showPlantDetails(details, img_url);
}

//LIST ALL THE PAGES
function listPages(total_plants, on_page_num) {

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

                // re-start the workflow, with a selected page index passed in 
                // to get started from there instead of going back from scratch 
                await getPlants(i + 1, i);            
                
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
                    // console.log('Scientific ' + params.turns);
                    // console.log('Scientific ' + params.IMG_URL);

                } else if (params.turns === 2) {
                
                    params = await getWikipedia(common_name, params.turns);
                    // console.log('Common ' + params.turns);
                    // console.log('Common ' + params.IMG_URL);
                }
            }
            img.src = await params.IMG_URL;
            
        // otherwise, if the returned object from wikipedia API call is undefined
        } else img.src = '#';
    }

    loading.style.display = 'none';
    document.body.parentNode.style.cursor = 'context-menu';
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
async function showPlants(plants, PAGE, on_page_num) {
    
    let newPlants = [],
        newDivs = [],
        newImgs = [],
        newDiv_Imgs = [],
        newDiv_Plants = [],
        oldDivs = [];

    let plant_name = '';

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
        
        // create p elements
        newPlants[i] = document.createElement('p');
        newPlants[i].innerHTML = plant_name;
        newDiv_Plants[i].className = 'plant_names';

        // add images, with any name comes out from the plant_name variable
        await appendImages(newImgs[i], plant_name, plants.data[i].image_url, plants.data[i].scientific_name, plants.data[i].common_name, '', 0);

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

    // list out 20321 pages
    listPages(plants.meta.total, on_page_num);
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
    console.log(plants);

    // show the plants
    showPlants(plants, PAGE, on_page_num);
}

// SEARCH PLANTS
async function searchPlants(PAGE, on_page_num) {
    
    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const request = await fetch(`/search/${searched_title.value}/${PAGE}`, options);
    const results = await request.json();
    console.log(results);

    // show the plants
    showPlants(results, PAGE, on_page_num);
}

// getPlants(a, b)
// a: real page number on the web app
// b: index number from a for loop
getPlants(1, 0);