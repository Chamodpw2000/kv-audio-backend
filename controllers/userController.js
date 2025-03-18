import User from "../models/users.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
const transport = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"chamodpwanigasekara2000@gmail.com",
        pass:"hxrpuqcqwzregkcj"
    }
})

dotenv.config();


export function AddUser(req, res) {
    console.log("Add User");
    

    console.log(req);
    



    const data = req.body;

    data.password = bcrypt.hashSync(data.password, 10)

    const newUser = new User(data);

    newUser.save().then(() => {
        res.status(200).json({
            "message": "User Saved Successfully"
        })
    }).catch((error) => {
        res.status(500).json({ error: "User Registration Failed" })
    })

}


export function userLogin(req, res) {
    const data = req.body;



    User.findOne({ email: data.email }).then(
        (user) => {
            if (user == null) {
                res.status(400).json({ message: "User Not  found" })
            } else {


                if(user.isBlocked){
                    res.status(400).json({error:"Your account is Blocked please Contact the admin"});
                    return;
                }
                const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        profilePicture: user.profilePicture,
                        phone:user.phone,
                        address:user.address,
                        emailVerified:user.emailVerified
                    }, process.env.JWT_SECRET)
                    res.status(200).json({ message: "Login Successful", token: token , user:user});

                } else {
                    res.status(400).json({ error: "Login Faild" })
                }
            }
        }
    )
}


export function isItAdmin(req) {
    let isAdmin = false;
    if (req.user != null) {
        if (req.user.role == "admin") { isAdmin = true };
    }
    return isAdmin;
}

export function isItCustomer(req) {
    let isCustomer = false;
    if (req.user != null) {
        if (req.user.role == "customer") { isCustomer = true };
    }

    return isCustomer;
}


export async function getAllUsers(req, res) {
if(isItAdmin(req)){

    try{
        const users = await User.find();
        res.status(200).json(users);

    }catch{
            res.status(500).json({error:"Failed to get users"});
    }

}else{
    res.status(403).json({error:"You are not authorized to view this page"});       
    
}}

export async function handleBlockUser(req,res){

    const email = req.params.email;

    if(isItAdmin(req)){
        try{

            const user = await User.findOne({email:email});
            if(user == null){
                res.status(404).json({error:"User not found"});
                return;}

            const isBlocked = !user.isBlocked;
            await User.updateOne({email:email},{isBlocked:isBlocked});
            res.status(200).json({message:"User Blocked/Unblocked Successfully"});


        }catch(e){
            res.status(500).json({error:"Failed to block user"});
        }
    }else{
        res.status(403).json({error:"You are not authorized to do this operation"});       
    }
}


export async function getUserProfile(req,res){
    if(req.user==null){
        return res.status(403).json({message:"Please Log in to continue"});

    }
    else{
        return res.status(200).json(req.user);
    }
}

export async function loginWithGoogle(req,res){

    console.log("Token",req.body.accesToken);
    

const accesToken = req.body.accesToken;
// console.log(accesToken);
try {
    const responce = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`,{
        headers:{
            Authorization: `Bearer ${accesToken}`
        },
    });

    console.log(responce.data);

    const user = await User.findOne({email:responce.data.email});
    if(user != null ){
        const token = jwt.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phone:user.phone,
            address:user.address,
            emailVerified:user.emailVerified
        }, process.env.JWT_SECRET)
        res.status(200).json({ message: "Login Successful", token: token , user:user});

    }else{
        const newUser = new User({
            firstName:responce.data.given_name,
            lastName:responce.data.family_name,
            email:responce.data.email,
            profilePicture:responce.data.picture,
            isBlocked:false,
            password:"123",
            address:"Not Given",
            phone:"Not Given",
            emailVerified:true
        });

        await newUser.save();
        const token = jwt.sign({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
            phone:newUser.phone,
            role: newUser.role,
            address:newUser.address,
            emailVerified:newUser.emailVerified

        }, process.env.JWT_SECRET)
        res.status(200).json({ message: "Login Successful", token: token , user: newUser});
    }
    

    
} catch (error) {
    console.log(error.message);
    
}


}


export async function sendOTP(req,res){


   

    if(req.user == null){
        return res.status(403).json({message:"Unoauthorized"});
    }


     //genarate a number between 1000 and 9999
     const otp = Math.floor(Math.random() * 9000) + 1000;
     //save otp in database
     const newOTP = new OTP({
         email:req.user.email,
         otp:otp
     });

        await newOTP.save();

    const message = {
        from : "chamodpwanigasekara2000@gmail.com",
        to:req.user.email,
        subject:"OTP for Email Verification",
        text:"Your OTP is"+ otp



    }

    transport.sendMail(message,(err,info)=>{
        if(err){
            console.log(err.message);
            return res.status(500).json({error:"Failed to send OTP"});
        }
        console.log(info);
        return res.status(200).json({message:"OTP Sent Successfully"}); 
    })
    
}

export async function verifyOTP(req,res){
    if(req.user == null){
        return res.status(403).json({message:"Unoauthorized"});
    }

    const otp = req.body.otp;
    const email = req.user.email;

    const savedOTP = await OTP.findOne({email:email,otp:otp});
    if(savedOTP == null){
        return res.status(400).json({error:"Invalid OTP"});
    }else{
        await OTP.deleteOne({email:email,otp:otp});
        await User.updateOne({email:email},{emailVerified:true});
        return res.status(200).json({message:"Email Verified Successfully"});
    }
}


