import User from "../models/users.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export function AddUser(req,res){


    const data = req.body;

    data.password = bcrypt.hashSync(data.password,10)
    
    const newUser = new User(data);

    newUser.save().then(()=>{res.status(200).json({
        "message":"User Saved Successfully"
    })}).catch((error)=>{
        res.status(500).json({error:"User Registration Failed"})
})

}


export function userLogin(req,res){
    const data = req.body;
    
    

    User.findOne({email:data.email}).then(
        (user)=>{
            if(user==null){
                res.status(400).json({message:"User Not  found"})
            }else{
                const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);

                if(isPasswordCorrect){
                    const token = jwt.sign({
                        firstName:user.firstName,
                        lastName:user.lastName,
                        email:user.email,
                        role:user.role
                    },"kv-secret-89!")
                    res.status(200).json({message:"Login Successful", token:token});

                }else{
                    res.status(400).json({error:"Login Faild"})
                }
            }
        }
    )
}