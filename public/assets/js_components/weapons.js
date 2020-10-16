class Weapons {

    constructor(x, y, w, h, plant_name, img, local_img) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h * 1.5;
        this.plant_name = plant_name.toLowerCase().replace(/^\s+|\s+$/g, '');
        this.img = img;
        this.local_img = local_img;
        this.message = new PIXI.Text(this.plant_name);
    }

    show() {

        let texture = loader.resources[this.local_img].texture;
        let sprite = new PIXI.Sprite(texture);
        
        // position the sprite
        sprite.position.set(this.x, this.y);
        sprite.width = this.w;
        sprite.height = this.h;

        // rectMode CENTER equivalent of p5.js
        // however, this has to be after the styling for some unknown reasons
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;

        // add the rect to the stage
        gameScene.addChild(sprite);
    }

    showPlantName(hovered) {

        // text style
        let style = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            align: 'center',
            fontSize: width / 50,
            fill: 'white',
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });

        this.message.style = style;

        this.message.position.set(this.x, this.y + this.h / 2);
        this.message.anchor.set(0.5);

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
        
        // add a global pointerover event listener to the imgs
        imgDOM.addEventListener('pointerover', () => {
            
            // show the name of a plant
            this.showPlantName(true);
        })

        // add a global pointerout event listener to the imgs
        imgDOM.addEventListener('pointerout', () => {
            
            // hide the name of a plant
            this.showPlantName(false);
        })
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