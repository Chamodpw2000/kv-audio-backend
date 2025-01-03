import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import mongoose, { Mongoose } from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRoute from './routes/productsRoute.js';
const app = express();


import jwt from "jsonwebtoken";

const mongoUrl = "mongodb+srv://admin:123@cluster0.hpnby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(bodyParser.json());


app.use((req, res, next) => {

    let token = req.header("Authorization");



    //created the auth 

    if (token != null) {
        token = token.replace("Bearer ", "");
        jwt.verify(token, "kv-secret-89!", (err, decoded) => {

            if (!err) {
                req.user = decoded;
                console.log(decoded);

            }
        });
    }
    next()
});

mongoose.connect(mongoUrl)
const connection = mongoose.connection

connection.once("open", () => {
    console.log("MongoDB Connection Established Successfully");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use("/api/users", userRouter);
app.use("/api/products", productRoute);





app.get('/', (req, res) => {



    // Student.find().then((result)=> {res.status(200).json(result)}







    // ).catch(()=>{
    //     res.status(400).json({
    //         message:"error occured"
    //     })
    // })



});




app.post('/', (req, res) => {



    // let newStudent = req.body

    // let student = new Student(newStudent)




    // student.save().then(()=>

    //     {

    //     res.json({
    //         "message":"Student "+ req.body.name + " Saved Successfully " 
    //     })

    // }

    // ).catch(()=>{


    //     res.json({"message" : "Error Saving Data"})



    // }

    // )






    //     console.log("This is a post request")

    //     console.log(req.body); 

    // res.json({"text":req.body.Name + " is " + req.body.Age + " years old"})



});




app.delete('/', (req, res) => {
    console.log("This is a delete request");


})


app.put('/', (req, res) => {
    console.log("This is a put request");
})





