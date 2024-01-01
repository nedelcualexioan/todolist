const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public')); 

app.set("view engine", "ejs");

let items = ["Buy food", "Cook food", "Eat food"];

app.get("/", (req, res) => {
    const today = date.getDate();

    res.render("list", {
        today: today,
        items: items
    });
})

app.post("/", (req, res) => {

    if(req.body.reset === "pressed"){
        items = [];
    }
    else{
        let item = req.body.newItem;

        items.push(item);
    }

    res.redirect("/");
    
})

app.listen(3000, () => {
    console.log("Server running on port 3000.");
})