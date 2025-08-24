import User from './user.model';
import bcrypt from 'bcrypt';
import Ride from '../ride/ride.model';

export const getAllUsers = async (filter: any = {}, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find(filter).select('-password').skip(skip).limit(limit);
  const total = await User.countDocuments(filter);
  return { users, total, pages: Math.ceil(total / limit) };
};

export const blockUser = async (userId: string, block: boolean) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.isBlocked = block;
  await user.save();
  return user;
};

export const updateProfile = async (userId: string, data: { name?: string; phone?: string; emergencyContact?: string; vehicleInfo?: { type: string; licensePlate: string } }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (data.name) user.name = data.name;
  if (data.phone) user.phone = data.phone;
  if (data.emergencyContact) user.emergencyContact = data.emergencyContact;
  if (data.vehicleInfo && user.role === 'driver') user.vehicleInfo = data.vehicleInfo;
  await user.save();
  return user;
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Invalid old password');
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: 'Password changed' };
};

export const getAnalytics = async () => {
  const rideVolume = await Ride.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const revenueTrends = await Ride.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, revenue: { $sum: "$fare" } } },
    { $sort: { _id: 1 } }
  ]);

  const driverActivity = await Ride.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: "$driver", count: { $sum: 1 }, revenue: { $sum: "$fare" } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'driver' } },
    { $unwind: '$driver' },
    { $project: { name: '$driver.name', count: '$count', revenue: '$revenue' } },
    { $sort: { revenue: -1 } }
  ]);

  return { rideVolume, revenueTrends, driverActivity };
};