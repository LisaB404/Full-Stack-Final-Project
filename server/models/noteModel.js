const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    book: {
      id: { type: String },
      title: { type: String },
      authors: [{ type: String }],
      thumbnail: { type: String },
    } || null,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
