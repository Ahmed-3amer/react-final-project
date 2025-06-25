import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/LogReg.css";

export default function LogReg() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      <div className={`auth-box ${isLogin ? "login-mode" : "register-mode"}`}>
        <div className="auth-left">{isLogin ? <Login /> : <Register />}</div>

        <div className="auth-right">
          {isLogin ? (
            <div className="toggle-box">
              <h3>Don't have an Account?</h3>
              <button onClick={() => setIsLogin(false)}>
                Register
              </button>
            </div>
          ) : (
            <div className="toggle-box">
              <h3>Have an Account?</h3>
              <button onClick={() => setIsLogin(true)}>
                Login Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
