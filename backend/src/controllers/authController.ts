import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Login failed' });
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
