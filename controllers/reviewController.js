import Product from "../models/products.js";
import Review from "../models/review.js";

export async function addReview(req, res) {


    if (req.user == null) {
        res.status(401).json({
            message: "please login and try again"



        });

        return;

    }


if(req.body.itemId){
    const existingReview = await Review.findOne({ email: req.user.email, itemId: req.body.itemId });
    if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this product, If you want to edit to visit your profile" });
    }

}


 
    const data = req.body





    data.email = req.user.email

    data.name = req.user.firstName + " " + req.user.lastName;

    data.profilePicture = req.user.profilePicture

    const item = await Product.findOne({ key: data.itemId })




    if (item != null) {
        data.itemName = item.name
    }




;



    const newreview = new Review(data)





    newreview.save().then(() => {
        res.json({ message: "Review Added Successfully" });
    }).catch((e) => {
        res.status(500).json({ error: "Review Adding Faild", e });
    });









}



export function getReviews(req, res) {
    const user = req.user;

    if (user == null || user.role != "admin") {
        Review.find({ isApproves: true })
            .then((reviews) => {
                res.status(200).json(reviews);
            })
            .catch((err) => {
                res.status(400).json({ message: "Error getting reviews " + err });
            });
    } else if (user.role == "admin") {
        Review.find()
            .then((reviews) => {
                res.status(200).json(reviews );
            })
            .catch((err) => {
                res.status(400).json({ message: "Error getting reviews " + err });
            });
    }
}


export function getMyReviews(req, res) {
    const user = req.user;


    if (user === null ) {
        res.status(401).json({ message: "Please Log in to continue" });
    } else if (user.role == "customer") {
        Review.find({ email: user.email })
            .then((reviews) => {
                res.status(200).json(reviews );
            })
            .catch((err) => {
                res.status(400).json({ message: "Error getting reviews " + err });
            });
    }
}



export function deleteReview(req, res) {

    

    const _id = req.params._id;

    const email = req.user.email;   

    



    if (req.user == null) {
        res.json({ message: "Please Log in to continue" })
    }

    else if (req.user.role == 'admin') {

        Review.deleteOne({ _id: _id }).then(() => {
            res.status(200).json({ message: "Review Deleted successfully" })
        }).catch((err) => {
            res.status(400).json({ message: "Error deleting review" + err })
        })
    }

    else if (req.user.role == "customer" && email == req.user.email) {
        Review.deleteOne({ _id:_id }).then(() => {
            res.status(200).json({ message: "Review Deleted successfully" })
        }).catch((err) => {
            res.status(400).json({ message: "Error deleting review" + err })
        })
    } else {
        res.status(403).json({ message: "No permissionn to delete the request" }
        )
    }


}


export function approveReview(req, res) {



    const id = req.params._id;






try {

    if (req.user.role == "admin") {


      
        


        Review.findByIdAndUpdate(
        id
        , {

            isApproves: true
        }).then(() => {
    
            
            res.status(200).json({ message: "Review Approved Successfully" })
        }).catch((err) => {
            console.error("Error approving review:", err);
            res.status(401).json({ message: "Failed to delete review" + err })
        })

    } else {
        res.status(403).json({ message: "You are Not autharized to perform this action, only admins can approve reviews" })
    }
    
} catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
    
}
    
}



export function unapproveReview(req, res) {



    const id = req.params._id;



  



    if (req.user.role == "admin") {


        Review.findById(
        id
        , {

            isApproves: false
        }).then(() => {
            res.status(200).json({ message: "Review Unpublished Successfully" })
        }).catch((err) => {
            res.status(401).json({ message: "Failed to unpublish review" + err })
        })

    } else {
        res.status(403).json({ message: "You are Not autharized to perform this action, only admins can approve reviews" })
    }
}



export function getProductReviews(req, res) {
    const itemId = req.params.itemId;

    try {

        Review.find({ itemId: itemId, isApproves: true })
        .then((reviews) => {
 

            const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
            
            const response = {
                reviews: reviews,
                rating: rating,
            };


            
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(400).json({ message: "Error getting reviews " + err });
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
    
}


export async function updateReview(req, res) {

    
    const reviewId = req.params._id;
    const updatedData = req.body;



    if (req.user == null) {
        res.status(401).json({ message: "Please Log in to continue" });
        return;
    }
const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }


    if (req.user.role == "admin"|| req.user.email == review.email) {
        Review.findByIdAndUpdate(reviewId, updatedData, { new: true })
            .then((updatedReview) => {
                res.status(200).json(updatedReview);
            })
            .catch((err) => {
                res.status(400).json({ message: "Error updating review " + err });
            });
    } else {
        res.status(403).json({ message: "You are not authorized to update this review" });
    }
}



