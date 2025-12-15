// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose, { Schema } from "mongoose";

/**
 * Define the Mongoose Schema for a User.
 */
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  location: String,
  description: String,
  occupation: String,
  login_name: String, 
  password: String, 
  favorited_photos: [{
    photo_id: { type: Schema.Types.ObjectId, ref: 'Photo' }, 
    favorited_at: { type: Date, default: Date.now }
  }],
  // Stores the id of all photos that a user liked 
  liked_photos: [mongoose.Schema.Types.ObjectId],
  last_activity: String,
  context_of_last_activity: String
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
export default User;
