import Order from "../models/order.js";
import Product from "../models/products.js";
import User from "../models/users.js";
import { isItAdmin } from "./userController.js";


export async function productTypesData(req, res) {


    if (!isItAdmin(req)) {
        return res.status(403).json({ message: "Unauthorized" });

    } else {


        const productTypes = new Map();
        try {
            const products = await Product.find();

            products.forEach(product => {
                const type = product.category || "Unknown";
                productTypes.set(type, (productTypes.get(type) || 0) + 1);
            });

            return res.status(200).json(Array.from(productTypes.entries()));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to fetch product types" });
        }
    }
}

export async function getOrderAnalytics(req, res) {
    if (!isItAdmin(req)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const orders = await Order.find({
        orderDate: {
            $gte: startOfYear,
            $lte: endOfYear
        }
    });

    const ordersPerMonth = new Map();
    orders.forEach(order => {
        const month = order?.orderDate?.getMonth();
        const monthName = monthNames[month];
        ordersPerMonth.set(monthName, (ordersPerMonth.get(monthName) || 0) + 1);
    });
    return res.status(200).json(Array.from(ordersPerMonth.entries()));
}


export async function getItemCodes(req, res) {
    if (!isItAdmin(req)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {

        const products = await Product.find();
        const productCodes = products.map((product) => product.key);

        return res.status(200).json(productCodes);

    } catch (error) {

        return res.status(500).json({ message: "Error Occured While Fetching Data" });

    }
}


export async function getItemOrders(req, res) {



    if (!isItAdmin(req)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const { items, dateRange } = req.body;




        if (!items || !dateRange) {
            return res.status(400).json({ message: "Items and dateRange are required" });
        }

        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
      

        const orders = await Order.find({
            orderDate: {
                $gte: fromDate,
                $lte: toDate
            },
            "orderedItems.product.key": { $in: items }
        });

        const ordersPerItem = new Map();
        orders.forEach((order) => {
            order.orderedItems.forEach((item) => {
                const key = item.product.key;
                if (!items.includes(key)) return;
                ordersPerItem.set(key, (ordersPerItem.get(key) || 0) + 1);
            })
        })

        return res.status(200).json({

            analytics: Array.from(ordersPerItem.entries())
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error Occurred While Fetching Orders" });
    }
}

export async function topCustomers(req, res) {
    if (!isItAdmin(req)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const orders = await Order.find().select('email');





        const customerOrders = new Map();
        orders.forEach(order => {

            const customerEmail = order.email;
            const orderCount = customerOrders.get(customerEmail) || { email: customerEmail, count: 0 };
            orderCount.count += 1;
            customerOrders.set(customerEmail, orderCount);
        });

        const sortedCustomers = Array.from(customerOrders.entries()).sort((a, b) => b[1].count - a[1].count);
        const users = await User.find().select('firstName lastName email');
        const emailToName = new Map();
        users.forEach(user => {
            emailToName.set(user.email, `${user.firstName} ${user.lastName}`);
        });


        return res.status(200).json(sortedCustomers.slice(0, 6).map(([email, { count }]) => ({
            email,
            name: emailToName.get(email),
            count
        })));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error Occurred While Fetching Top Customers" });
    }
}

