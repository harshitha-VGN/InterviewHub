const mongoose=require('mongoose');
// to connect with our data base to save the data entered through our signup page 
const bcrypt=require('bcryptjs');

// to hash our passowrds securely 
const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Please provide a username"],
            unique:true,
        },
        email:{
            type:String,
            required:[true,"Please provide an email"],
            unique:true,
            match:[/\S+@\S+\.\S+/,"Please provide a valid email"],
        },
        password:{
                type:String,
                required:[true,"Please provide a password"],
                minlength:8,
        },
         bio: {
        type: String,
        default: 'Aspiring Software Engineer.', 
    },
    goals: {
        type: String,
        default: 'To build amazing applications that help people.', // A nice default value
    }
    });

// basically i have created a blueprint the SCHEMA this defines the struture ,data types and rules for every user 
// that is user must have an email ,password,and pssword should be of 8 characters only 

// now e have to hash our passsword 
userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        return next();
    } //this will check if password field was changed 
    // if the user is just udating the email we don't eant to re-hh their already hashed-password the if statement skips the hasjing logic in that case 

        // we will create a salt taht gets mixed in the password before hashing This ensures that even if two users have the same password, their stored hashes will be completely different, making them much more secure against common attacks.
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();

});
// this is the function that tells mongoose to run this function first before the user saves 

// now we have to compare psswords if they match then the user gets logged in 
userSchema.methods.comparePassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};
const User=mongoose.model('User',userSchema);
module.exports=User;