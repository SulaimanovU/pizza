// EXTERNAL IMPORTED MODULES
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import * as fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// INTERNAL IMPORTED MODULES
import config from './configs/config.js';
import { upload } from './middleware/storage.js';
import auth from './middleware/auth.js';


// SERVER SETUP
let app = express();
app.use(bodyParser.json())
app.use(cors())
app.use('/public', express.static(__dirname + "/public"));


// TEST AND LOGIN
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/admin', (req, res, next) => {
    if (req.body.login === config.ADMIN && req.body.password === config.PASS) {
        let token = jwt.sign({ login: 'admin' }, 'secretkey')
        res.json({token: token})
    }
    else {
        res.json({msg: 'incorrect credentials'})
    }
})


// PIZZA CRUD
app.post('/add/pizza', auth, upload.single('image'), async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let info = req.body.info;
    let file = req.file.filename;

    if(!(name && price && info && file)) {
        res.json({msg: 'all parameter required'})
        return 0
    }

    let pizzaJson = await fs.readFile('./public/pizza.json');
    let pizzaObject = JSON.parse(pizzaJson.toString());

    pizzaObject.data.push({
        id: Date.now(),
        name,
        price,
        info,
        file,
    })
    await fs.writeFile('./public/pizza.json', JSON.stringify(pizzaObject))
    res.json({msg: 'ok'})
})

app.get('/getall/pizza', async (req, res) => {
    let pizzaJson = await fs.readFile('./public/pizza.json');
    let pizzaObject = JSON.parse(pizzaJson.toString());

    res.json({data: pizzaObject})
})

app.post('/delete/pizza/:id', auth, async (req, res) => {
    let id = req.params.id;

    let pizzaJson = await fs.readFile('./public/pizza.json');
    let pizzaObject = JSON.parse(pizzaJson.toString());
    let newPizzaObject = {
        data: []
    }

    pizzaObject.data.forEach(item => {

        if(String(item.id) !== String(id)) {
            newPizzaObject.data.push(item)
        }
        else {
            fs.unlink(`./public/${item.file}`)
        }
        
    });

    await fs.writeFile('./public/pizza.json', JSON.stringify(newPizzaObject))

    res.json({msg: "item deleted"})
})


// DRINK CRUD
app.post('/add/drink', auth, upload.single('image'), async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let info = req.body.info;
    let file = req.file.filename;

    if(!(name && price && info && file)) {
        res.json({msg: 'all parameter required'})
        return 0
    }

    let drinkJson = await fs.readFile('./public/drink.json');
    let drinkObject = JSON.parse(drinkJson.toString());

    drinkObject.data.push({
        id: Date.now(),
        name,
        price,
        info,
        file,
    })
    await fs.writeFile('./public/drink.json', JSON.stringify(drinkObject))
    res.json({msg: 'ok'})
})

app.get('/getall/drink', async (req, res) => {
    let drinkJson = await fs.readFile('./public/drink.json');
    let drinkObject = JSON.parse(drinkJson.toString());

    res.json({data: drinkObject})
})

app.post('/delete/drink/:id', auth, async (req, res) => {
    let id = req.params.id;

    let drinkJson = await fs.readFile('./public/drink.json');
    let drinkObject = JSON.parse(drinkJson.toString());
    let newDrinkObject = {
        data: []
    }

    drinkObject.data.forEach(item => {
        
        if(String(item.id) !== String(id)) {
            newDrinkObject.data.push(item)
        }
        else {
            fs.unlink(`./public/${item.file}`)
        }
    });

    await fs.writeFile('./public/drink.json', JSON.stringify(newDrinkObject))

    res.json({msg: "item deleted"})
})




// SERVER START
app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening at http://localhost:${process.env.PORT || 3000}`)
})