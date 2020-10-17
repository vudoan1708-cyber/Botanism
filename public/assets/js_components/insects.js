class Insects {

    constructor(x, y, w, h, local_img, local_img2) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.local_img = local_img;
        this.vel = 1.0;
        this.container = new PIXI.Container();
        this.texture = loader.resources[this.local_img].texture;
        this.sprite = new PIXI.Sprite(this.texture);

        // boss
        this.w_s = w * 1.5;
        this.h_s = h * 1.5;
        this.local_img2 = local_img2;
        this.texture2 = loader.resources[this.local_img2].texture;
    }

    show() {
        
        // position the sprite
        this.sprite.position.set(this.x, this.y);
        this.sprite.width = this.w;
        this.sprite.height = this.h;

        // set pivot of the container to the center
        this.container.pivot.set(this.w / 2, this.h / 2);

        // add this sprite to the container
        this.container.addChild(this.sprite);

        // add the container to the stage
        gameScene.addChild(this.container);
    }

    showSpiders() {

        // remove this sprite from the container
        this.container.removeChild(this.sprite);

        // re-assign new texture to the sprite
        this.sprite = new PIXI.Sprite(this.texture2);

        // position the sprite
        this.sprite.position.set(this.x, this.y);
        this.sprite.width = this.w_s;
        this.sprite.height = this.h_s;

        // set pivot of the container to the center
        this.container.pivot.set(this.w_s / 2, this.h_s / 2);

        // add this sprite to the container
        this.container.addChild(this.sprite);

        // add the container to the stage
        gameScene.addChild(this.container);
    }

    move() {
        
        // move the container, no idea why moving this.y coordinate makes the sprite bleed
        this.container.y += this.vel;
    }

    hitBy(bullet) {
        if (bullet.y - bullet.r < this.container.y - this.h / 2) {
            if (bullet.x - bullet.r < this.x + this.w / 2 && bullet.x + bullet.r > this.x) {
                return true;
            } return false;
        }
    }
}