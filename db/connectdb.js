const mongoose=require('mongoose')
const connectDB=()=>{
    return mongoose.connect(process.env.DB_URL  )
   .then(()=>{
    console.log('connection Successfull')
   }).catch((err)=>{
    console.log(err)
   })
}

module.exports=connectDB