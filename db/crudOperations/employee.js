const Emp=require("../schemas/empSchema");
const Uid=require("uuid/v1");
const fs=require("fs");
const path=require("path");


// console.log(path.join(__dirname,'../../docUploads/policeVerification'));
// console.log(__dirname);

const empCrud={

    doLogin(req,res){
        
        console.log('came here later');
        Emp.findOne(object,(err,data)=>{
            if(err){
                res.json(err);
            }
            else{
                res.json(data);
            }
        });
    },

    doRegister(req,res,object){

        object.id=Uid();


       /*var img1path=path.join(__dirname,'../../docUploads/policeVerification ')+req.body.mobile_no+'.png';
       console.log(img1path);
       object.policeVerificationImg.data=fs.readFileSync(img1path);             //file reading from disk 
       object.policeVerificationImg.contentType='image/png';

       var img2path=path.join(__dirname,'../../docUploads/panCardPhoto ')+req.body.mobile_no+'.png';
       object.panCardPhoto.data=fs.readFileSync(img2path);
       object.panCardPhoto.contentType='image/png';
       if(object.panCardPhoto.data==null||object.policeVerificationImg==null){    //checking if files exist on disk or not
           var error="File not uploaded";
       }*/


       console.log('req is here'); 
       console.log(object.id);
        //method to create objeccts in db
        Emp.create(object,(err)=>{
            /*if(error!=null){   //file exist validation
                res.json(error);
            }*/
            if(err){
                res.json(err);            }   //error while uploading data to db
            else{
                res.json('true');
            }    
            
            });
    },

 

}




module.exports=empCrud;