import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks';
import { z } from 'zod';
import Card from '../common/Card';
import { Input, Button } from '../common';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>(
    loginSchema
  );

  const onSubmit = async (formData: Record<string, any>) => {
    try {
      const data = formData as LoginFormData;
      // TODO: Call API to login
      console.log('Login attempt:', data);

      // Mock successful login
      setUser({
        id: '1',
        email: data.email,
        name: 'John Doe',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'mock-token-12345');

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <Card title="Login" className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            register={register('email')}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;
