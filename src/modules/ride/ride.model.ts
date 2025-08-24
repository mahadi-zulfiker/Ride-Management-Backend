import { Schema, model } from 'mongoose';

const rideSchema = new Schema({
  rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  destinationLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'canceled'],
    default: 'requested'
  },
  fare: { type: Number, default: 0 },
  distance: { type: Number },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

export default model('Ride', rideSchema);