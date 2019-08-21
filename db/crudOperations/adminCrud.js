const admin=require('../schemas/adminLoginSchema');
const empCrud= require('../schemas/empSchema');
const delBoy=require('../schemas/delBoySchema');
const delModel=require('../../models/setterGetter/delBoy.model');


const adminCrud={
async login(res,object){
    var user=await admin.findOne({'id':object.id,'name':object.name})
       if(user!=null){  
         if(object.password == user.password){
          console.log('we were here 222');
    return new Promise((resolve,reject)=>{
      resolve(user);
    
    }) 
}}},

getUnverifiedEmployees(res){
empCrud.find({isVerified:false},(err,users)=>{
  if(err){
res.json({'error':err});
  }
  else{
      
      res.json({'users':users});
  }
})
}
,
getVerifiedEmployees(res){
    empCrud.find({isVerified:true},(error,users)=>{
      if(error){
    res.json({'error':error});
      }
      else{
          res.json({'users':users});
      }
    })
    }
    ,
   verifyEmployee(id,res){
        empCrud.findOne({id:id},(error,user)=>{
          if(error){
        res.json({'error':error});
          }
          else{
              user.isVerified=true;
             //create tuple in delboy collection if verified
              if(user.typeEmployee=="delivery_Man"){
                let obj=new delModel();
                obj.empId=id;
                obj.verified=true;
                obj.location.coordinates=[0,0];
                delBoy.findOne({empId:id},(err,doc)=>{
                  if(doc){
                    delBoy.findOneAndUpdate({empId:id},{verified:true},(err)=>{
                      if(err){
                        console.log("some error occured during database query");
                     }
                    })
                  }
                  else{
                    delBoy.create(obj,(err)=>{
                      if(err){
                        console.log("some error occured during delBoy creation",err);
                      }
                    })
                  }
                })
                
              } 
              user.save((err)=>{
                if(err){
                  console.log("some error occured during database query");
              }
              else{
                
                res.json({'isVerified':true})
              }  
              })
             
          }
        })
        } 
        ,
        unVerifyEmployee(id,res){
          empCrud.findOne({id:id},(error,user)=>{
            if(error){
          res.json({'error':error});
            }
            else{
                user.isVerified=false;

                //set verified field from delboy collection if unverified
                if(user.typeEmployee=="delivery_Man"){
                  delBoy.findOneAndUpdate({empId:id},{verified:false},(err)=>{
                    if(err){
                      console.log("some error occured during database query");
                   }
                  })
                }
               
                user.save((err)=>{
                  if(err){
                    console.log("some error occured during database query");
                }
                else{
                  
                  res.json({'isVerified':false})
                }  
                })
               
            }
          })
          } 
    }

module.exports = adminCrud;