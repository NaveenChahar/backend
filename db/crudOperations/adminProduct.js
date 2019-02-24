const Products=require('../schemas/adminProductSchema');
const Admin=require('../schemas/adminLoginSchema');

const adminProductCrud={
    
    async uploadProducts(req,res,categorylist){
        try{
        var clear=await Products.Products.remove({});
        if(clear){
        var subcatIndex=0;
        var productIndex=0;
        for(let obj of categorylist){
            var halfobj=new Products.Products({categoryId:obj.categoryId,
                        categoryName:obj.categoryName,
                        subCategory:[]
                    });
                    console.log("we were here");
            var promise=await halfobj.save();
            console.log("we were p1");
            if(promise){               //halting the for loop
                  var record1=await Products.Products.findOne({categoryName:obj.categoryName});
                  if(record1){
                    console.log(record1);
                      subcatIndex=0;
                      for(let obj1 of obj.subcategory){
                        var halfobj1=new Products.SubCat({subCategoryName:obj1.subcategoryName,
                                      subCategoryId:obj1.subcategoryId,
                                      products:[]});
                        record1.subcategory.push(halfobj1);
                        var promise1=await record1.save();
                        if(promise1){
                             var record2=await Products.Products.findOne({categoryName:obj.categoryName});
                             if(record2){
                                  productIndex=0;
                                  for(let obj2 of obj1.products){
                                    var halfobj2=new Products.Product1({productName:obj2.productName,
                                                  productId:obj2.productId,
                                                  subProducts:[]});
                                                  console.log(subcatIndex);
                                    record2.subcategory[subcatIndex].products.push(halfobj2);
                                    var promise2=await record2.save();
                                    if(promise2){
                                        
                                         var record3=await Products.Products.findOne({categoryName:obj.categoryName});
                                         if(record3){
                                             for(let obj3 of obj2.subProducts){
                                                 var priceArray=[];
                                                 for(let obj4 of obj3.info.priceAndAmount){
                                                     priceArray.push(obj4);
                                                 }
                                                 var imageArray=[];
                                                 if(obj3.imageUrls){
                                                 for(let obj5 of obj3.imageUrls){
                                                     imageArray.push(obj5);
                                                 }}
                                                var halfobj3=new Products.SubProduct({subproductName:obj3.subproductName,
                                                              subproductId:obj3.subproductId,
                                                              info:{
                                                                  description:obj3.info.description,
                                                                  benefitsAndUses:obj3.info.benefitsAndUses,
                                                                  priceAndAmount:priceArray,
                                                              },
                                                              imageUrls:imageArray
                                                              });
                                                record3.subcategory[subcatIndex].products[productIndex].subProducts.push(halfobj3);
                                                var promise3=await record3.save();
                                                if(promise3){
                                                    console.log("at last");
                        
                                                }
                                            }
                                            
                                        }
                                        
            
                                    }
                                    productIndex++;
                                
                                
                            
                            }
                        

                        }
                    }
                    subcatIndex++;
                      }
                    }
                
            
            }   
        }
        }
        }catch(error){
            console.log("some error occured during this"+error);
        }
    },

    editProducts(req,res){
        Products.Products.findOne({categoryId:req.body.stackTrace[0]},(error,object)=>{
            for(let subCategory of object.subcategory){
                if(subCategory.subCategoryId==req.body.stackTrace[1]){
                    for(let product of subCategory.products){
                        if(product.productId==req.body.stackTrace[2]){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.stackTrace[3]){
                                    subproduct.info.description=req.body.description;
                                    subproduct.info.benefitsAndUses=req.body.benefitsAndUses;
                                    subproduct.info.priceAndAmount=req.body.priceAndAmount;
                                    object.save((err)=>{
                                        if(err){
                                            console.log("some error occured during database query");
                                        }
                                        else{
                                            //res.json("image uploaded successfully");
                                            console.log("we got this");
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
            
        })
    },

    imageUpload(req,res,result){
        //db.inventory.find( { "size.uom": "in" } )   
        Products.Products.findOne({categoryId:req.body.stackTrace[0]},(error,object)=>{
            for(let subCategory of object.subcategory){
                if(subCategory.subCategoryId==req.body.stackTrace[1]){
                    for(let product of subCategory.products){
                        if(product.productId==req.body.stackTrace[2]){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.stackTrace[3]){
                                    subproduct.imageUrls.push(result);
                                    object.save((err)=>{
                                        if(err){
                                            console.log("some error occured during database query");
                                        }
                                        else{
                                            //res.json("image uploaded successfully");
                                            console.log("we got this");
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
            
        })
    },

    login(res,object){
        Admin.findOne(object,function(error,user){
            if(error){
                res.json("Invalid data");
            }
            else{
                return user;
            }
        })
    },

    getProducts(req,res){
        Products.Products.find({},(err,products)=>{
            if(err){
                res.json("some error occures");
            }
            else{
                //console.log(products);
                res.json(products);
            }
            
        })
    }

    
}

module.exports=adminProductCrud; 