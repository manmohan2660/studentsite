'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Branch mapping based on course
const COURSE_BRANCHES: Record<string, string[]> = {
  btech: ['CSE', 'Electronics & Communication', 'Mechanical', 'Civil', 'Information Technology', 'Electrical', 'Aerospace', 'Biomedical', 'Chemical'],
  bca: ['General', 'Artificial Intelligence', 'Data Science', 'Cybersecurity'],
  mba: ['Marketing', 'Finance', 'Human Resources', 'Operations', 'Entrepreneurship', 'International Business'],
  bba: ['Marketing', 'Finance', 'Human Resources', 'Operations', 'Entrepreneurship'],
  bsc: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics'],
  ba: ['Economics', 'History', 'Political Science', 'Psychology', 'Sociology', 'English'],
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'account' | 'onboarding'>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string>('');

  // Account form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Onboarding state
  const [onboarding, setOnboarding] = useState({
    userType: '',
    course: '',
    branch: '',
    examTarget: '',
    learningGoal: '',
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnboardingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnboarding((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      setUserId(data.userId);
      setStep('onboarding');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!onboarding.userType) {
      setError('Please select a user type');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userType: onboarding.userType,
          ...(onboarding.userType === 'college' && {
            course: onboarding.course,
            branch: onboarding.branch,
          }),
          ...(onboarding.userType === 'govt-exam' && {
            examTarget: onboarding.examTarget,
          }),
          ...(onboarding.userType === 'skill-learner' && {
            learningGoal: onboarding.learningGoal,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Onboarding failed');
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              📚
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {step === 'account' ? 'Create Account' : 'Complete Profile'}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 'account'
              ? 'Join LearnerHub and unlock your potential'
              : 'Tell us about your learning goals'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-3 mb-8">
          <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${step === 'account' ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${step === 'onboarding' ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-shake">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        {/* Account Form */}
        {step === 'account' && (
          <form onSubmit={handleAccountSubmit} className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleAccountChange}
                placeholder="John Doe"
                disabled={loading}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleAccountChange}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleAccountChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75"
              />
              <p className="text-xs text-gray-500 mt-2">At least 6 characters required</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleAccountChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        )}

        {/* Onboarding Form */}
        {step === 'onboarding' && (
          <form onSubmit={handleOnboardingSubmit} className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div>
              <label htmlFor="userType" className="block text-sm font-semibold text-gray-700 mb-3">
                What best describes you?
              </label>
              <select
                id="userType"
                name="userType"
                value={onboarding.userType}
                onChange={handleOnboardingChange}
                disabled={loading}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75 text-gray-700"
              >
                <option value="">Select your profile</option>
                <option value="college">College Student</option>
                <option value="govt-exam">Govt Exam Aspirant</option>
                <option value="skill-learner">Skill Learner</option>
              </select>
            </div>

            {/* College Student Fields */}
            {onboarding.userType === 'college' && (
              <>
                <div>
                  <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-3">
                    Course
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={onboarding.course}
                    onChange={handleOnboardingChange}
                    disabled={loading}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75 text-gray-700"
                  >
                    <option value="">Select course</option>
                    <option value="btech">BTech</option>
                    <option value="bca">BCA</option>
                    <option value="mba">MBA</option>
                    <option value="bba">BBA</option>
                    <option value="bsc">BSc</option>
                    <option value="ba">BA</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-3">
                    Branch/Stream
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={onboarding.branch}
                    onChange={handleOnboardingChange}
                    disabled={loading}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75 text-gray-700"
                  >
                    <option value="">Select branch</option>
                    <option value="cse">Computer Science</option>
                    <option value="ece">Electronics & Communication</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="civil">Civil</option>
                    <option value="it">Information Technology</option>
                    <option value="electrical">Electrical</option>
                  </select>
                </div>
              </>
            )}

            {/* Govt Exam Fields */}
            {onboarding.userType === 'govt-exam' && (
              <div>
                <label htmlFor="examTarget" className="block text-sm font-semibold text-gray-700 mb-3">
                  Target Exam
                </label>
                <select
                  id="examTarget"
                  name="examTarget"
                  value={onboarding.examTarget}
                  onChange={handleOnboardingChange}
                  disabled={loading}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75 text-gray-700"
                >
                  <option value="">Select target exam</option>
                  <option value="upsc">UPSC (IAS/IPS)</option>
                  <option value="ssc">SSC (CGL/CHSL)</option>
                  <option value="banking">Banking (IBPS/SBI)</option>
                  <option value="railway">Railway</option>
                  <option value="gate">GATE</option>
                </select>
              </div>
            )}

            {/* Skill Learner Fields */}
            {onboarding.userType === 'skill-learner' && (
              <div>
                <label htmlFor="learningGoal" className="block text-sm font-semibold text-gray-700 mb-3">
                  Learning Goal
                </label>
                <select
                  id="learningGoal"
                  name="learningGoal"
                  value={onboarding.learningGoal}
                  onChange={handleOnboardingChange}
                  disabled={loading}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-gray-50 focus:bg-white disabled:opacity-75 text-gray-700"
                >
                  <option value="">Select learning goal</option>
                  <option value="web-dev">Web Development</option>
                  <option value="devops">DevOps</option>
                  <option value="ai-ml">AI/Machine Learning</option>
                  <option value="dsa">Data Structures & Algorithms</option>
                  <option value="mobile-dev">Mobile Development</option>
                  <option value="cloud">Cloud Computing</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Setting Up Profile...
                </span>
              ) : (
                'Complete & Go to Dashboard'
              )}
            </button>
          </form>
        )}

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
