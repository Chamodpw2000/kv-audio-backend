
import Order from "../models/order.js";
import Product from "../models/products.js";
import { isItAdmin } from "./userController.js";
// Utility function to get the next orderId
export async function getNextOrderId() {
    // Get all orderIds, remove 'ORD', convert to number, find max, and increment
    const orderIds = await Order.find().select("orderId -_id");
    if (!orderIds.length) {
        return "ORD0001";
    }
    // Extract numeric part, filter valid, and find max
    const maxNum = orderIds
        .map(o => parseInt((o.orderId || "").replace("ORD", ""), 10))
        .filter(n => !isNaN(n))
        .reduce((max, n) => n > max ? n : max, 0);
    const nextNum = maxNum + 1;
    return "ORD" + nextNum.toString().padStart(4, "0");
}
export async function createOrder(req, res) {

    const data = req.body;

    const orderInfo = {
        orderedItems: [],

    }

    if (req.user === null) {
        return res.status(403).json({ message: "Unauthorized" });

    }

    else {
        orderInfo.email = req.user.email;
        orderInfo.orderId = await getNextOrderId();
    }












  

    let onedayCost = 0;

    for (let i = 0; i < data.orderedItems.length; i++) {
        try {
            const orderItem = await Product.findOne({ key: data.orderedItems[i].key });
            if (orderItem == null) {
                return res.status(404).json({ message: "Product not found for id: " + data.orderedItems[i].key });
            }
            else if (orderItem.availability == false) {
                return res.status(400).json({ message: `Product : ${orderItem.name} not available at the moment` });
            }
            else {

                orderInfo.orderedItems.push({
                    product: {

                        key: orderItem.key,
                        name: orderItem.name,
                        image: orderItem.image[0],
                        price: orderItem.price
                    },
                    quantity: data.orderedItems[i].qty
                });


                onedayCost += orderItem.price * data.orderedItems[i].qty;


            }
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalCost = onedayCost * data.days;

    try {




        const newOrder = new Order(orderInfo);



        await newOrder.save();
        return res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
        console.log(err);

        return res.status(500).json({ message: "Internal server error" });
    }




}

export async function getQuote(req, res) {

    const data = req.body.cartInfo;


    let totalCost = 0;

    for (let i = 0; i < data.orderedItems.length; i++) {
        try {
            const orderItem = await Product.findOne({ key: data.orderedItems[i].key });
            if (orderItem == null) {
                return res.status(404).json({ message: "Product not found for id: " + data.orderedItems[i].key });
            }
            else if (orderItem.availability == false) {
                return res.status(400).json({ message: `Product : ${orderItem.name} not available at the moment` });
            }
            else {
                totalCost += orderItem.price * data.orderedItems[i].qty;
            }
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    return res.status(200).json({ message: "Quote generated successfully", totalCost: totalCost });
}

export async function getAllOrders(req, res) {

    try {

        if (req.user == null) {
            return res.status(403).json({ message: "Please Log in to continue" });

        }
        else if (isItAdmin(req)) {

            const orders = await Order.find();
            return res.status(200).json(orders);

        } else {
            const orders = await Order.find({ email: req.user.email });
            return res.status(200).json(orders);
        }






    } catch (e) {

        console.log(e);

    }
}

export async function approveOrRejectOrder(req, res) {
    const orderId = req.params.orderId;
    const status = req.body.orderStatus;
    if (isItAdmin(req)) {
        try {

            let order = await Order.findOne({ orderId: orderId });

            if (order == null) {
                return res.status(404).json({ message: "Order not found" });
            }
            order = await Order.findOneAndUpdate({ orderId: orderId }, { status: status }, { new: true });

            return res.status(200).json({ message: "Order status updated successfully", order: order });


        } catch (e) {

            console.log(e);

        }
    }

    else {
        return res.status(403).json({ message: "Unauthorized" });
    }
}