// game in a big grid of pixels and a lot of player
// player can trade money to each other to get a pixel, or player can take free pixel for a certain price
// however, at a certain interval, players will have a "take turn" where player can "legally steal" the adjacent pixel from other players
// depends on the interval, the player may only store 50 "take turn" before their interval stop
// each player can give themself color at the begining of the game
// player can only see pixels adjacent to their own pixels but can take/buy pixels far away from them
// when another player accept to sell the pixel, the surrounding pixel with be publicize and others can see (like checking the surrounding when buying house)
// when a pixel in the middle of a bid sell, it automatically lock to prevent people from stealing (reconsidering this rule tho)

class World {
    constructor(width, height) {
        this.width = width; this.height = height;
        // create map
        this.map = []
        for (let row = 0; row < height; row++) {
            this.map.push([]); // add new row
            for (let col = 0; col < width; col++)
            this.map.push( new Pixel(row, col) )
        }
    }
    /**
     * Get pixel from coordinate
     * @param {Number} x Coordinate
     * @param {Number} y Coordinate
     * @returns {Pixel} Pixel
     */
    getPixel(x, y) {
        return this.map[x][y];
    }
}

// NOTE methods in Player check requirement, in Pixel to officially transfer the action
// this to make it Player.takePixel( Pixel() ) readability
class Pixel {
    /**
     * Create a pixel
     * @param {Number} x Horizontal coordinate
     * @param {Number} y Vertical coordinate, remember fliped on screen and array
     * @param {Player} owner The owner of the pixel
     */
    constructor(x, y, owner) {
        this.owner = owner || undefined;
        this.onAuction = false;
        this.bids = [];
        this.x = x;
        this.y = y;
    }
    /**
     * Taking the pixel using take turn
     * @param {Player} owner The new owner of the pixel
     */
    takePixel(owner) {
        // remove old owner's ownership
        for (const l1 in this.owner.pixels) {
            let pixel = this.owner.pixels[l1];
            if (pixel == this) this.owner.pixels.splice(l1, 1)
        }
        this.owner = owner; // new owner
        owner.pixels.push(this);
        owner.takeTurn--;
    }
}

class Player {
    static maxTakeTurn = 50;
    static milisecondsPerTakeTurn = 1000 * 60;
    constructor(color) {
        this.color = color;
        this.pixels = [];
        this.money = 1000; // default might change
        this.takeTurn = 0; // how many take turn the owner have
        this.bids = []
    }
    get moneyBid() {
        // get all of the money bided
        let total = 0;
        for (const bid of this.bids) 
            total += bid.money;
        return total
    }
    getMap() {
        // return what is visible to the player (hard one)
    }
    /**
     * Check requirement of take turn to take the pixel
     * @param {Pixel} pixel The pixel the player is taking
     * @returns {String|undefined} Return string of error, or undefined if pass
     */
    takePixel(pixel) {
        if (this.takeTurn <= 0) return "You don't have take turn";
        else if (pixel.onAuction) return 'The pixel is on auction';
        else if (pixel.owner = this) return 'You owned this pixel';
        pixel.takePixel(this); // execute
    }
    /**
     * Check requirement to bid on a pixel
     * @param {Pixel} pixel Pixel to bid on
     * @param {Number} money The money bid on this
     * @returns {String|undefined} Return string of error, or undefined if pass
     */
    bidPixel(pixel, money) {
        if (this.moneyBid + money <= this.money) return "You don't have enough money";
        else if (pixel.owner == this) return 'You owned this pixel';
    }
    boughtPixel(pixel) {

    }
    sellPixel(pixel) {

    }
    soldPixel(pixel) {

    }
}

let mainGame = new World(100, 100);

// server
const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('website'))

app.get('/pixel/:x/:y', (req, res) => {
    let {x, y} = req.params;
    res.send(mainGame.getPixel(x, y).owner.money.toString())
});

app.post('/takePixel', (req, res) => {

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});