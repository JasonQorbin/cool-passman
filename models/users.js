const mongoose = require('mongoose');

const authorisationSchema = mongoose.Schema(
    {
        orgID : {
            type: mongoose.ObjectId,
            required: true
        },
        deptID: mongoose.ObjectId
    }
)


const userSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            trim : true,
            required : true
        },
        lastName : {
            type : String,
            trim : true,
            required : true
        },
        email : {
            type : String,
            trim : true,
            unique : true,
            required : true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password : {
            type : String,
            required : true
        },
        position : String,
        role : {
            type : String,
            required : true,
            default : "user"
        },
        authorised_repos : [ authorisationSchema ]
    }
);

const userModel = mongoose.model("users", userSchema);

module.exports.userModel = userModel;
