import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.01-8 4.5V21h16v-2.5c0-2.49-3.58-4.5-8-4.5Z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-3 0h-4V6a2 2 0 0 1 4 0Z"
      />
    </svg>
  );
}

function IconEye({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z"
      />
      <path fill="currentColor" d="M12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.1 3.51 3.51 2.1 21.9 20.49 20.49 21.9l-3.02-3.02A10.87 10.87 0 0 1 12 19C5 19 2 12 2 12a18.36 18.36 0 0 1 4.35-5.65ZM12 5c7 0 10 7 10 7a18.78 18.78 0 0 1-3.17 4.55l-2.14-2.14A5 5 0 0 0 9.59 7.31L7.7 5.42A10.9 10.9 0 0 1 12 5Z"
      />
      <path
        fill="currentColor"
        d="M12 9a3 3 0 0 1 3 3 2.95 2.95 0 0 1-.17 1l-3.83-3.83A2.95 2.95 0 0 1 12 9Z"
      />
      <path
        fill="currentColor"
        d="M9 12a3 3 0 0 0 3 3 2.95 2.95 0 0 0 .83-.12L9.12 11.17A2.95 2.95 0 0 0 9 12Z"
      />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const normalizeName = (v) => v.replace(/\s+/g, " ").trimStart();

  const handleCaps = (e) => {
    const on = e.getModifierState && e.getModifierState("CapsLock");
    setCapsLockOn(Boolean(on));
  };

  const pwdScore = useMemo(() => {
    const p = password || "";
    let score = 0;
    if (p.length >= 8) score += 1;
    if (/[A-Za-z]/.test(p)) score += 1;
    if (/\d/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score; // 0..4
  }, [password]);

  const pwdLabel = useMemo(() => {
    if (!password) return "Password strength";
    if (pwdScore <= 1) return "Weak";
    if (pwdScore === 2) return "Okay";
    if (pwdScore === 3) return "Strong";
    return "Very strong";
  }, [password, pwdScore]);

  const passwordLooksOk = useMemo(() => {
    const p = password || "";
    const longEnough = p.length >= 8;
    const hasLetter = /[A-Za-z]/.test(p);
    const hasNumber = /\d/.test(p);
    return longEnough && hasLetter && hasNumber;
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) return setError("Please enter your full name.");
    if (!cleanEmail) return setError("Please enter a valid email address.");
    if (!passwordLooksOk) {
      return setError("Use at least 8 characters and include a letter and a number.");
    }
    if (!passwordsMatch) return setError("Passwords do not match.");

    setIsSubmitting(true);
    try {
      await register(cleanName, cleanEmail, password);

      // after register -> go login (no auto-login)
      navigate("/login", {
        replace: true,
        state: { fromRegister: true, email: cleanEmail },
      });
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lux-auth">
      <div className="lux-auth__grid">
        {/* Left hero */}
        <section className="lux-auth__hero" aria-label="Luxora register introduction">
          <div className="lux-auth__heroTop">
            <div className="lux-auth__brand">
              <div className="lux-auth__mark">L</div>
              <div className="lux-auth__brandText">Luxora</div>
            </div>

            <div className="lux-auth__tag">
              <span className="lux-auth__tagDot" />
              Premium account setup
            </div>
          </div>

          <div className="lux-auth__heroMid">
            <h2 className="lux-auth__heroTitle">Create your Luxora account</h2>
            <p className="lux-auth__heroSub">
              A smooth, secure signup designed for real users — quick to complete, easy to trust.
            </p>

            <div className="lux-auth__bullets">
              <div className="lux-auth__bullet">
                <div className="lux-auth__bulletIcon">✨</div>
                <div>
                  <div className="lux-auth__bulletTitle">Professional experience</div>
                  <div className="lux-auth__bulletText">Clean layout, clear form guidance, fast workflow.</div>
                </div>
              </div>

              <div className="lux-auth__bullet">
                <div className="lux-auth__bulletIcon">🔒</div>
                <div>
                  <div className="lux-auth__bulletTitle">Secure by design</div>
                  <div className="lux-auth__bulletText">Strong password guidance and safe account access.</div>
                </div>
              </div>

              <div className="lux-auth__bullet">
                <div className="lux-auth__bulletIcon">⚡</div>
                <div>
                  <div className="lux-auth__bulletTitle">Ready to book</div>
                  <div className="lux-auth__bulletText">Once registered, login and start booking in seconds.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lux-auth__heroBottom">
            <div className="lux-auth__trust">
              <span className="lux-auth__trustPill">Modern UI</span>
              <span className="lux-auth__trustPill">Fast access</span>
              <span className="lux-auth__trustPill">User friendly</span>
            </div>

            <div className="lux-auth__fineprint">
              By creating an account, you agree to Luxora’s terms and privacy policy.
            </div>
          </div>
        </section>

        {/* Right form */}
        <section className="lux-auth__card" aria-label="Create account form">
          <header className="lux-auth__cardHeader">
            <h1 className="lux-auth__title">Create account</h1>
            <p className="lux-auth__subtitle">Enter your details to create your account.</p>
          </header>

          {error && <div className="lux-alert lux-alert--error">{error}</div>}

          <form className="lux-form" onSubmit={handleSubmit}>
            <div className="lux-field">
              <div className="lux-label">Full name</div>
              <div className="lux-inputWrap">
                <span className="lux-icon"><IconUser /></span>
                <input
                  className="lux-input"
                  value={name}
                  onChange={(e) => setName(normalizeName(e.target.value))}
                  placeholder="e.g. Alex Perera"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="lux-field">
              <div className="lux-label">Email</div>
              <div className="lux-inputWrap">
                <span className="lux-icon"><IconMail /></span>
                <input
                  className="lux-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="lux-field">
              <div className="lux-label">Password</div>
              <div className="lux-inputWrap">
                <span className="lux-icon"><IconLock /></span>
                <input
                  className="lux-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleCaps}
                  onKeyUp={handleCaps}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="lux-iconBtn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <IconEye open={showPassword} />
                </button>
              </div>

              <div className="lux-row">
                <div className="lux-help">{pwdLabel}</div>
                {capsLockOn && <div className="lux-help" style={{ color: "#b45309" }}>Caps Lock is ON</div>}
              </div>

              <div className="lux-meter" aria-hidden="true">
                <span className={`lux-meterBar ${pwdScore >= 1 ? "on" : ""}`} />
                <span className={`lux-meterBar ${pwdScore >= 2 ? "on" : ""}`} />
                <span className={`lux-meterBar ${pwdScore >= 3 ? "on" : ""}`} />
                <span className={`lux-meterBar ${pwdScore >= 4 ? "on" : ""}`} />
              </div>

              <div className="lux-note">
                Use <b>8+</b> characters and include a <b>letter</b> and a <b>number</b>.
              </div>
            </div>

            <div className="lux-field">
              <div className="lux-label">Confirm password</div>
              <div className={`lux-inputWrap ${!passwordsMatch ? "lux-inputWrap--error" : ""}`}>
                <span className="lux-icon"><IconLock /></span>
                <input
                  className="lux-input"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleCaps}
                  onKeyUp={handleCaps}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />
              </div>

              {!passwordsMatch && (
                <div className="lux-inlineError">Passwords do not match.</div>
              )}
            </div>

            <button className="lux-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="lux-spinner" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account <span className="lux-btnArrow">→</span>
                </>
              )}
            </button>

            <div className="lux-divider">
              <span />
              <span className="lux-dividerText">OR</span>
              <span />
            </div>

            <p className="lux-foot">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
