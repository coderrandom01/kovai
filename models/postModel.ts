import mongoose, { Schema, model, models } from 'mongoose';
const ListingSchema = new Schema({
  title:           { type: String, required: true },
  description:     { type: String },
  images:          [String],            // allow multiple
  price:           Number,
  display_price:   Number,
  discount_price:  Number,
  top_selling:     Boolean,
  clearance_sale:  Boolean,
  status: Boolean,
category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: true,
}});

export default models.Listing || model('Listing', ListingSchema);