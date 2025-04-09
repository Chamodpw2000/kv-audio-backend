import Gallery from "../models/gallery.js";
import Review from "../models/review.js";
import { isItAdmin } from "./userController.js";

export async function addGalleryItem(req, res) {

    console.log("Adding gallery item",req.body);
    


    if(!isItAdmin(req)){
        return res.status(403).json({message:"Unauthorized"});  

    }else{

        try {
            const { image, description , title } = req.body;
            let id = 0;

            const items = await Gallery.find().sort({ id: -1 }).limit(1);
    
            if (items.length == 0) {
                id = 1
            } else {
                id = items[0].id + 1;
            }
    
            const galleryItem = new Gallery({
                id,
                imageUrl: image,
                description,
                title
            });
            await galleryItem.save();
            return res.status(200).json({ message: "Gallery item added successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to add gallery item" });
        }


    }




   


    

}


export async function getGalleryItems(req, res) {
    try {
        const items = await Gallery.find();
        return res.status(200).json(items);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch gallery items" });
    }
}


export async function deleteGalleryItem(req, res) {
    if(!isItAdmin(req)){
        return res.status(403).json({message:"Unauthorized"});  

    }else{

        try {
            const { id } = req.params;
            const item = await Gallery.findOneAndDelete({ id });
            if (!item) {
                return res.status(404).json({ message: "Gallery item not found" });
            }
            return res.status(200).json({ message: "Gallery item deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to delete gallery item" });
        }


    }

}

export async function updateGalleryItem(req, res) {
    console.log("Updating gallery item",req.body);
    console.log("Updating gallery item",req.params);
    
    if(!isItAdmin(req)){
        return res.status(403).json({message:"Unauthorized"});  

    }else{

        try {
            const { id } = req.params;
            const { description , title } = req.body;
            const item = await Gallery.findOneAndUpdate(
                { id },
                { description, title },
                { new: true }
            );
            if (!item) {
                return res.status(404).json({ message: "Gallery item not found" });
            }
            return res.status(200).json({ message: "Gallery item updated successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to update gallery item" });
        }
    }
}




export async function getImagesFromFeedbacks(req, res){

    try {

        console.log("Fetching feedback images");
        

        const feedbacks = await Review.find({ isApproves: true }).select("photos");
        const images = feedbacks.map(feedback => feedback.photos).flat();
        return res.status(200).json(images);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch images from feedbacks" });
        
    }
}
