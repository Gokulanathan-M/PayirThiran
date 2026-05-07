import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateEmail, validatePassword } from '../../utils/validators';
import toast from 'react-hot-toast';

export default function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!validateEmail(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h2>
      <p className="text-sm text-gray-500 text-center">Sign in to access your dashboard</p>

      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
             placeholder="you@example.com" error={errors.email} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
             placeholder="••••••••" error={errors.password} />

      <Button type="submit" className="w-full" loading={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-green-600 font-medium hover:underline">Register</Link>
      </p>
    </form>
  );
}
