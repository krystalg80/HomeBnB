import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './LoginForm.css';

function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Navigate to="/" replace={true}/>;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({credential, password})).catch(
            async (res) => {
            const data = await res.json();
            if (data?.errors) setErrors(data.errors);
        });
    }

    return (
        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-text">Log In</h1>
            <label className="login-label">
              Username or Email
              <input
                className="login-input"
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
            <label className="login-label">
              Password
              <input
              className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.credential && <p className="login-error">{errors.credential}</p>}
            <button type="submit" className="login-button">Log In</button>
          </form>
          </div>
      );
}

export default LoginFormPage;