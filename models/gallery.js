import mongoose from "mongoose";
const gallerySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    }
})

const Gallery = mongoose.model("gallery", gallerySchema)
export default Gallery;

