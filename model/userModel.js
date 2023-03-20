const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  codeforces:{
    type: String,
    default:""
  },
  leetcode:{
    type: String,
    default:""
  },
  codechef:{
    type: String,
    default:""
  },
  github:{
    type: String,
    default:""
  }

})
// module.exports = UserSchema;
module.exports = mongoose.model('Data', UserSchema);