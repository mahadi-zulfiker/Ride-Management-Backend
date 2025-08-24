import Ride from './ride.model';
import User from '../user/user.model';

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export const estimateFare = (pickup: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
  const distance = haversine(pickup.latitude, pickup.longitude, destination.latitude, destination.longitude);
  return distance * 5; // Assume 5 units per km
};

export const requestRide = async (riderId: string, pickup: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }, paymentMethod: string) => {
  const rider = await User.findById(riderId);
  if (!rider || rider.isBlocked) {
    throw new Error('Invalid or blocked rider');
  }

  const distance = haversine(pickup.latitude, pickup.longitude, destination.latitude, destination.longitude);
  const fare = distance * 5;

  const ride = await Ride.create({
    rider: riderId,
    pickupLocation: pickup,
    destinationLocation: destination,
    paymentMethod,
    distance,
    fare,
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
  ride.updatedAt = new Date();
  await ride.save();
  return ride;
};

export const getRiderHistory = async (riderId: string, filter: any = {}, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const rides = await Ride.find({ ...filter, rider: riderId }).skip(skip).limit(limit).populate('driver');
  const total = await Ride.countDocuments({ ...filter, rider: riderId });
  return { rides, total, pages: Math.ceil(total / limit) };
};

export const getAllRides = async (filter: any = {}, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const rides = await Ride.find(filter).skip(skip).limit(limit).populate('rider driver');
  const total = await Ride.countDocuments(filter);
  return { rides, total, pages: Math.ceil(total / limit) };
};

export const getAvailableRides = async () => {
  return await Ride.find({ status: 'requested', driver: null }).populate('rider');
};

export const getCurrentRide = async (userId: string, role: string) => {
  const query: any = (role === 'rider') ? { rider: userId } : { driver: userId };
  query.status = { $in: ['accepted', 'picked_up', 'in_transit'] };
  return await Ride.findOne(query).populate('rider driver');
};