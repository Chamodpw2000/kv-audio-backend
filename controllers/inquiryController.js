import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function AddInquiry(req, res) {


    try {
        const data = req.body;
        data.email = req.user.email;
        data.phone = req.user.phone;

        let id = 0;

        const inquiries = await Inquiry.find().sort({ id: -1 }).limit(1);

        if (inquiries.length == 0) {
            id = 1
        } else {
            id = inquiries[0].id + 1;
        }

        data.id = id;

        const newInquiry = new Inquiry(data);
        const responce = await newInquiry.save();

        res.json({ message: "Inquiry added successfully", id: responce.id })
    } catch (e) {



        console.log(e)
        res.json({ message: "Fail to add inquary" })



    }






}


export async function GetInquiries(req, res) {

    try {

        if (isItAdmin(req)) {
            const inquiries = await Inquiry.find();
            res.json(inquiries)
            return;
        } else if (isItCustomer(req)) {
            const inquiries = await Inquiry.find({ email: req.user.email });
            res.json(inquiries);
            return;
        } else {
            res.json({ message: "You are Not Authorized to perform this action" })

            return;
        }


    } catch (e) {

        res.json({ message: "Erroe geting inquiries" });
    }
}


export async function DeleteInquiry(req, res) {

    try {

        const id = req.params.id

        if (isItAdmin(req)) {
            await Inquiry.deleteOne({ id: id })
            res.json({ message: "Inquiry deleted Successfuly" });


        } else if (isItCustomer(req)) {
            const inquary = await Inquiry.findOne({ id: id })
            if (req.user.email == inquary.email) {
                await Inquiry.deleteOne({ id: id })
                res.json({ message: "Inquiry deleted Successfuly" });


            } else {
                res.json({ message: "You are not Authorized to perform this action" });


            }


        } else {

            res.json({ message: "You are not Authorized to perform this action" });


        }


    } catch (e) {


        console.log(e);
        res.json({ message: "Error Deleting Inquiry" });



    }
}


export async function UpdateInquiry(req, res) {


    try {
        const id = req.params.id;
        const data = req.body;

        if (isItAdmin(req)) {
            const inquary = await Inquiry.findOne({ id: id })
            if (inquary == null) {
                res.json({ message: "No Inquiry for that id" })
            } else {
                await Inquiry.findOneAndUpdate({ id: id }, data)
                res.json({ message: "Updated the inquiry sucessfully" })



            }

        } else if (isItCustomer(req)) {

            const inquary = await Inquiry.findOne({ id: id })
            if (inquary == null) {
                res.json({ message: "No Inquiry for that id" })
            } else {
                if (inquary.email == req.user.email) {
                    await Inquiry.findOneAndUpdate({ id: id }, { message: data.message })
                    res.json({ message: "Updated the inquiry sucessfully" })


                } else {
                    res.json({ message: "You are not Autharized to do this action" })
                }
            }


        } else {
            res.json({ message: "You are not Autharized to do this action" })

        }
    } catch (e) {

        console.log(e);
        res.json({ message: "Error Editing the inquiry" })









    }




}