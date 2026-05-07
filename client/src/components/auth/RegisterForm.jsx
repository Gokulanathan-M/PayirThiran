import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateEmail, validatePassword } from '../../utils/validators';

export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!validateEmail(form.email)) errs.email = 'Invalid email address';
    if (!validatePassword(form.password)) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({ name: form.name, email: form.email, password: form.password });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>
      <p className="text-sm text-gray-500 text-center">Start getting smart crop recommendations</p>

      <Input label="Full Name" value={form.name} onChange={set('name')}
             placeholder="John Doe" error={errors.name} />
      <Input label="Email" type="email" value={form.email} onChange={set('email')}
             placeholder="you@example.com" error={errors.email} />
      <Input label="Password" type="password" value={form.password} onChange={set('password')}
             placeholder="Min 8 chars, 1 uppercase, 1 number" error={errors.password} />
      <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
             placeholder="Re-enter password" error={errors.confirmPassword} />

      <Button type="submit" className="w-full" loading={loading}>
        {loading ? 'Creating account…' : 'Register'}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-green-600 font-medium hover:underline">Sign In</Link>
      </p>
    </form>
  );
}
