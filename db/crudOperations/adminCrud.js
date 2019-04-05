const admin=require('../schemas/adminLoginSchema');
const empCrud= require('../schemas/empSchema');


const adminCrud={
async login(res,object){
    var data=await admin.findOne({'name':object.name},function(err,user){
      console.log('we were here',user);
        if(err){
            data=null;
        }else if(user!=null){
        
         if(object.password == user.password){
          console.log('we were here');
         data=user;
        }}
       
    })
    return data;
},
getUnverifiedEmployees(res){
empCrud.find({isVerified:false},(err,users)=>{
  if(err){
res.json({'error':err});
  }
  else{
      return users;
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