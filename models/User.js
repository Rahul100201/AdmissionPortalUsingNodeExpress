const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    
    name:{
        type:String,
        Requiured:true
    },
    email:{
        type:String,
        Requiured:true
    },
    password:{
            type:String,
            require:true
    },
    role:{
        type:String,
        default:'user'
    }
},{timestamps:true})

const UserModel=mongoose.model('userss',UserSchema)

module.exports=UserModel 







