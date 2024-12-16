const mongoose = require('mongoose');

const DeletedAccountSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reason: { type: String, required: true },
  deletedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DeletedAccount', DeletedAccountSchema);
