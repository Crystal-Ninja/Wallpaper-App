import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true,
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
                    ref:"Image",
                }
        ],
        externalFavorites:[
            {
                externalId: String,
                url: String,
                thumb: String,
                author: String,
                title: String,
                source: { type: String, default: 'unsplash' },
                dateAdded: { type: Date, default: Date.now }
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