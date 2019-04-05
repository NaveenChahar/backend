const express=require('express');
const adminRoutes=express.Router();
const logger=require('../../Utils/winstonLogger');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const nullChecker=require('../../Utils/nullChecker');

const upload=require('../../Utils/multer/commonExcelUpload');    //requiring multer for excel upload
const upload2=require('../../Utils/multer/productImagess3');   //requiring multer s3 for image upload
const singleUpload=upload.single('productupload');        
const securekey ='Imsecure';          //secret key of webtokens
const productCrud=require('../../db/crudOperations/Product'); 
const adminCrud=require('../../db/crudOperations/adminCrud');
const s3=require('../../Utils/multer/getImageFiles');

adminRoutes.post('/upload',function(req,res){
    /* dont mess with multer the req above and below are not even same*/
    var exceltojson; //Initialization
    singleUpload(req,res,function(err){
        //jwt.verify(req.body.idToken,securekey,(error,authData)=>{     //checking if token is present or not
            //if(error){
            //    res.json("session timed out");
            //}
            //else{
        if(err instanceof multer.MulterError){
            console.log(err);
        }else if(err){
            //console.log(req.file)
            res.json(err);    
        }
        console.log(req.file);
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }

        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                } 
                if(result!=null){
                   // productCrud.uploadProducts(req,res,result);
                    console.log(result);
                }
                //productCrud.uploadProducts(req,res,obj);
                // result.forEach(obj=>{
                //     productCrud.uploadProducts(req,res,obj);                         //pushing objects to db after traversing
                // })
                
                //res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    //}
    //})
    })

        
   // })
    
});

adminRoutes.post('/getImagesUrl',(req,res)=>{
    let returnImagesArray={};
    for(let key of req.body.keyArray){
        console.log(key+' '+req.body.mobile_no+'.png',req.body.keyArray)
 let params={Bucket:'big-basket-bucket',Key:key+' '+req.body.mobile_no+'.png'}; //seconds

 s3.getObject(params,(url)=>{
    if(url!=null){
        console.log(url);
        returnImagesArray[key]=url;
    }
});
 
}
res.json({'Images':returnImagesArray});
}
)

adminRoutes.post('/editProducts',verifyToken,(req,res)=>{
    jwt.verify(req.token,securekey,(error,authData)=>{
        if(error){
            res.json("token not valid or session timed out");
        }
        else{
            //console.log("its here");
            nullChecker.check(req.body.products,res);
            productCrud.editProducts(req,res);
        }
    })
    
})

adminRoutes.post('/editCategoryList',verifyToken,(req,res)=>{
    jwt.verify(req.token,securekey,(error,authData)=>{
        if(error){
            res.json("token not valid or session timed out");
        }
        else{
            nullChecker.check(req.body.categorylist,res);
            productCrud.uploadProducts(req,res,req.body.categorylist);
        }
    })
})

adminRoutes.post('/imageUpload',(req,res)=>{
    
            upload2(req,res,function(err){
                jwt.verify(req.body.idToken,securekey,(error,authData)=>{
                    if(error){
                        res.json("token not valid or session timed out");
                    }
                    else{
                    if(err){
                    res.json("multer s3 error");
                    }
                    else{
                    //push url to db
                    nullChecker.check(req.files,res);
                    var obj={"uri":req.files.location};
                    productCrud.imageUpload(req,res,obj);
                }
            }
                })
            })
        
    
})


adminRoutes.post('/login',function(req,res){
    var adminData=adminCrud.login(res,{'id':req.body.id, 'name':req.body.name, 'password':req.body.password});
    console.log(adminData);
   if(adminData!=null){
    console.log('we were here 1');
        jwt.sign({adminData},securekey,{expiresIn:'3000s'},(err,token)=>{ 
            console.log(token);            //token is generated after checking the presence of user
        res.json({
            token:token
        })
    })
}})
adminRoutes.get('/getUnverifiedEmployee',(req,res)=>{
    adminCrud.getUnverifiedEmployees(res);
})


adminRoutes.get('/getVerifiedEmployee',(req,res)=>{
    adminCrud.getVerifiedEmployees(res);
})

adminRoutes.post('/verifyUser',(req,res)=>{
    adminCrud.verifyEmployee(req.body.id,res);
})
adminRoutes.post('/unVerifyUser',(req,res)=>{
    adminCrud.unVerifyEmployee(req.body.id,res);
})


function verifyToken(req,res,next){               //checking for webtoken in the header of req and filling it into req.token
    let bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader!= 'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token= bearerToken;
    next();
    
    }else{
        res.sendStatus(403);
    }
}






module.exports=adminRoutes;