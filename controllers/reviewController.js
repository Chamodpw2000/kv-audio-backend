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

    // console.log(data);

    // console.log(data.comment);



    data.email = req.user.email

    data.name = req.user.firstName + " " + req.user.lastName;

    data.profilePicture = req.user.profilePicture

    const item = await Product.findOne({ key: data.itemId })
    console.log(item);



    if (item != null) {
        data.itemName = item.name
    }





    // console.log(data);



    const newreview = new Review(data)

    // console.log(newreview.comment);
    // console.log(data.comment);



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



export function deleteReview(req, res) {

    const email = req.params.email;

    // console.log(email);

    console.log(req.user);



    if (req.user == null) {
        res.json({ message: "Please Log in to continue" })
    }

    else if (req.user.role == 'admin') {

        Review.deleteOne({ email: email }).then(() => {
            res.status(200).json({ message: "Review Deleted successfully" })
        }).catch((err) => {
            res.status(400).json({ message: "Error deleting review" + err })
        })
    }

    else if (req.user.role == "customer" && email == req.user.email) {
        Review.deleteOne({ email: email }).then(() => {
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



    const email = req.params.email


    console.log(req.user);



    if (req.user.role == "admin") {


        Review.findOneAndUpdate({
            email: email
        }, {

            isApproves: true
        }).then(() => {
            res.status(200).json({ message: "Review Approved Successfully" })
        }).catch((err) => {
            res.status(401).json({ message: "Failed to delete review" + err })
        })

    } else {
        res.status(403).json({ message: "You are Not autharized to perform this action, only admins can approve reviews" })
    }
}



export function getProductReviews(req, res) {
    const itemId = req.params.itemId;
    console.log(itemId);
    try {

        Review.find({ itemId: itemId, isApproves: true })
        .then((reviews) => {
            console.log("reviews", reviews);

            const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
            
            const response = {
                reviews: reviews,
                rating: rating,
            };

            console.log("response", response);
            
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


