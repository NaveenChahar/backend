const Products=require('../schemas/ProductSchema');
const Admin=require('../schemas/adminLoginSchema');
const logger=require('../../Utils/winstonLogger');
const joins=require('../../Utils/productJoins');
const mongoose=require('mongoose');
const db=mongoose.connection;


const ProductCrud={
    
    // async uploadProducts(req,res,categorylist){
    //     try{
    //         var clear=await Products.Products.remove({});
    //         if(clear){
    //         var subcatIndex=0;
    //         var productIndex=0;
    //         for(let obj of categorylist){
    //             var halfobj=new Products.Products({categoryId:obj.categoryId,
    //                         categoryName:obj.categoryName,
    //                         childIds:obj.childIds,
    //                         subcategory:[]
    //                     });
    //                     console.log("we were here");
    //             var promise=await halfobj.save();
    //             console.log("we were p1");
    //             if(promise){               //halting the for loop
    //                   var record1=await Products.Products.findOne({categoryName:obj.categoryName});
    //                   if(record1){
    //                     console.log(record1);
    //                       subcatIndex=0;
    //                       for(let obj1 of obj.subcategory){
    //                         var halfobj1=new Products.SubCat({
    //                                       subcategoryId:obj1.subcategoryId,
    //                                       subcategoryName:obj1.subcategoryName,
    //                                       childIds:obj1.childIds,
    //                                       products:[]});
    //                         record1.subcategory.push(halfobj1);
    //                         //var promise1=await record1.save();
    //                         //if(promise1){
    //                              //var record2=await Products.Products.findOne({categoryName:obj.categoryName});
    //                              //if(record2){
    //                                   productIndex=0;
    //                                   for(let obj2 of obj1.products){
    //                                     var halfobj2=new Products.Product1({
    //                                                   productId:obj2.productId,
    //                                                   productName:obj2.productName,
    //                                                   childIds:obj2.childIds,
    //                                                   subProducts:[]});
    //                                                   console.log(subcatIndex);
    //                                     record1.subcategory[subcatIndex].products.push(halfobj2);
    //                                     //var promise2=await record2.save();
    //                                     //if(promise2){
                                            
    //                                          //var record3=await Products.Products.findOne({categoryName:obj.categoryName});
    //                                          //if(record3){
    //                                              for(let obj3 of obj2.subProducts){
    //                                                  var priceArray=[];
    //                                                  if(obj3.info.priceAndAmount){
    //                                                  for(let obj4 of obj3.info.priceAndAmount){
    //                                                      priceArray.push(obj4);
    //                                                  }}
    //                                                  var imageArray=[];
    //                                                  if(obj3.imageUrls){
    //                                                  for(let obj5 of obj3.imageUrls){
    //                                                      imageArray.push(obj5);
    //                                                  }}
    //                                                 var halfobj3=new Products.SubProduct({
    //                                                               subproductId:obj3.subproductId,
    //                                                               subproductName:obj3.subproductName,
    //                                                               info:{
    //                                                                   description:obj3.info.description,
    //                                                                   benefitsAndUses:obj3.info.benefitsAndUses,
    //                                                                   priceAndAmount:priceArray,
    //                                                               },
    //                                                               imageUrls:imageArray
    //                                                               });
    //                                                 record1.subcategory[subcatIndex].products[productIndex].subProducts.push(halfobj3);
                                                    
    //                                             }
                                                
    //                                         //}
                                            
                
    //                                     //}
    //                                     productIndex++;
                                    
                                    
                                
    //                             }
                            
    
    //                         //}
    //                     //}
    //                     subcatIndex++;
    //                       }
    //                       var promise3=await record1.save();
    //                                                 if(promise3){
    //                                                     console.log("at last");
                            
    //                                                 }
    //                     }
                    
                
    //             }   
    //         }
    //         }
    //         }catch(error){
    //             console.log("some error occured during this"+error);
    //         } 
    // },

    async commitWithRetry(session) {
        try {
          await session.commitTransaction();
          console.log('Transaction committed.');
        } catch (error) {
          if (
            error.errorLabels &&
            error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0
          ) {
            console.log('UnknownTransactionCommitResult, retrying commit operation ...');
            //await commitWithRetry(session);
          } else {
            console.log('Error during commit ...');
            await session.abortTransaction();
            throw error;
          }
        }
    },

    async uploadProducts(req,res,categories,subcategories,products,subProducts){
        // try{
        // var session= await Products.Products.startSession();
        // console.log("came hweer")
        // session.startTransaction({
        //     readConcern: { level: 'snapshot' },
        //     writeConcern: { w: 'majority' },
        //     readPreference: 'primary'
        //   });
        // await Products.Products.remove({});
        // await Products.Products.insertMany(categories);

        // await commitWithRetry(session);
        // session.endSession();
        // }
        // catch(error){
        //     console.log(error);
        //     session.endSession();
        // }
        try{
            Products.Products.remove({},(err)=>{
                if(err){
                    res.status(500).json('some error');
                }
                else{
                    Products.Products.insertMany(categories,(err)=>{
                        if(err){
                            res.status(500).json('some error');
                        }
                    });
                }
            })

            Products.SubCat.remove({},(err)=>{
                if(err){
                    res.status(500).json('some error');
                }
                else{
                    Products.SubCat.insertMany(subcategories,(err)=>{
                        if(err){
                            res.status(500).json('some error');
                        }
                    });
                }
            })
            Products.Product1.remove({},(err)=>{
                if(err){
                    res.status(500).json('some error');
                }
                else{
                    Products.Product1.insertMany(products,(err)=>{
                        if(err){
                            res.status(500).json('some error');
                        }
                    });
                }
            })
            Products.SubProduct.remove({},(err)=>{
                if(err){
                    res.status(500).json('some error');
                }
                else{
                    Products.SubProduct.insertMany(subProducts,(err)=>{
                        if(err){
                            res.status(500).json('some error');
                        }
                    });
                }
            })
        }
        catch(error){
            res.status(500).json('some error occured');
        }
        
        

    },

    editProducts(req,res){
        Products.SubProduct.findOne({subproductId:req.body.stackTrace[3]},(error,object)=>{
            if(err){
                console.log(error);
                res.status(500).json('some error')
            }
            else if(object!=null){
                object.info.isExpress=req.body.isExpress;
                object.info.brand=req.body.brand;
                object.info.description=req.body.description;
            object.info.benefitsAndUses=req.body.benefitsAndUses;
            object.info.priceAndAmount=req.body.priceAndAmount;
            object.save((err)=>{
                if(err){
                    console.log("some error occured during database query");
                }
                else{
                    //res.json("image uploaded successfully");
                    console.log("we got this");
                    res.json({'isPushed':true});
                }
            })
            }
            else{
                res.json('product not found');
            }
            
        })
    },

    imageUpload(req,res,result){
        console.log(req.body)
        //db.inventory.find( { "size.uom": "in" } )   
        // Products.Products.findOne({categoryId:req.body.categoryId},(error,object)=>{
        //     for(let subcategory of object.subcategory){
        //         if(subcategory.subcategoryId==req.body.subcategoryId){
        //             for(let product of subcategory.products){
        //                 if(product.productId==req.body.productId){
        //                     for(let subproduct of product.subProducts){
        //                         if(subproduct.subproductId==req.body.subproductId){
        //                             console.log(' i here')
        //                             subproduct.imageUrls.push(result);
        //                             object.save((err)=>{
        //                                 if(err){
        //                                     console.log("some error occured during database query");
        //                                 }
        //                                 else{
        //                                     res.json(result);
                                         
        //                                 }
        //                             })
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
            
        // })

        Products.SubProduct.findOne({subproductId:req.body.stackTrace[3]},(error,object)=>{
            if(err){
                console.log(error);
                res.status(500).json('some error')
            }
            else if(object!=null){
                object.imageUrls.push(result);
                object.save((err)=>{
                    if(err){
                        console.log("some error occured during database query");
                    }
                    else{
                        //res.json("image uploaded successfully");
                        console.log("we got this");
                        res.json({'isPushed':true});
                    }
                })
            }
            else{
                res.json('product not found');
            }
            
        })
    },
    deleteImageBackend(req,res){
        
        //db.inventory.find( { "size.uom": "in" } )   
        // Products.Products.findOne({categoryId:req.body.categoryId},(error,object)=>{
        //     for(let subcategory of object.subcategory){
        //         if(subcategory.subcategoryId==req.body.subcategoryId){
        //             for(let product of subcategory.products){
        //                 if(product.productId==req.body.productId){
        //                     for(let subproduct of product.subProducts){
        //                         if(subproduct.subproductId==req.body.subproductId){
        //                             console.log(' i here')
        //                             subproduct.imageUrls.splice(req.body.index,1);
        //                             object.save((err)=>{
        //                                 if(err){
        //                                     res.status(409).json('some error occured during database query')
                                          
        //                                 }
        //                                 else{
        //                                     res.status(200).json({'delete':true});
                                         
        //                                 }
        //                             })
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
            
        // })

        Products.SubProduct.findOne({subproductId:req.body.stackTrace[3]},(error,object)=>{
            if(err){
                console.log(error);
                res.status(500).json('some error')
            }
            else if(object!=null){
                object.imageUrls.splice(req.body.index,1);
                object.save((err)=>{
                if(err){
                    console.log("some error occured during database query");
                    res.status(409).json('some error occured during database query');
                }
                else{
                    //res.json("image uploaded successfully");
                    console.log("we got this");
                    res.status(200).json({'delete':true});
                
                }
            })
            }
            else{
                res.json('product not found');
            }
        })



    },

    

    async getProducts(req,res){ 
        // Products.Products.find({},(err,categories)=>{
        //     if(err){
        //         res.json("some error occures");
        //     }
        //     else{
                //console.log(products);
                //logger.debug(products);
        //         var subcatIndex=0;
        //         var productIndex=0;
        //         var modProducts=[];
        //         for(let obj of products){
        //             var halfobj={categoryId:obj.categoryId,
        //                     categoryName:obj.categoryName,
        //                     childIds:obj.childIds,
        //                     subcategory:[]
        //                 };
        //                 //console.log(halfobj.childIds)
        //             subcatIndex=0;
        //             for(let obj1 of obj.subcategory){
        //                 var halfobj1={
        //                                 subcategoryId:obj1.subcategoryId,
        //                                   subcategoryName:obj1.subcategoryName,
        //                                   childIds:obj1.childIds,
        //                                   products:[]};
        //                 halfobj.subcategory.push(halfobj1);
        //                 productIndex=0;
        //                 for(let obj2 of obj1.products){
        //                     var halfobj2={
        //                                     productId:obj2.productId,
        //                                     productName:obj2.productName,
        //                                     childIds:obj2.childIds,
        //                                     subProducts:[]};
        //                                     //console.log(subcatIndex);
        //                     halfobj.subcategory[subcatIndex].products.push(halfobj2);
        //                     for(let obj3 of obj2.subProducts){
        //                         var priceArray=[];
        //                         if(obj3.info.priceAndAmount){
        //                             for(let obj4 of obj3.info.priceAndAmount){
        //                                  priceArray.push(obj4);
        //                         }}
        //                         var imageArray=[];
        //                         if(obj3.imageUrls){
        //                         for(let obj5 of obj3.imageUrls){
        //                             let obj6={
        //                                 uri: obj5.uri
        //                             }
        //                             imageArray.push(obj6);
        //                         }}
        //                         var halfobj3={
        //                             subproductId:obj3.subproductId,
        //                             subproductName:obj3.subproductName,
        //                             info:{
        //                                 description:obj3.info.description,
        //                                 benefitsAndUses:obj3.info.benefitsAndUses,
        //                                 priceAndAmount:priceArray,
        //                             },
        //                             imageUrls:imageArray
        //                         };
        //                         halfobj.subcategory[subcatIndex].products[productIndex].subProducts.push(halfobj3);
                                                    
        //                                         }

        //                                 productIndex++;                                
        //                         }
        //                 subcatIndex++;
        //             }
        //                   modProducts.push(halfobj);
        //                 }
        //         //console.log(modProducts[0].subcategory[0].products[0].subProducts);
        //         //logger.debug("hi");
        //         res.json(modProducts);
        //     }
            
        // })


        try{
            var categories=[];
            var subcategory=[];
            var products=[];
            var subProducts=[];
            await Products.Products.find({},(err,categories1)=>{
                if(err){
                    console.log('error');
                    throw err;
                }
                else{
                    console.log("we were here");
                    // categories=this.removeIdV(categories1);
                    for(let obj of categories1){
                        let obj1={categoryId:obj.categoryId,
                            categoryName:obj.categoryName,
                            childIds:obj.childIds,
                            subcategory:[]
                        };
                        categories.push(obj1);
                    }
                }
            })
            console.log('i waited');
            await Products.SubCat.find({},(err,subcategories1)=>{
                if(err){
                    console.log('error');
                    throw err;
                }
                else{
                    //subcategory=this.removeIdV(subcategories1);
                    for(let obj of subcategories1){
                        let obj1={subcategoryId:obj.subcategoryId,
                            subcategoryName:obj.subcategoryName,
                            childIds:obj.childIds,
                            products:[]
                        };
                        subcategory.push(obj1);
                    }
                }
            })
            await Products.Product1.find({},(err,products1)=>{
                if(err){
                    console.log('error');
                    throw err;
                }
                else{
                    //products=this.removeIdV(products1);
                    for(let obj of products1){
                        let obj1={productId:obj.productId,
                            productName:obj.productName,
                            childIds:obj.childIds,
                            subProducts:[]
                        };
                        products.push(obj1);
                    }
                }
            })
            await Products.SubProduct.find({},(err,subproducts1)=>{
                if(err){
                    console.log('error');
                    throw err;
                }
                else{
                    //subProducts=this.removeIdV(subproducts1);
                    for(let obj of subproducts1){
                        
                        let priceArray=[];
                                if(obj.info.priceAndAmount){ 
                                    for(let obj4 of obj.info.priceAndAmount){
                                         priceArray.push(obj4);
                                }}
                                let imageArray=[];
                                if(obj.imageUrls){
                                for(let obj5 of obj.imageUrls){
                                    let obj6={
                                        uri: obj5.uri,
                                        key: obj5.key
                                    }
                                    imageArray.push(obj6);
                                }}
                                let obj1={
                                    subproductId:obj.subproductId,
                                    subproductName:obj.subproductName,
                                    info:{
                                        isExpress:obj.info.isExpress,
                                        brand:obj.info.brand,
                                        description:obj.info.description,
                                        benefitsAndUses:obj.info.benefitsAndUses,
                                        priceAndAmount:priceArray,
                                    },
                                    imageUrls:imageArray
                                }
                        subProducts.push(obj1);
                    }
                }
            })

            //console.log(categories);
            //console.log(subProducts);
            products=joins.joinProducts(products,subProducts);
            //console.log(products);

            subcategory=joins.joinSubcategory(subcategory,products);
            //console.log(subcategory);

            categories=joins.joinExcelData(categories,subcategory);  //final data after nesting
            //console.log(categories);

            res.status(200).json(categories);
        }
        catch(err){
            res.status(500).json('some error occured')
        }
        
    },

    //not working
    removeIdV(dbArray) {
        var array=[];
        for(let obj of dbArray){
            let newObj={};
            for(let key in obj){
                console.log(key);
                if(key!="_id"&&key!="__v"){
                    newObj[key]=obj[key];
                }
            }
            array.push(newObj);
        }
        return array;
    },

    
}

module.exports=ProductCrud; 