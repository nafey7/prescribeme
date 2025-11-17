import React from 'react';
import AuthLayout from '../layout/AuthLayout';
import SignUpForm from '../auth/SignUpForm';

const SignUp: React.FC = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
