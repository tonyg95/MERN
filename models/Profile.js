const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    location:{
        type:String
    },
    experience: [
        {
            place: {
                type: String
            },
            location: {
                type: String
            }
        }
    ]
});
module.exports = Profile = mongoose.model('profile',ProfileSchema);