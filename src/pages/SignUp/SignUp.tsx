import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, useIonRouter } from "@ionic/react";
import IconInput from "../../components/icon-input";
import IconButton from "../../components/icon-button";
import EmailIcon from "../../../public/icon/email-icon";
import LockIcon from "../../../public/icon/lock-icon";
import EyeIcon from "../../../public/icon/eye-icon";
import { useAuth } from '../../contexts/authContext';
import { useHistory } from 'react-router-dom';

const SignUp: React.FC = () => {
  const router = useIonRouter();
  const { login } = useAuth();
  const history = useHistory();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (formData.password !== formData.password2) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://meal-u-api.nafisazizi.com:8001/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          password2: formData.password2,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.data);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent className="font-sans">
        <div className="max-w-6xl mx-auto flex flex-row items-center px-5 p-4 mb-4">
          {!isMobile && (
            <div className="flex-1 max-w-1/2 max-h-screen">
              <img
                src="/img/login-image.png"
                alt="signup image"
                className="h-[85vh] rounded-2xl"
              />
            </div>
          )}

          <div className="flex-1 px-4 py-4 md:py-0 md:px-10 flex flex-col items-start">
            <h2 className="text-3xl mb-2.5 font-bold">Sign Up</h2>
            {!isMobile && (
              <p className="mb-5">Welcome! Let's create your account 👋</p>
            )}

            {successMessage && (
              <p className="text-green-500 mb-4">{successMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-5">
                <IconInput
                  title="Email Address"
                  onInputHandleChange={handleChange('email')}
                  leftIcon={<EmailIcon />}
                  placeholder="Enter Email Address"
                  width="100%"
                  value={formData.email}
                />
              </div>

              <div className="mb-5">
                <IconInput
                  title="First Name"
                  onInputHandleChange={handleChange('first_name')}
                  placeholder="Enter First Name"
                  width="100%"
                  value={formData.first_name}
                />
              </div>

              <div className="mb-5">
                <IconInput
                  title="Last Name"
                  onInputHandleChange={handleChange('last_name')}
                  placeholder="Enter Last Name"
                  width="100%"
                  value={formData.last_name}
                />
              </div>

              <div className="mb-5">
                <IconInput
                  title="Password"
                  onInputHandleChange={handleChange('password')}
                  leftIcon={<LockIcon />}
                  rightIcon={<EyeIcon />}
                  onRightIconClick={togglePasswordVisibility}
                  placeholder="Enter Password"
                  width="100%"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                />
              </div>

              <div className="mb-5">
                <IconInput
                  title="Confirm Password"
                  onInputHandleChange={handleChange('password2')}
                  leftIcon={<LockIcon />}
                  rightIcon={<EyeIcon />}
                  onRightIconClick={toggleConfirmPasswordVisibility}
                  placeholder="Confirm Password"
                  width="100%"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.password2}
                />
              </div>

              {error && (
                <p className="text-red-500 mb-2.5">{error}</p>
              )}

              <IconButton
                text={isLoading ? "Signing up..." : "Sign Up"}
                textColor="white"
                backgroundColor="#7862FC"
                hoverColor="#8A7BFF"
                onClick={handleSubmit}
                width="100%"
              />
            </form>

            <p className="mt-5 self-center text-gray-400">
              Already have an account?
            </p>

            <IconButton
              text="Login"
              textColor="white"
              backgroundColor="#042628"
              hoverColor="#314647"
              onClick={navigateToLogin}
              width="100%"
            />
          </div>
        </div>
        {!isMobile && (
          <footer className="bottom-0 left-0 right-0 text-center text-sm bg-[#7862FC] text-white p-4">
            Made with ❤️ by DECOBuilder
          </footer>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SignUp;