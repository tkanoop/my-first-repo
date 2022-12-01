const mongoose=require("mongoose");

const employeeSchema = new mongoose.Schema({
    yourname : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    
    },
    password:{
        type:String,
        required:true
    }


})
// now we need to create collection
const Register= new mongoose.model("registers",employeeSchema);
module.exports=Register;
