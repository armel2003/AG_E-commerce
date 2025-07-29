import React, { useState } from 'react';
import RegisterForm from './RegisterForm';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <>

        <RegisterForm onSwitchToLogin={switchToLogin} />  
    </>
  );
};

export default AuthForm;
