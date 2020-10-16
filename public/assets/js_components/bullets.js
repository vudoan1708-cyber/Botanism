class Bullets {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vel = 15;
        this.shape = new PIXI.Graphics();
    }

    load() {

        // clear all the previous drawing
        this.shape.clear();

        // style the circle
        this.shape.lineStyle(4, 0xFF3300, 1);
        this.shape.beginFill(0xFF0000);
        this.shape.drawCircle(this.x, this.y, this.r);
        this.shape.endFill();

        // add the rect to the stage
        gameScene.addChild(this.shape);
    }

    fire() {

        if (this.y >= -this.r) {
            this.y -= this.vel;
            this.vel += 0.1;
            return true;
        } else {
            return false;
        }
    }
}