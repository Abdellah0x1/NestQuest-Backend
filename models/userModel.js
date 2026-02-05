const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        required: true,
        minlength: 8,
        select: false,
        trim: true
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        validate: {
            validator: function(el){
                return el = this.password
            },
            message: 'passwords are not the same'
        },
        trim: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        select: false,
        default: true
    }
})

userSchema.pre('save',function(){
    if(!this.isModified('password') || this.isNew) return;
    this.passwordChangedAt = Date.now() - 1000;
    
})
//hashing password

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password, 12);

    //removing passwordConfirm
    this.passwordConfirm = undefined;
})

// ony show active users

userSchema.pre(/^find/, function(){
    this.find({active: {$ne: false}})
})

//instance function for validating password 
userSchema.methods.correctPassword = async function(condidatePass, userPass){
    return await bcrypt.compare(condidatePass,userPass);
}


//password change date verificaiton for protected routes

userSchema.methods.passwordChangedAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const passChangedAt = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return passChangedAt > JWTTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').toString('hex');
    // reset token expires in 10min
    this.passwordResetExpires = Date.now() + 10*60*1000;
    // console.log({resetToken}, this.passwordResetToken)
    return resetToken;
}


const User = mongoose.model('User',userSchema);

module.exports = User;