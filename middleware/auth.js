const jwt = require('jsonwebtoken')
const UserModel= require('../models/User')



const CheckUserAuth = async(req,res,next)=>{
    // console.log('not register')
    const{token}=req.cookies;
    // console.log(token)
    if(!token){
        req.flash('error','Unauthorize user please register !!!')
        return res.redirect('/')
    }else{
     const verify_token=jwt.verify(token, process.env.JWT_SECRET_KEY)
     const data= await UserModel.findOne({_id:verify_token.userId})
     req.data1=data;
     next()
    }
}


module.exports=CheckUserAuth