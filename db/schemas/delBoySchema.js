const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const delBoySchema=new Schema({
    empId:String,
    status:String,
    pendingOrders:[{
        deliveryId:String,
        vendorId:String
    }],
    previousOrders:[{
        deliveryId:String,
        vendorId:String
    }],
    rating:String,
    totalOrdersToday:String, 
    totalOrdersDelivered:String,
    location:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
             // 'location.type' must be 'Point'
          },
        coordinates: [{ 
            type: Number,
          }]
    },
    notifications:[{
        deliveryId:String,
        vendorId:String
    }],
    verified:Boolean
})

//delBoySchema.index({ location: "2dsphere" });

module.exports=mongoose.model('delboysInfo',delBoySchema);
