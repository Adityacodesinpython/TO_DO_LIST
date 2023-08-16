import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser"
import mongoose, { mongo } from "mongoose"
import _ from "lodash"

const app = express();  
const PORT =  3000;

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});     // make or open fruitsDB database

const itemsSchema = new mongoose.Schema({
    name:String
});

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name:"Welcome to your To Do list!"
});
const item2 = new Item({
    name:"Write your task name below"
});
const item3 = new Item({
    name:"And hit the + button to get started"
});

const defaultItems = [item1, item2, item3];


const listSchema = new mongoose.Schema({
    name:String,
    items:[itemsSchema]
})
const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.post("/", (req,res)=>{
    const newItem = req.body.newItem;
    const listName = req.body.list;
    console.log(newItem)
    const item = new Item({
        name: newItem
    });

    if (listName == "Today") {
        item.save();
        res.redirect("/today");
    }else{
        List.findOne({name:listName})
        .then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    
})

app.get("/today", (req, res)=>{
    console.log(req.body.newItem)
    Item.find({})
        .then((foundItems) => {
            // if (foundItems.length == 0){
                // Item.insertMany(defaultItems)
                //     .then(() => {
                //         console.log("Successfully added all the default items")
                //     })
                //     .catch((err) => {
                //         console.log(err);
                //     })
                
                // res.redirect("/today");
                
            // } 
            // else {
                res.render("index.ejs", {
                    day:"Today", 
                    task_list : foundItems,
                });
            // }

            
        })
        .catch((err) => {
            console.log(err);
        });
})

// app.post('/today', (req, res) => {
    
//     const new_task = req.body.taskname;
    
//     const new_item = new Item({
//         name: new_task
//     });

//     new_item.save();    
//     res.redirect("/today");

// })
/*
app.get("/work", (req, res) => {
    res.render("index.ejs", {
        day : "Work List",
        type: "/work",
        task_list : work_task_list
    });
})

app.post("/work", (req, res) => {

    work_task_list.push(req.body.taskname)
    res.redirect("/work");
});
*/
app.post("/delete", (req, res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today"){
        Item.findByIdAndRemove(checkedItemId)
        .then(()=>{
            console.log("Deletion Successful.");
            res.redirect("/today");
        })
        .catch((err) => {
            console.log(err);
        });
    }else{
        List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItemId}}})
        .then(()=>{
            res.redirect("/"+listName);
        })
    }

    
})

app.get("/:customListName", (req, res)=>{
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName})
        .then((foundList)=>{
            if (!foundList){
                // Create new list

                const list = new List({
                    name:customListName,
                    items:defaultItems
                });
            
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                // Show existing list

                res.render("index.ejs", {
                    day : foundList.name,
                    task_list : foundList.items
                })
            }
        })

    
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
