import express from "express"
import ejs from "ejs"
import bodyParser from "body-parser"

const app = express();
const port = 3000;
var today_task_list = [];
var work_task_list = [];

var options = { weekday: 'long', month: 'long', day: 'numeric' };
var today  = new Date();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/today", (req, res)=>{
    res.render("index.ejs", {
        day : today.toLocaleDateString("en-US", options), 
        type: "/today",
        task_list : today_task_list,
    });

})
app.post('/today', (req, res) => {

    today_task_list.push(req.body.taskname)
    res.render("index.ejs", {
        task : req.body.taskname,
        task_list : today_task_list,
        day: today.toLocaleDateString("en-US", options),
        type: "/today",
    });

})

app.get("/work", (req, res) => {
    res.render("index.ejs", {day : "Work List",type: "/work",task_list : work_task_list});
})
app.post("/work", (req, res) => {

    work_task_list.push(req.body.taskname)
    res.render("index.ejs", {
        task : req.body.taskname,
        task_list : work_task_list,
        day: "Work List",
        type: "/work",
    });})

    

app.listen(port, () => {
    console.log("Server is Live.");
})