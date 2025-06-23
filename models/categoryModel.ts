import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name:    { type: String, required: true },
  parent:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  status:  { type: Boolean, default: true },
  image:   { type: String }, // <-- image URL from Vercel Blob
});
export default models.Category || model('Category', CategorySchema);