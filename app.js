const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");

const _ = require('lodash');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public')); 

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const Item = require(__dirname + '/Item.js');

const List = Item.list;

const defaultItems = [
    {
        name: "Welcome to your todolist!"
    },
    {
        name: "Hit the + button to add a new item"
    },
    {
        name: "<-- Hit this to delete an item"
    }
];

async function getItems(){
    let items;

    try{
        items = await Item.find();
    }
    catch(err){
        console.log(err.message);
    }

    return items;
}

async function run(){
    try{

        // await Item.insertMany(defaultItems);

    
    }
    catch(err){
        console.log(err.message);
    }
}


app.set("view engine", "ejs");
    
app.get("/", async (req, res) => {
    const today = date.getDate();

    const items = await getItems();

    if(items.length === 0){
        try{
            await Item.insertMany(defaultItems);
        }
        catch(err){
            console.log(err.message);
        }

        res.redirect('/');
    }
    else
    {
        res.render("list", {
            listTitle: today,
            items: items
        });
    }

    
});

app.get("/:customList", async (req, res) => {

    try
    {
        const custom = _.capitalize(req.params.customList);

        const findCustomList = await List.findOne({name: custom});

        const today = date.getDate();
    
        if(findCustomList != null) {
            res.render("list", {
                listTitle   : custom,
                items: findCustomList.items
            })
        }
        else{
            await List.create({
                name: custom,
                items: defaultItems
            }).then(() => {
                res.redirect('/' + custom);
            });
        }
    }
    catch(err){
        console.log(err.message);
    }
})

app.post("/", async (req, res) => {

    const itemName = req.body.newItem;

    const listName = req.body.list;

    if(listName === date.getDate()){
        await Item.create({name: itemName});

        res.redirect('/');
    }
    else{
        try{
            const findList = await List.findOne({name: listName});

            findList.items.push({name: itemName});

            await findList.save().then(res.redirect("/" + listName));
        }
        catch(err){
            console.log(err.message);
        }
    }

    
    
    
});

app.post('/delete', async (req, res) => {
    

    try {

        const itemId = req.body.checkbox;

        const listName = req.body.listName;

        if(listName === date.getDate()) {
            await Item.deleteOne({_id: itemId});
            res.redirect('/');
        }
        else{
            await List.updateOne({name: listName}, {
                $pull:{
                    items: {_id: itemId}
                }
            });
            
            res.redirect('/' + listName);
        }

        
    }
    catch (err) {
        console.log(err.message);
    }

    
});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});