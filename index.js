const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const asyncWrapper = require('./utils/asyncWrapper');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/todoDb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(() => {
    console.log("Mongo connection open");
})
.catch(err => {
    console.log("Mongo connection Error!!!",err);
})
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.get("/", (req,res) => {
      res.render("app");
})
app.get("/todo", asyncWrapper(async(req,res) => {
    const todoList = await Todo.find({});
      res.render("todo/home", { todoList });
}))
app.get("/todo/new", (req,res) => {
      res.render("todo/new");
})
app.post("/todo/new", asyncWrapper(async(req,res) => {
     const { newTodo } = req.body;
     console.log(newTodo);
     const newToDo = new Todo({todo :  newTodo});
     await newToDo.save();
     res.redirect("/todo");
}))
app.get("/todo/:id", asyncWrapper(async (req,res) => {
    const { id } = req.params;
    const foundTodo = await Todo.findById(id);
    res.render("todo/show",{ todo : foundTodo} );
}))
app.get("/todo/:id/edit", asyncWrapper(async (req,res) => {
    const { id } = req.params;
    const foundTodo = await Todo.findById(id);
    res.render("todo/edit",{ todo : foundTodo} );
}))
app.patch("/todo/:id", asyncWrapper(async (req,res) => {
    const { id } = req.params;
    const { newTodo } =  req.body;
    const foundTodo = await Todo.findByIdAndUpdate(id, {todo : newTodo});
    res.redirect("/todo");
}))

app.delete("/todo/:id", asyncWrapper(async (req,res) => {
    const {id} = req.params;
    await Todo.findByIdAndDelete(id);
    res.redirect("/todo");
}))

app.use((err,req,res,next) => {
   const {message="Something went wrong", status= 500} = err;
   res.status(status).send(message);
})

app.listen(3000,() => {
    console.log("server up!!!!!")
})