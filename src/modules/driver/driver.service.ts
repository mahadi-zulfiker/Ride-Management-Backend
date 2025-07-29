import User from '../user/user.model';
import Ride from '../ride/ride.model';

export const setAvailability = async (userId: string, isOnline: boolean) => {
  const user = await User.findById(userId);
  if (!user || user.role !== 'driver') {
    throw new Error('Driver not found');
  }
  if (!user.isApproved) {
    throw new Error('Driver not approved');
  }
  user.isOnline = isOnline;
  await user.save();
  return user;
};

export const approveDriver = async (driverId: string) => {
  const driver = await User.findById(driverId);
  if (!driver || driver.role !== 'driver') {
    throw new Error('Driver not found');
  }
  driver.isApproved = true;
  await driver.save();
  return driver;
};

export const getEarnings = async (driverId: string) => {
  const rides = await Ride.find({ driver: driverId, status: 'completed' });
  const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
  return { rides, totalEarnings };
};