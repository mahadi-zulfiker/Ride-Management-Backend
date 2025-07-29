import Ride from './ride.model';
import User from '../user/user.model';

export const requestRide = async (riderId: string, pickup: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
  const rider = await User.findById(riderId);
  if (!rider || rider.isBlocked) {
    throw new Error('Invalid or blocked rider');
  }

  const ride = await Ride.create({
    rider: riderId,
    pickupLocation: pickup,
    destinationLocation: destination,
    statusHistory: [{ status: 'requested' }]
  });

  return ride;
};

export const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new Error('Ride not found');
  }
  if (ride.rider.toString() !== riderId) {
    throw new Error('Unauthorized');
  }
  if (ride.status !== 'requested') {
    throw new Error('Cannot cancel ride after acceptance');
  }
  const timeDiff = (new Date().getTime() - ride.createdAt.getTime()) / 1000 / 60;
  if (timeDiff > 5) {
    throw new Error('Cancellation window expired');
  }

  ride.status = 'canceled';
  ride.statusHistory.push({ status: 'canceled' });
  await ride.save();
  return ride;
};

export const acceptRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride || ride.status !== 'requested') {
    throw new Error('Ride not available');
  }

  const driver = await User.findById(driverId);
  if (!driver || driver.role !== 'driver' || !driver.isApproved || !driver.isOnline) {
    throw new Error('Invalid or unavailable driver');
  }

  const activeRide = await Ride.findOne({ driver: driverId, status: { $in: ['accepted', 'picked_up', 'in_transit'] } });
  if (activeRide) {
    throw new Error('Driver already has an active ride');
  }

  ride.driver = new (require('mongoose').Types.ObjectId)(driverId);
  ride.status = 'accepted';
  ride.statusHistory.push({ status: 'accepted' });
  await ride.save();
  return ride;
};

type RideStatus = 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'canceled';

export const updateRideStatus = async (rideId: string, driverId: string, status: RideStatus) => {
  const validStatuses: RideStatus[] = ['picked_up', 'in_transit', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const ride = await Ride.findById(rideId);
  if (!ride || ride.driver?.toString() !== driverId) {
    throw new Error('Ride not found or unauthorized');
  }

  if (ride.status === 'canceled' || ride.status === 'completed') {
    throw new Error('Ride cannot be updated');
  }

  ride.status = status;
  ride.statusHistory.push({ status });
  if (status === 'completed') {
    ride.fare = Math.random() * 100;
  }
  await ride.save();
  return ride;
};

export const getRiderHistory = async (riderId: string) => {
  return await Ride.find({ rider: riderId }).populate('driver');
};

export const getAllRides = async () => {
  return await Ride.find().populate('rider driver');
};