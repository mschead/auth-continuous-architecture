const mongoose = require('mongoose');

const NDCSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  moment: {
    type: Date,
    default: Date.now,
    require: true,
  },
  data: {
    type: String
  }
});

const NDC = mongoose.model('NDC', NDCSchema);

module.exports = { NDC };