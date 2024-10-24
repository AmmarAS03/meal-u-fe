import React, { useEffect, useState } from "react";
import { IonContent, IonHeader, IonPage, useIonRouter } from "@ionic/react";
import IconInput from "../../components/icon-input";
import IconButton from "../../components/icon-button";
import EmailIcon from "../../../public/icon/email-icon";
import LockIcon from "../../../public/icon/lock-icon";
import EyeIcon from "../../../public/icon/eye-icon";
import { useAuth } from "../../contexts/authContext";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const router = useIonRouter();
  const { login } = useAuth();
  const history = useHistory();

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
      const userRole = await login(email, password);
      
      if (userRole) {
        switch (userRole) {
          case 'warehouse':
            router.push("/warehouse/dashboard");
            break;
          case 'courier':
            router.push("/courier/home");
            break;
          case 'client':
            router.push("/home");
            break;
          default:
            setError("Unknown user role. Please contact support.");
        }
      } else {
        setError("Login failed. Role not found.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    history.push("/signup");
  };

  return (
    <IonPage>
      <IonContent className="font-sans">
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow max-w-6xl mx-auto flex flex-row items-center px-5 p-4 mb-4">
            {!isMobile && (
              <div className="flex-1 max-w-1/2 max-h-screen">
                <img
                  src="/img/login-image.png"
                  alt="login image"
                  className="h-fit rounded-2xl"
                />
              </div>
            )}

            <div className="flex-1 px-4 py-4 md:py-0 md:px-10 flex flex-col items-start">
              <h2 className="text-3xl mb-2.5 font-bold">Login</h2>
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
                  backgroundColor="#7862FC"
                  hoverColor="#8A7BFF"
                  onClick={handleSubmit}
                  width="100%"
                />
              </form>

              <p className="mt-5 self-center text-gray-400">
                Don't have an account?
              </p>

              <IconButton
                text="Sign Up"
                textColor="white"
                backgroundColor="#042628"
                hoverColor="#314647"
                onClick={handleSignUp}
                width="100%"
              />
            </div>
          </div>
          {!isMobile && (
            <footer className="w-full text-center text-sm bg-[#7862FC] text-white p-4">
              Made with ❤️ by DECOBuilder
            </footer>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;