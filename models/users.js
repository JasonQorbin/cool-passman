const mongoose = required('mongoose');

const userModel = mongoose.Schema(
    {
        name : {
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
        }
        authorised_repos : [
            {
                orgID : {
                    type: mongoose.ObjectId,
                    required: true
                },
                deptID: mongoose.ObjectId
            }
        ]
    }
);

module.exports.userModel = userModel;
