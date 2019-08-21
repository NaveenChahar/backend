const express=require('express');
const delBoyRoutes=express.Router();
const jwt=require('jsonwebtoken');
const jwtVerification = require('../../Utils/jwt/jwtverify');
const delBoyCrud=require('../../db/crudOperations/delBoyCrud');
const delBoyInitialInfo=require('../../models/setterGetter/delBoy.model');

delBoyRoutes.post('/login',async function(req,res){
    var delBoyData= await delBoyCrud.login({'empId':req.body.id});
    console.log(delBoyData);
   if(delBoyData){
        jwt.sign({delBoyData},jwtVerification.delBoySecurekey,{expiresIn:'300000s'},(err,token)=>{ 
                     //token is generated after checking the presence of user
        res.json({
            token:token
        })
    })
    }
    else{
        res.json();
    }
})

delBoyRoutes.get('/getPendingOrders',jwtVerification.verifyToken,(req,res)=>{ //jwt implement
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delBoyCrud.getPendingOrders(res,authData.delBoyData.empId);
        }
    })

})

delBoyRoutes.post('/getOrderData',jwtVerification.verifyToken,(req,res)=>{ //jwt implement
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delBoyCrud.getOrderData(res,req.body.orderDetails);
        }
    })

})

delBoyRoutes.post('/getFullOrderData',jwtVerification.verifyToken,(req,res)=>{ //jwt implement
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delBoyCrud.getFullOrderData(res,req.body.orderDetails);
        }
    })

})

delBoyRoutes.post('/changeStatus',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delBoyCrud.changeStatus(res,{'empId':authData.delBoyData.empId,status:req.body.status});
        } 
    })

})

delBoyRoutes.post('/orderDelivered',jwtVerification.verifyToken,(req,res)=>{
    //delBoyCrud.orderDelivered(res)
    //this one is going to be complex
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{

        }
    })
})

delBoyRoutes.post('/updateLocation',jwtVerification.verifyToken,(req,res)=>{
    
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            var obj={
                empId:authData.delBoyData.empId,
                location:req.body.location
            }
            delBoyCrud.updateLocation(res,obj);        }
    })
})

delBoyRoutes.get('/getNotifications',(req,res)=>{ 
    console.log('in notifications')
    var empId=req.query.id;
    delBoyCrud.getNotifications(req,res,empId); 
})

delBoyRoutes.post('/orderAcception',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delBoyCrud.acceptOrder(res,req.body.orderDetails,authData.delBoyData.empId);  //get empId from jwt
        } 
                  
    })
})

delBoyRoutes.post('/orderRejection',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.delBoySecurekey,(err,authData)=>{
        //console.log(authData)
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delBoyCrud.rejectOrder(res,req.body.orderDetails,authData.delBoyData.empId);
        }        
    })
})

delBoyRoutes.get('/searchDelBoys',(req,res)=>{
    console.log(req.body)
    var obj={
        vendorId:req.query.vendorId,
    }
    console.log(obj)
    delBoyCrud.delBoySearch(res,obj)
})


module.exports=delBoyRoutes;