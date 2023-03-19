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
    required: true,
    type: String,
    default:""
  },
  leetcode:{
    required: true,
    type: String,
    default:""
  },
  codechef:{
    required: true,
    type: String,
    default:""
  },
  github:{
    required: true,
    type: String,
    default:""
  }

})
// module.exports = UserSchema;
module.exports = mongoose.model('Data', UserSchema);