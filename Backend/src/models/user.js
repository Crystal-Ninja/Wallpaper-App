import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        passwordHash:{
            type:String,
            required:true,
            select:false,
        },
        favorites:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"image",
                }
        ],
        avatar: {
             type: String,
             default: ""
        }, 


    },    {timestamps:true}
)
userSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  }
});
export const User = mongoose.model("User", userSchema);