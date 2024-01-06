const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema(
    {
        name: String,
        items: [itemSchema]
    }
)

module.exports = mongoose.model('Item', itemSchema);

module.exports.list = mongoose.model('List', listSchema);