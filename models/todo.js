const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    todo: {
        type : "string",
        required : [true, "To-do cannot be empty"] 
    }
})
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;