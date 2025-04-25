const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

// MongoDB automatically delete document after `expiresAt` is passed
module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);