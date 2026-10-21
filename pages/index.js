import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      setError("Please enter a valid @gmail.com email address.");
      return;
    }

    if (password.length <= 8) {
      setError("Password must be more than 8 characters.");
      return;
    }

    window.localStorage.setItem("notes-app-authenticated", "true");
    router.push("/notes");
  }

  return (
    <main className="auth-layout">
      <section className="welcome-panel">
        <a className="brand" href="/" aria-label="Daynote home">
          <span className="brand-mark">d</span>
          <span>daynote</span>
        </a>
        <div className="welcome-copy">
          <span className="eyebrow">A little space for your thoughts</span>
          <h1>Make room for what matters.</h1>
          <p>Keep your ideas close, your mind clear, and your day moving.</p>
        </div>
        <div className="welcome-footer">Your notes, right where you need them.</div>
      </section>

      <section className="form-panel">
        <div className="form-card">
          <div className="mobile-brand brand">
            <span className="brand-mark">d</span>
            <span>daynote</span>
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your space</h2>
          <p className="form-intro">A clear head starts with a place to put it all.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@gmail.com"
              type="email"
              value={email}
            />

            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="More than 8 characters"
              type="password"
              value={password}
            />

            <button className="primary-button" type="submit">
              Sign in <span aria-hidden="true">→</span>
            </button>
            <p className={`form-message${error ? " is-error" : ""}`} aria-live="polite">
              {error || "Use your @gmail.com address to continue."}
            </p>
          </form>

          <p className="demo-note">Demo sign-in only — no account is created.</p>
        </div>
      </section>
    </main>
  );
}
