import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "coach") navigate("/coach");
      else navigate("/client");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-top">
          <div className="auth-brand">
            <div className="auth-title">{t("appName")}</div>
            <div className="auth-sub">{t("tagline")}</div>
          </div>

          <div className="auth-lang">
            <button
              className={`auth-lang-btn ${i18n.language === "es" ? "active" : ""}`}
              onClick={() => changeLang("es")}
              type="button"
            >
              ES
            </button>
            <button
              className={`auth-lang-btn ${i18n.language === "en" ? "active" : ""}`}
              onClick={() => changeLang("en")}
              type="button"
            >
              EN
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            className="auth-input"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="auth-input"
            placeholder={t("password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn primary" type="submit" disabled={loading}>
            {loading ? "..." : t("login")}
          </button>

          <button
            className="auth-btn secondary"
            type="button"
            onClick={() => navigate("/register")}
          >
            {t("createAccount")}
          </button>
        </form>
      </div>
    </div>
  );
}
