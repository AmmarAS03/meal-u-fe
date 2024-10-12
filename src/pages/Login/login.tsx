import React, { useEffect, useState } from "react";
import { IonContent, IonHeader, IonPage, useIonRouter } from "@ionic/react";
import IconInput from "../../components/icon-input";
import IconButton from "../../components/icon-button";
import EmailIcon from "../../../public/icon/email-icon";
import LockIcon from "../../../public/icon/lock-icon";
import EyeIcon from "../../../public/icon/eye-icon";
import GoogleIcon from "../../../public/icon/google-icon";
import { useAuth } from "../../contexts/authContext";

const Login: React.FC = () => {
  const router = useIonRouter();
  const { login, getRole } = useAuth();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const role = getRole();
      
      if (role) {
        switch (role) {
          case 'warehouse':
            router.push("/warehouse/dashboard");
            break;
          case 'courier':
            router.push("/courier/home");
            break;
          case 'client':
            router.push("/tab1");
            break;
          default:
            setError("Unknown user role. Please contact support.");
        }
      } else {
        setError("Login successful but role not set. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement Google login logic here
  };

  return (
    <IonPage>
      <IonContent className="font-sans">
        <div className="max-w-6xl mx-auto flex flex-row items-center px-5 h-fit p-4 mb-4">
          {!isMobile && (
            <div className="flex-1 max-w-1/2 max-h-screen">
              <img
                src="/img/login-image.png"
                alt="login image"
                className="h-[85vh] rounded-2xl"
              />
            </div>
          )}

          <div className="flex-1 px-4 py-4 md:py-0 md:px-10 flex flex-col items-start">
            <h2 className="text-3xl mb-2.5 font-bold">Sign in</h2>
            {!isMobile && (
              <p className="mb-5">Hi, let's jump in! 👋</p>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-5">
                <IconInput
                  title="Email Address"
                  onInputHandleChange={handleEmailChange}
                  leftIcon={<EmailIcon />}
                  placeholder="Enter Email Address"
                  width="100%"
                />
              </div>

              <div className="mb-5">
                <IconInput
                  title="Password"
                  onInputHandleChange={handlePasswordChange}
                  leftIcon={<LockIcon />}
                  rightIcon={<EyeIcon />}
                  onRightIconClick={togglePasswordVisibility}
                  placeholder="Enter Password"
                  width="100%"
                  type={showPassword ? "text" : "password"}
                />
              </div>
              {error && (
                <p className="text-red-500 mb-2.5">{error}</p>
              )}
              <IconButton
                text={isLoading ? "Logging in..." : "Login"}
                textColor="white"
                backgroundColor="#042628"
                hoverColor="#314647"
                onClick={handleSubmit}
                width="100%"
              />
            </form>

            <p className="mt-5 self-center text-gray-400">
              or continue with
            </p>

            <IconButton
              icon={<GoogleIcon />}
              text="Login with Google"
              textColor="white"
              backgroundColor="#ff6b6b"
              hoverColor="#ff8787"
              onClick={handleGoogleLogin}
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

export default Login;