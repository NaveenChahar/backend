const express=require('express');
const empRoutes=express.Router();
const upload=require("../../Utils/multer/uploadCode");
const multer=require("multer");
const empCrud=require('../../db/crudOperations/employee');


 
    //var empCrud=require("../../db/crudOperations/employee");
    empRoutes.post('/login',(req,res)=>{

        console.log(req.body.name);
        var name=req.body.name;
        var gender=req.body.gender;
        var object={name,gender};

        empCrud.doLogin(req,res,object);

    });



    empRoutes.post('/register',(req,res)=>{

        var object=require("../../models/setterGetter/empSetGet");

        object.name=req.body.name;
        object.password=req.body.password;
        object.address[0].fulladdress=req.body.address.fulladdress;
        object.address[0].street=req.body.address.street;
        object.address[0].city=req.body.address.city;
        object.address[0].state=req.body.address.state;
        object.address[0].pin_code=req.body.address.pin_code;
        object.email=req.body.email;
        object.mobile_no=req.body.mobile_no;
        object.qualification=req.body.qualification;
        object.referralCode=req.body.refferalCode;
        object.gender=req.body.gender;
        object.date_of_birth=req.body.date_of_birth;          //filling data into object to be given to db
        object.typeEmployee=req.body.typeEmployee;
        object.nomineeRel=req.body.nomineeRel;
        object.nominee=req.body.nominee;
        object.documents[0].GSTNumber=req.body.documents.GSTNumber;
        object.documents[0].adhno=req.body.documents.adhno;
        object.documents[0].pancardno=req.body.documents.pancardno;
        object.documents[0].bankacno=req.body.documents.bankacno;
        object.documents[0].nomineeAdhno=req.body.documents.nomineeAdhno;
        console.log(req.body.date_of_birth);

        empCrud.doRegister(req,res,object);

    });



    empRoutes.post("/upload",(req,res)=>{

        console.log("trying to upload");
        upload.upload(req,res,function(err){
            if(err instanceof multer.MulterError){
                console.log(err);
            }else if(err){
                //console.log(req.file)
                res.json(err);
    
                
            }
            console.log("trying to upload file");
            res.json(upload.files);
    
     
        })
    }); 
    
    
module.exports=empRoutes;