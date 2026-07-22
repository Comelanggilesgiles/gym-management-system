const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URL || 'mongodb://localhost:27017/coach';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const ensureDefaultUser = async (email, name, password, role) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });
};

const createDefaultUsers = async () => {
  try {
    await ensureDefaultUser('admin@coach.com', 'Admin User', process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 'admin');
    await ensureDefaultUser('user@coach.com', 'Client User', process.env.DEFAULT_CLIENT_PASSWORD || 'user123', 'client');
    console.log('Default admin and client users are ready.');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB connected');
    if (process.env.CREATE_DEFAULT_USERS === 'true') {
      await createDefaultUsers();
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err.message));

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  createdAt: { type: Date, default: Date.now },
});

const memberRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  middleInitial: { type: String, trim: true },
  age: { type: Number, required: true },
  address: { type: String, required: true, trim: true },
  cellPhone: { type: String, required: true, trim: true },
  civilStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
  emergencyContactName: { type: String, required: true, trim: true },
  emergencyContactPhone: { type: String, required: true, trim: true },
  contractAccepted: { type: Boolean, default: false },
  acceptedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const MemberRegistration = mongoose.model('MemberRegistration', memberRegistrationSchema);

const signupSchema = z.object({
  name: z.string().min(1).max(100).transform((value) => value.trim()),
  email: z.string().email().max(254).transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email().max(254).transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(128),
});

const memberRegistrationZodSchema = z.object({
  firstName: z.string().min(1).max(100).transform((value) => value.trim()),
  lastName: z.string().min(1).max(100).transform((value) => value.trim()),
  middleInitial: z.string().max(1).transform((value) => value.trim()).optional().default(''),
  age: z.coerce.number().int().min(13).max(120),
  address: z.string().min(5).max(200).transform((value) => value.trim()),
  cellPhone: z.string().min(7).max(30).transform((value) => value.trim()),
  civilStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  emergencyContactName: z.string().min(1).max(100).transform((value) => value.trim()),
  emergencyContactPhone: z.string().min(7).max(30).transform((value) => value.trim()),
});

const createToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Coach backend is running' });
});

// Check if email is available
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    
    res.json({ exists: !!existing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to check email.' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed.', errors: parsed.error.flatten() });
    }

    const { name, email, password } = parsed.data;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'client';

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = createToken(newUser);
    res.status(201).json({
      message: 'Account created successfully.',
      token,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create account.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user);
    res.json({
      message: 'Login successful.',
      token,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to login.' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ message: 'If the email exists, a reset link was sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to process request.' });
  }
});

app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load users.' });
  }
});

app.put('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, email } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (name) updates.name = name;
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
      if (existing) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
      updates.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, select: 'name email role createdAt' });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update user.' });
  }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete user.' });
  }
});

app.get('/api/dashboard', authMiddleware, async (req, res) => {
  const { role, name } = req.user;
  if (role === 'admin') {
    return res.json({
      role,
      name,
      dashboardType: 'admin',
      stats: {
        totalMembers: 218,
        activePlans: 134,
        weeklyCheckIns: 492,
        pendingApprovals: 6,
      },
      actions: [
        'Review membership approvals',
        'Manage workout plans',
        'Inspect client progress',
        'Update gym announcements',
      ],
    });
  }

  res.json({
    role,
    name,
    dashboardType: 'client',
    profile: {
      currentPlan: 'Strength & Conditioning',
      nextWorkout: 'Leg day HIIT',
      workoutsThisWeek: 4,
      goalCompletion: 67,
    },
    recommended: [
      'Book a personal training session',
      'Complete today�s cardio challenge',
      'Track water intake in your journal',
    ],
  });
});

// Member Registration Endpoints
app.post('/api/member-registration', authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleInitial,
      age,
      address,
      cellPhone,
      civilStatus,
      emergencyContactName,
      emergencyContactPhone,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !age || !address || !cellPhone || !civilStatus || !emergencyContactName || !emergencyContactPhone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if registration already exists
    const existing = await MemberRegistration.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(409).json({ message: 'Member registration already exists.' });
    }

    const registration = await MemberRegistration.create({
      userId: req.user.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleInitial: middleInitial?.trim() || '',
      age: Number(age),
      address: address.trim(),
      cellPhone: cellPhone.trim(),
      civilStatus,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      contractAccepted: true,
      acceptedAt: new Date(),
    });

    res.status(201).json({
      message: 'Member registration completed successfully.',
      registration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to save registration.' });
  }
});

// Get member registration (client can view own, admin can view all)
app.get('/api/member-registration/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Clients can only view their own registration
    if (req.user.role === 'client' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const registration = await MemberRegistration.findOne({ userId });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    res.json({ registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch registration.' });
  }
});

// Get all registrations (admin only)
app.get('/api/member-registrations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const registrations = await MemberRegistration.find()
      .populate('userId', 'name email createdAt')
      .sort({ acceptedAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch registrations.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
