const multer=require('multer');
const path=require('path');

const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: "l77HwY6WS3M/2Qkb/aNC/eDrRuDctgekHNKycZ2q",
  accessKeyId: "AKIAI6HMDYHPRXVZZSBA",
  region: "ap-south-1"
});

const s3 = new aws.S3();

var files={
    //  policeVerification:false,
    //  adharCard:false,
    //  gST:false,
    //  nomineePhoto:false,
    //  panCardPhoto:false,
     mobile_no:null,
     //referralCode:null,
     id:null,
     imageUrls:[{
       policeVerification:null,
     }, 
     {
       adharCard:null,
     },
     {
       gST:null
     },
     {
       nomineePhoto:null
     },
     {
       cancelCheque:null
     },
     {
       panCardPhoto:null
     }
    ],

};

function checkFileType(file,cb){
  const filetypes =/jpeg|png|jpg|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if(extname && mimetype){
      return cb(null,true)
  }else{
      return cb('error message');
  }
  }


  const upload = multer({
  storage:multerS3({
    s3: s3,
    bucket: "big-basket-bucket",
    acl: 'public-read-write',
    metadata: function(req, file, cb){
        cb(null, {fieldName: file.fieldname});
    },
    key: function(req, file, cb){
      //files[file.fieldname]=true;
      files.mobile_no=req.body.mobile_no;
        cb(null,file.fieldname +' '+req.body.mobile_no+ path.extname(file.originalname));  }
  }),
//  limits:{fileSize:1000000000},
//  fileFilter:function(res,file,cb){
//       checkFileType(file,cb)
//   }
}).fields([
{
  name:'policeVerification'
},
{
  name:'adharCard'
},
{
  name:'gST'
},
{
  name:'nomineePhoto'
},{
  name:'panCardPhoto'
},
{
  name:'cancelCheque'
}
]);

/*const storage= multerS3({
      s3: s3,
      bucket: 'some-bucket',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname +' '+req.body.mobile_no+ path.extname(file.originalname)});
      },
      key: function (req, file, cb) {
        cb(null,file.fieldname +' '+req.body.mobile_no+ path.extname(file.originalname) );
      }
    })
    */
  
  
module.exports={
  "upload":upload,
  "files":files
};
