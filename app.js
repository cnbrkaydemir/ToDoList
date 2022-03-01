//jshint esversion:6

const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/todolistDb');


const listSchema={
  name:String
};

 const Item= new mongoose.model("Item",listSchema);

 const item1= new Item({name:"Welcome to your todolist"});
 const item2= new Item({name:"Hit the + button to add a new item"});
const item3= new Item({name:"<-- Hit this to delete an item"})

const defaultItem=[item1,item2,item3];


app.get("/", function(req, res) {
Item.find({},function(err,foundItem){
  if(foundItem.length===0){
    Item.insertMany(defaultItem,function(err){
      if(err){
        console.log(err)
      }else{
        console.log("Success");
      }
    })
    res.redirect("/")

    
  }else{
    res.render("list", {listTitle: "Today", newListItems: foundItem});  
  }
    
  
})

  

});

app.post("/", function(req, res){

  const item = req.body.newItem;
const newItem= new Item({
  name:item
});

newItem.save();
res.redirect("/");
  
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/delete",function(req,res){
  const delItem=req.body.checkbox;
  Item.findByIdAndRemove(delItem,function(err){
    if(!err){
      console.log("Delete Successfull");
      res.redirect("/");
    }
  })
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
