import Gallery from "../models/gallery.js";
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