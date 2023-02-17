// game scripts
let {World, Player, Pixel} = require('./game.js')
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