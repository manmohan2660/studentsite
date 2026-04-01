import mongoose, { Document, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Onboarding fields
  userType?: 'college' | 'govt-exam' | 'skill-learner';
  
  // College student fields
  course?: 'btech' | 'bca' | 'mba' | 'bba' | 'bsc' | 'ba' | 'other';
  branch?: 'cse' | 'ece' | 'mechanical' | 'civil' | 'it' | 'electrical' | 'other';
  
  // Govt exam aspirant fields
  examTarget?: 'upsc' | 'ssc' | 'banking' | 'railway' | 'gate' | 'other';
  
  // Skill learner fields
  learningGoal?: 'web-dev' | 'devops' | 'ai-ml' | 'dsa' | 'mobile-dev' | 'cloud' | 'other';
  
  // Additional fields
  onboardingCompleted: boolean;
  preferences?: {
    emailNotifications?: boolean;
    language?: string;
  };

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Onboarding fields
    userType: {
      type: String,
      enum: ['college', 'govt-exam', 'skill-learner'],
      default: null,
    },
    course: {
      type: String,
      enum: ['btech', 'bca', 'mba', 'bba', 'bsc', 'ba', 'other'],
      default: null,
    },
    branch: {
      type: String,
      enum: ['cse', 'ece', 'mechanical', 'civil', 'it', 'electrical', 'other'],
      default: null,
    },
    examTarget: {
      type: String,
      enum: ['upsc', 'ssc', 'banking', 'railway', 'gate', 'other'],
      default: null,
    },
    learningGoal: {
      type: String,
      enum: ['web-dev', 'devops', 'ai-ml', 'dsa', 'mobile-dev', 'cloud', 'other'],
      default: null,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const { password, ...rest } = this.toObject();
  return rest;
};

export default mongoose.models.User ||
  mongoose.model<IUser>('User', userSchema);
