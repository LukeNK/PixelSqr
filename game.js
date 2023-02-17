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
        /** @type {Array.Pixel[]} */
        this.map = []
        for (let row = 0; row < height; row++) {
            this.map.push([]); // add new row
            for (let col = 0; col < width; col++)
                this.map.push( new Pixel(row, col) ) // remember x,y is flipped because of array and screen
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
class Player {
    static maxTakeTurn = 50;
    static milisecondsPerTakeTurn = 1000 * 60;
    /**
     * Create player identity
     * @param {World} world The world the player in
     * @param {String} color Hex of the color
     */
    constructor(world, color) {
        /** @type {World} */
        this.world = world;
        this.color = color;
        /** @type {Pixel[]} */
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
    /**
     * 
     */
    get borderingPixels() {
        let bPixels = []
        for (const pixel of this.pixels) {
            let adj = pixel.adjacentPixels();
            if (adj.length != 0)
                bPixels.push(...adj)
        }
        return bPixels
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
        else if (money <= 0) return 'You are giving to the seller or what?'
        pixel.bidPixel(this, money); // execute 
    }
    boughtPixel(pixel) {

    }
    sellPixel(pixel) {

    }
    soldPixel(pixel) {

    }
}

class Pixel {
    /**
     * Create a pixel
     * @param {Number} x Horizontal coordinate
     * @param {Number} y Vertical coordinate, remember fliped on screen and array
     * @param {Player} owner The owner of the pixel
     */
    constructor(x, y, owner) {
        this.x = x;
        this.y = y;
        this.owner = owner || undefined;
        this.onAuction = false;
        this.bids = [];
    }
    /**
     * Get adjacent pixels 
     * @param {boolean} sameOwner if also includes pixels that have the same owner
     * @returns {Pixel[]} List of pixels
     */
    adjacentPixels(sameOwner) {
        let pixels = [];
        for (let x = this.x - 1; x <= this.x + 1; x++) {
            for (let y = this.y - 1; y <= this.y + 1; y++) {
                // check if is the current pixel
                if (x == this.x && y == this.y) continue;
                let curPixel = this.owner.world.getPixel(x, y);
                // check owner
                if (!sameOwner && curPixel.owner == this.owner) continue;
                pixels.push(curPixel);
            }
        }
        return pixels
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
    /**
     * Bid on a pixel
     * @param {Player} bidder The bidder
     * @param {Number} money The money being bid on
     */
    bidPixel(bidder, money) {
        let bid = {
            bidder: bidder,
            money: money
        }
        bidder.bids.push(bid);
        this.bids.push(bid);
    }
}

// check if it is in node
var isNode = () => {
    try { return this === global }
    catch(e) { return false }
}
module.exports = {World, Player, Pixel}