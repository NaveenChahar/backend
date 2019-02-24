const Products=require('../schemas/vendorSchema');

const vendorProductCrud={
    
    
    uploadProducts(req,res,obj){
        Products.create(obj,function(err){
            if(err){
                console.log('some error occures');
            }
        })
    },
}

module.exports=vendorProductCrud;