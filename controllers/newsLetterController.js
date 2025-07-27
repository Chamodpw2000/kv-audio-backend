import NewsLetter from "../models/newsLetter.js";

export async function subscribeToNewsletter(req, res) {

const email = req.body;


const existing =await NewsLetter.findOne({ email: email.email });
if (existing) {
    return res.status(201).json({ message: "You are already subscribed to the newsletter." });
}else{
    const newSubscription = new NewsLetter(email);
    await newSubscription.save();
    return res.status(200).json({ message: "Subscribed to newsletter successfully." });
}


};