const delBoys=require('../schemas/delBoySchema');
const vendor=require('../schemas/vendorSchema');
const orderJoin=require('../schemas/orderJointSchema');
const delStatus=require('../schemas/delStatusSchema');
const orderSchema=require('../schemas/orderDataSchema');
const orderDataSchema=require('../schemas/orderDataSchema')
const async=require('async');
const eventEmitter=require('events');

const Stream=new eventEmitter();
const delBoyCrud={

    async login(object){
        var user=await delBoys.findOne({'empId':object.empId,'verified':true})
           if(user){
             if(object.password == user.password){
              console.log('we were here 222');
        return new Promise((resolve,reject)=>{
          resolve(user);
        
        })  
        }
        else{
            return new Promise((resolve,reject)=>{
                reject();
              
              })
        }
   }},

    getNotifications(req,res,empId){     //sse
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
          }); 

          Stream.on('push',function(event,data){
            res.write('event: '+String(event)+'\n'+'data: '+JSON.stringify(data)+'\n\n'); 
          })
         
        var interval=setInterval(() => { 
            
            delBoys.findOne({"empId":empId,'verified':true},(err,doc)=>{
                if(err){
                    console.log('some error');  
                    // res.write('some error occures');
                    // res.end();
                    clearInterval(interval);
                  }
                  else if(doc!=null){
                    // res.write({"notifications":doc.notifications});
                    console.log('sending data')
                    Stream.emit('push','message',{notifications:doc.notifications});
                  }
                  else{
                    Stream.emit('push','message',null);
                  }
            })
        }, 100000);
    },
    async autoOrderAllocation(res,order){ 
        //find loc using vendorId
        var vendorobj=await vendor.findOne({id:order.vendorId});
        if(vendorobj){
            delBoys.updateMany({$and:[
                {
                    location:
                      { $near:
                         {
                           $geometry: { type: "Point",  coordinates: vendorobj.location },
                           $minDistance: 0,
                           $maxDistance: 5000
                         }
                      }
                },
                {verified:true},
                {status:'available'}
            ]},{$push:{notifications:{deliveryId:order.deliveryId,
                                      vendorId:order.vendorId}
                }},(err)=>{
                  if(err){
                    console.log('some error',err);  
                    res.status(500).json('some error occures');
                  }
                  else{ 
                    res.status(200).json({'isAllocated':true});
                  } 
              })
        }
        else{
            console.log('some error',err);  
            res.status(500).json('some error occures or vendor not found'); 
        }
        
    },
    manualOrderAllocation(res,order){ 
        delBoys.findOne({pendingOrders:{$elemMatch:{deliveryId:order.deliveryId,
            vendorId:order.vendorId }},'verified':true},(err,doc)=>{
            if(err){
                console.log('error')
                res.status(500).json('some error occures');
            }
            else if(doc==null){
                delBoys.findOneAndUpdate({$and:[
                    {
                        empId:order.empId
                    },
                    {verified:true},
                    {status:'available'}
                ]},{$push:{pendingOrders:{deliveryId:order.deliveryId,
                                        vendorId:order.vendorId                      
                                    }
                }},(err)=>{       //add docs as param to find if delboy is still aactive or not
                      if(err){
                        console.log('some error',err);  
                        res.status(500).json('some error occures');
                      }
                      else{ 
                        //update the joinproducts collection
                        orderJoin.joinOrderSchema.findOneAndUpdate({deliveryId:order.deliveryId,
                            vendorId:order.vendorId},{deliveryBoyId:empId},(err)=>{
                                if(err){
                                    res.status(500).json('some error occures');  
                                }
                                else{
                                    res.status(200).json('alloted');
                                }
                            })
                      } 
                  })
            }
            else{
                res.status(200).json({"alreadyAlloted":true});
            }  
        })   
    },
    async delBoySearch(res,order){ 

        //find the location first using order.vendorId
        var vendorobj=await vendor.findOne({id:order.vendorId});

        if(vendorobj){
            delBoys.find({$and:[
                {
                    location:
                      { $near:
                         {
                           $geometry: { type: "Point",  coordinates: order.location }
                         }
                      }
                },
                {verified:true},
                {status:'available'}
            ]},(err,docs)=>{
                  if(err){
                    console.log('some error',err);  
                    res.status(500).json('some error occures');
                  }
                  else if(docs!=null){ 
                    res.status(200).json(docs);
                  } 
                  else{
                    res.status(200).json('no delivery Boys found');
                  }
              })
        }
        else{
            console.log('some error',err);  
            res.status(500).json('some error occures');
        }
        
    },

    getPendingOrders(res,empId){
        delBoys.findOne({'empId':empId,'verified':true},(err,doc)=>{
            if(err){
                console.log('some error');
                res.status(500).json('some error occures');
            }
            else{
                res.status(200).json(doc.pendingOrders);
            }
        }) 
    },

    getOrderData(res,order){
        orderJoin.joinOrderSchema.findOne({vendorId:order.vendorId,
            deliveryId:order.deliveryId},(err,doc)=>{
                if(err){
                    console.log('some error');
                    res.status(500).json('some error occures');
                }
                else if(doc==null){
                    cb('No such order found')
                }
                else{
                    orderSchema.OrderSchema.findOne({orderId:doc.orderId},(err1,doc1)=>{
                        if(err1){
                            console.log('some error');
                            res.status(500).json('some error occures');
                        }
                        else{
                            res.status(200).json(doc1); 
                        }
                    })
                }
        })
    },

    getFullOrderData(res,order){
        orderJoin.joinOrderSchema.findOne({vendorId:order.vendorId,
            deliveryId:order.deliveryId,isReady:true},(err,doc)=>{
                if(err){
                    cb('Db error');
                }
                else if(doc==null){
                    cb('Order not ready');
                }
                else{
                    async.parallel([
                        delBoyCrud.getMainOrderData(doc),
                        //delBoyCrud.getDelStatus(order.deliveryId),
                        delBoyCrud.getTimeSlot(doc)
                    ],function(err,results){
                        if(err){
                            res.status(409).json({status:config.ERROR,message:err})
                        }
                        else{
                            var obj={
                                orderId:doc.orderId,
                                delievAddress:results[0].delievAddress,
                                timeSlot:results[1].timeSlot,
                                paymentMethod:results[0].paymentMethod
                            }

                            res.status(200).json(obj);
                        }
                    })
                }
            })
        
    },

    getMainOrderData(order){
        return function(cb){
            orderSchema.OrderSchema.findOne({orderId:order.orderId},(err1,doc1)=>{
                if(err1){
                    cb('Db error');
                }
                else if(doc1==null){
                    cb('No such order found')
                }
                else{
                    cb(null,doc1);
                }
            })
        }
    },

    getTimeSlot(order){
        return function(cb){
           if(order.type=='EXP'){
               orderSchema.ExpressDelivery.findOne({deliveryId:order.deliveryId},(err,doc)=>{
                   if(err){
                       cb('Db error');
                   }
                   else if(doc==null){
                       cb('No such order found')
                   }
                   else{
                       cb(null,doc);
                   }
               })
           }
           else{
              orderSchema.StandardDelivery.findOne({deliveryId:order.deliveryId},(err,doc)=>{
                if(err){
                    cb('Db error');
                }
                else if(doc==null){
                    cb('No such order found')
                }
                else{
                    cb(null,doc);
                }
            })
           }
        }
    },

    //good to have feature
    // getDelStatus(deliveryId){
    //     return function(cb){
    //         delStatus.DelStatus.findOne({'deliveryId':deliveryId},(err,doc)=>{

    //         })
    //     }
    // },

    changeStatus(res,object){
        //console.log(object.empId)
        delBoys.findOneAndUpdate({'empId':object.empId,'verified':true},{status:object.status},(err)=>{
            if(err){
                console.log('some error',err);
                res.status(500).json('some error occures');
            }
            else{
                res.status(200).json('status changed')
            }
        })
    },

    orderDispatched(){

    },
 
    orderDelivered(){

    },

    updateLocation(res,obj){
        delBoys.findOneAndUpdate({empId:obj.empId,'verified':true,status:'available'},
            {$set:{"location.coordinates":obj.location}},(err)=>{
                if(err){
                    console.log(err)
                    res.status(500).json('some error occures');
                }
                else{
                    res.json({isChanged:true});
                }
            })
    },

    rejectOrder(res,order,empId){
        delBoys.findOneAndUpdate({empId:empId,notifications:{deliveryId:order.deliveryId,
            vendorId:order.vendorId },'verified':true},
            {$pull:{notifications:{deliveryId:order.deliveryId,
                vendorId:order.vendorId }}},(err)=>{
            if(err){
                res.status(500).json('some error occurs',err);
            }
            else{
                res.status(200).json('notification removed');
            }
        })
    },

    acceptOrder(res,order,empId){
        //push into pending & delete from notifications
        //first check into order collection to check if its already alloted then do this
        
        delBoys.findOne({pendingOrders:{$elemMatch:{deliveryId:order.deliveryId,
            vendorId:order.vendorId }},'verified':true},(err,doc)=>{
            if(err){
                console.log('error')
                res.status(500).json('some error occures');
            }
            else if(doc==null){
                delBoys.findOneAndUpdate({empId:empId,'verified':true},{$push:{pendingOrders:
                    {deliveryId:order.deliveryId,vendorId:order.vendorId }}},(err,doc)=>{
                    if(err){
                        res.status(500).json('some error occures');
                    }
                    else{
                        console.log('here')
                        //update the joinproducts collection
                        orderJoin.joinOrderSchema.findOneAndUpdate({deliveryId:order.deliveryId,
                            vendorId:order.vendorId},{deliveryBoyId:empId},(err)=>{
                                if(err){
                                    res.status(500).json('some error occures');  
                                }
                                else{
                                    //delete from notificaton of all
                                    delBoys.updateMany({notifications:{$elemMatch:{deliveryId:order.deliveryId,
                                        vendorId:order.vendorId }}},
                                        {$pull:{notifications:{deliveryId:order.deliveryId,
                                                            vendorId:order.vendorId }}},
                                        (err)=>{
                                            if(err){
                                                res.status(500).json('some error occures');
                                            }
                                            else{
                                                res.status(200).json({"allotedToMe":true});
                                            }
                                    })
                                }
                            })
                    }
                })
            }
            else{
                res.status(200).json({"alreadyAlloted":true});
            }  
        })   
    }

}

module.exports=delBoyCrud;