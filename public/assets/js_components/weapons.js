class Weapons {

    constructor(x, y, w, h, plant_name, img, local_img) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h * 1.5;
        this.plant_name = plant_name.toLowerCase().replace(/^\s+|\s+$/g, '');
        this.img = img;
        this.local_img = local_img;

        // pixi properties
        this.message = new PIXI.Text(this.plant_name);
        this.container = new PIXI.Container();
        this.texture = loader.resources[this.local_img].texture;
        this.sprite = new PIXI.Sprite(this.texture);
    }

    show() {
        
        // position the sprite
        this.sprite.position.set(this.x, this.y);
        this.sprite.width = this.w;
        this.sprite.height = this.h;

        // rectMode CENTER equivalent of p5.js
        // however, this has to be after the styling for some unknown reasons
        this.sprite.anchor.x = .5;
        this.sprite.anchor.y = .5;

        // add the sprite to the container
        this.container.addChild(this.sprite)

        // add the container to the game scene container
        gameScene.addChild(this.container);
    }

    showPlantName(hovered) {

        // text style
        let style = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            align: 'center',
            fontSize: width / 42,
            fill: 'white',
            stroke: '#ff3300',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });

        this.message.style = style;

        this.message.position.set(this.x, this.y + this.h / 2);
        this.message.anchor.set(.5);

        if (hovered) {
            gameScene.addChild(this.message);
        } else gameScene.removeChild(this.message);
    }

    showImg(imgDOM) {

        // instantiate x and y coordinates of the message
        let img_w, img_h = 0;

        // mobile detection
        if (!isMobile()) {
            img_w = this.w * 2.5;
            img_h = (this.h * 2.5) / 1.5;

        } else {
            img_w = this.w;
            img_h = this.h;
        }
        
        // add img using DOM element
        // CSS styling and PIXI have the same measuring unit (px)
        imgDOM.src = this.img;

        // style the image positions
        imgDOM.style.left = this.x + 'px';
        imgDOM.style.top = this.y + (this.h * 2.5) / 1.5  + 'px';

        // the image sizes need to be 2.5 times bigger than the weapon itself
        imgDOM.style.width = img_w + 'px';
        imgDOM.style.height = img_h + 'px';
        game_entry.appendChild(imgDOM);
        
        // add a global mouseover event listener to the imgs
        imgDOM.addEventListener('mouseover', () => {
            
            // show the name of a plant
            this.showPlantName(true);
        });

        // add a global mouseout event listener to the imgs
        imgDOM.addEventListener('mouseout', () => {
            
            // hide the name of a plant
            this.showPlantName(false);
        });

        // for mobile
        if (isMobile()) {

            // add a global mouseout event listener to the imgs
            imgDOM.addEventListener('touchstart', () => {

                // show the name of a plant
                this.showPlantName(true);

                // fill in the text field automatically
                ingame_input_field.value = this.plant_name;
                
                if (this.compare(this.plant_name)) {
                    
                    loadBullet();

                    // reset the text field back to an empty string
                    ingame_input_field.value = '';
                }
            });
        }
    }

    compare(input) {
        
        if (input === this.plant_name) {
            return true;
        } else return false;
    }

    hitBy(insect) {
        if (insect.container.y - insect.h / 2 > this.y - this.h / 2) {
            if (insect.x + insect.w / 2 > this.x && insect.x - insect.w / 2 < this.x + this.w / 2) {
                return true;
            } return false;
        }
    }
}