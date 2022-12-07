const jwt = require('jsonwebtoken')
const UserModel= require('../models/User')

const AuthRole = (roles)=>{
    return (req,res,next)=>{
        //console.log(req.data1.role)
        if(!roles.includes(req.data1.role)){
            return next(res.redirect('/dashboard'))
            
        }
        next()
    }
}

module.exports=AuthRole