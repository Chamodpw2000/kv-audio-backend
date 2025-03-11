import mongoose from 'mongoose';

const orderShema = new mongoose.Schema({

    orderId :{
        type: String,
        required: true,
        unique: true
    },
    orderDate :{
        type: Date,
        required: true,
        default: Date.now
    },
    orderedItems :{

        type:[
            {
                product:{
                    key:{
                        type: String,
                        required:true
                    },

                    name:{
                        type:String,
                        required: true
                    },
                    image:{
                        type: String,
                        required: true
                    },
                    price:{
                        type: Number,
                        required: true
                    }
                },

                quantity:{
                    type: Number,
                    required: true
                }
            }
        ],

        required: true
    },

    days:{
        type: Number,
        required: true
    },

startingDate :{
    type: Date,
    required: true
},

    endingDate :{
        type: Date,
        required: true
    },

    totalCost :{
        type: Number,
        required: true
    },

    orderStatus :{
        type: Boolean,
        required: true,
        default: false
    },

    status:{
        type: String,
        required: true,
        default: "Pending"
    },

   email:{
       type: String,
       required: true
   }
    

   


});

const Order = mongoose.model('Order', orderShema);
export default Order;