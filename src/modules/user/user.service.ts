import User from './user.model';

export const getAllUsers = async () => {
  return await User.find().select('-password');
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