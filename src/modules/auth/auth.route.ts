import { Router } from 'express';
import { registerController, loginController } from './auth.controller';
import User from '../user/user.model';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);

// Test route to create a test user
router.post('/create-test-user', async (req, res) => {
  try {
    // First try to delete existing test user if any
    await User.deleteOne({ email: 'karma1@gmail.com' });
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      email: 'karma1@gmail.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'rider',
      isApproved: true,
      isBlocked: false
    });
    res.json({ message: 'Test user created successfully', user: { email: testUser.email, name: testUser.name, role: testUser.role } });
  } catch (error: any) {
    console.log('Create test user error:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;