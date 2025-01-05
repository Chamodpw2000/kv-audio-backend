import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    email:{
        type : String,
        required : true,
        unique: true
    },

    name : {
        type: String,
        required : true,
        unique: true 
    }, 
    rating : {
        type : Number,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    date : {
        type : Number,
        required : true,
        default : Date.now()
    },
    isApproves : {
        type : Boolean,
        required: true,
        default:false

    },
    profilePicture:{
        type : String,
        required : true,
        default: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"

    }




})





const Review = mongoose.model("Review",reviewSchema);

export default Review;