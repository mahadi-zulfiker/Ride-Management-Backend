import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  role: string;
  vehicleInfo?: { type: string; licensePlate: string };
  phone?: string;
  emergencyContact?: string;
}) => {
  const { email, password, name, role, vehicleInfo, phone, emergencyContact } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData: any = { email, password: hashedPassword, name, role, phone, emergencyContact };

  if (role === 'driver' && vehicleInfo) {
    userData.vehicleInfo = vehicleInfo;
    userData.isApproved = false;
    userData.isOnline = false;
  }

  const user = await User.create(userData);
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  if (user.role === 'driver' && !user.isApproved) {
    throw new Error('Driver not approved');
  }

  if (user.isBlocked) {
    throw new Error('Account is blocked');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return { user, token };
};