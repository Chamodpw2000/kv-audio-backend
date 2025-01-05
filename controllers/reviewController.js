import Review from "../models/review.js";

export function addReview(req, res) {


    if (req.user == null) {
        res.status(401).json({
            message: "please login and try again"



        });

        return;

    }

    const data = req.body

    // console.log(data);

    // console.log(data.comment);



    data.email = req.user.email

    data.name = req.user.firstName + " " + req.user.lastName;

    data.profilePicture = req.user.profilePicture

    // console.log(data);



    const newreview = new Review(data)

    // console.log(newreview.comment);
    // console.log(data.comment);



    newreview.save().then(() => {
        res.json({ message: "Review Added Successfully" });
    }).catch(() => {
        res.status(500).json({ error: "Review Adding Faild" });
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
                res.status(400).json({ message: "Error getting requests " + err });
            });
    } else if (user.role == "admin") {
        Review.find()
            .then((reviews) => {
                res.status(200).json({ reviews });
            })
            .catch((err) => {
                res.status(400).json({ message: "Error getting requests " + err });
            });
    }
}



export function deleteReview(req, res) {



    console.log("dellllllllllllllllllllll");






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

            isApproves : true        }).then(()=>{
                res.status(200).json({message:"Review Approved Successfully"})
            }).catch((err)=>{
                res.status(401).json({message:"Failed to delete review"+ err})
            })

    }else{
        res.status(403).json({message:"You are Not autharized to perform this action, only admins can approve reviews"})
    }
}


