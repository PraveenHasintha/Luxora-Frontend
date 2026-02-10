// Luxora-Frontend/src/pages/Login.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const REMEMBER_KEY = "luxora_remember_email";

function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z"
      />
    </svg>
  );
}

function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm7 12H7v-8h10v8Z"
      />
    </svg>
  );
}

function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5Z"
      />
    </svg>
  );
}

function IconEyeOff(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M4.1 5.5 2.7 6.9l3 3C3.2 11.7 2 13 2 13s3 7 10 7c2 0 3.7-.6 5.1-1.4l3.2 3.2 1.4-1.4L4.1 5.5ZM12 18c-4.6 0-7.2-3.7-8.2-5.2.5-.7 1.4-1.8 2.8-2.8l2.1 2.1A5 5 0 0 0 16 16.1l1.6 1.6c-1.3.8-3.1 1.3-5.6 1.3Zm-4.1-9.4 1.6 1.6A5 5 0 0 1 12 7a5 5 0 0 1 5 5c0 .7-.1 1.4-.4 2l1.7 1.7c.5-1 .7-2.1.7-3.2 0-7-7-7-7-7-1.5 0-2.8.3-3.9 1.1Z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Prefill remembered email
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) setEmail(saved);
  }, []);

  // Info message when coming from Register
  useEffect(() => {
    const st = location.state;
    if (st?.fromRegister) {
      setInfo("✅ Account created. Please sign in.");
      if (st?.email) setEmail(st.email);
      // clear one-time state
      navigate("/login", { replace: true });
    }
  }, [location.state, navigate]);

  const heroHint = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return "Good morning — ready to manage today’s reservations?";
    if (hours < 18) return "Good afternoon — your dashboard is one login away.";
    return "Good evening — check bookings and keep guests happy.";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsSubmitting(true);

    try {
      await login(email, password);

      if (remember) localStorage.setItem(REMEMBER_KEY, email);
      else localStorage.removeItem(REMEMBER_KEY);

      // ✅ after login -> ALWAYS go to Home page
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lux-auth">
      <div className="lux-auth__grid">
        {/* Left: Brand / Hero */}
        <section className="lux-auth__hero" aria-label="Luxora introduction">
          <div className="lux-auth__heroTop">
            <div className="lux-auth__brand">
              <span className="lux-auth__mark">L</span>
              <span className="lux-auth__brandText">Luxora</span>
            </div>

            <div className="lux-auth__tag">
              <span className="lux-auth__tagDot" />
              <span>Client-ready booking experience</span>
            </div>
          </div>

          <div className="lux-auth__heroMid">
            <h2 className="lux-auth__heroTitle">Luxury, simplified.</h2>
            <p className="lux-auth__heroSub">{heroHint}</p>

            <div className="lux-auth__bullets">
              <div className="lux-auth__bullet">
                <span className="lux-auth__bulletIcon">⚡</span>
                <div>
                  <div className="lux-auth__bulletTitle">Fast</div>
                  <div className="lux-auth__bulletText">Quick access to rooms, booking flow & dashboard.</div>
                </div>
              </div>
              <div className="lux-auth__bullet">
                <span className="lux-auth__bulletIcon">🔒</span>
                <div>
                  <div className="lux-auth__bulletTitle">Secure</div>
                  <div className="lux-auth__bulletText">Token-based auth with protected routes.</div>
                </div>
              </div>
              <div className="lux-auth__bullet">
                <span className="lux-auth__bulletIcon">✨</span>
                <div>
                  <div className="lux-auth__bulletTitle">Modern</div>
                  <div className="lux-auth__bulletText">Premium UI polish that feels like a real product.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lux-auth__heroBottom">
            <div className="lux-auth__trust">
              <span className="lux-auth__trustPill">FastAPI</span>
              <span className="lux-auth__trustPill">React</span>
              <span className="lux-auth__trustPill">JWT</span>
              <span className="lux-auth__trustPill">Production-ready</span>
            </div>
            <div className="lux-auth__fineprint">
              By continuing, you agree to Luxora’s terms & privacy policy.
            </div>
          </div>
        </section>

        {/* Right: Form */}
        <section className="lux-auth__card" aria-label="Sign in form">
          <div className="lux-auth__cardHeader">
            <h1 className="lux-auth__title">Sign in</h1>
            <p className="lux-auth__subtitle">Enter your credentials to continue.</p>
          </div>

          {info && <div className="lux-alert lux-alert--success">{info}</div>}
          {error && <div className="lux-alert lux-alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="lux-form">
            <label className="lux-field">
              <span className="lux-label">Email</span>
              <div className="lux-inputWrap">
                <span className="lux-icon" aria-hidden="true">
                  <IconMail />
                </span>
                <input
                  className="lux-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="lux-field">
              <span className="lux-label">Password</span>
              <div className="lux-inputWrap">
                <span className="lux-icon" aria-hidden="true">
                  <IconLock />
                </span>
                <input
                  className="lux-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="lux-iconBtn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </label>

            <div className="lux-row">
              <label className="lux-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember email</span>
              </label>

              {/* Not implemented feature (kept as UI polish only) */}
              <span className="lux-help" title="Optional future feature">
                Forgot password?
              </span>
            </div>

            <button className="lux-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="lux-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Continue
                  <span className="lux-btnArrow" aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="lux-divider">
            <span />
            <span className="lux-dividerText">New to Luxora?</span>
            <span />
          </div>

          {/* ✅ Only place to go Register */}
          <p className="lux-foot">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
