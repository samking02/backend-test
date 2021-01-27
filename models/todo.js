const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    todo: {
        type : "string",
        required : [true, "To Do item cannot be empty"] 
    }
})
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;