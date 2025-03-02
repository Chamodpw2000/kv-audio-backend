import Order from "../models/order.js";
import Product from "../models/products.js";

export async function createOrder(req,res){

    const  data = req.body;
    console.log(data);
    
    const orderInfo = {
        orderdItems:[],

    }

    if(req.user===null){
        return res.status(403).json({message:"Unauthorized"});

    }

    else{
        orderInfo.email = req.user.email;
    }





    const lastOrder = await Order.find().sort({orderDate:-1}).limit(1);
    if(lastOrder.length == 0){
        orderInfo.orderId = "ORD0001";

    }

    else{
        const lastOrderId = lastOrder[0].orderId;
        const lastOrderNumberString = lastOrderId.replace("ORD", "");
        const newOrderNumber = parseInt(lastOrderNumberString) + 1;
        orderInfo.orderId = "ORD" + newOrderNumber.toString().padStart(4, "0");
    }

    let onedayCost = 0;

    for(let i=0; i<data.orderdItems.length; i++){
        try{
            const orderItem = await Product.findOne({key:data.orderdItems[i].key});
            if(orderItem==null){
                return res.status(404).json({message:"Product not found for id: "+data.orderdItems[i].key});
            }
            else if(orderItem.availability==false){
                return res.status(400).json({message:`Product : ${orderItem.name} not available at the moment`});
            }
            else{

                orderInfo.orderdItems.push({
                    product :{
                    
                    key:orderItem.key,
                    name:orderItem.name,
                    image:orderItem.image[0],
                    price:orderItem.price},
                    quantity:data.orderdItems[i].qty
                });
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

                console.log(orderInfo.orderdItems);
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

                onedayCost += orderItem.price*data.orderdItems[i].qty;

                console.log(onedayCost);
                
            }
        }catch(err){
            return res.status(500).json({message:"Internal server error"});
        }
    }

    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalCost = onedayCost*data.days;

    try{

        
console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
console.log(orderInfo);
console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        const newOrder = new Order(orderInfo);
        console.log("==========================================================");
        
        console.log(newOrder);

        console.log("==========================================================");


        await newOrder.save();
        return res.status(201).json({message:"Order created successfully", order:newOrder});
    }catch(err){
        console.log(err);
        
        return res.status(500).json({message:"Internal server error"});
    }




}