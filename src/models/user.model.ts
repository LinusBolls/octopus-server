import { randomUUID } from "crypto";

import { model, Schema } from "mongoose";

const userProperties = {
  _id: { type: String, default: randomUUID },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  name: String,
};
const userSchema = new Schema(userProperties);

const User = model("User", userSchema);

export default User;
export { userProperties, userSchema };
