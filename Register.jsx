import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import "./auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Steps: 1=name, 2=email, 3=password
  const [step, setStep] = useState(1);

  // Draft typing (what's in the input right now)
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPassword, setDraftPassword] = useState("");

  // Committed answers (only set when user presses Continue)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const messages = useMemo(() => {
    const arr = [{ from: "bot", text: t("regAskName") }];

    // Only show name bubble after it's committed
    if (name) {
      arr.push({ from: "user", text: name });
      arr.push({ from: "bot", text: t("regNiceToMeet", { name }) });
      arr.push({ from: "bot", text: t("regAskEmail") });
    }

    // Only show email bubble after it's committed
    if (email) {
      arr.push({ from: "user", text: email });
      arr.push({ from: "bot", text: t("regAskPassword") });
    }

    return arr;
  }, [t, name, email]);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password: draftPassword,
        role: "client",
      });

      const loginRes = await api.post("/auth/login", {
        email,
        password: draftPassword,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("role", loginRes.data.role);
      localStorage.setItem("lang", i18n.language);

      navigate("/client/onboarding");
    } catch (err) {
      setError(err?.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const onContinue = async (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      const v = draftName.trim();
      if (!v) return setError("Name required");
      setName(v);      // ✅ commit
      setStep(2);
      return;
    }

    if (step === 2) {
      const v = draftEmail.trim();
      if (!v) return setError("Email required");
      setEmail(v);     // ✅ commit
      setStep(3);
      return;
    }

    // step 3
    if (!draftPassword) return setError("Password required");
    await handleSubmit();
  };

  return (
    <div className="reg-wrap">
      <div className="reg-inner">
        <div className="reg-topbar">
          <button className="back-btn" onClick={() => navigate("/login")} type="button">
            ←
          </button>

          <div className="reg-title">{t("regTitle")}</div>

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

        <div className="reg-chat">
          {messages.map((m, idx) => (
            <div key={idx} className={`msg-row ${m.from === "user" ? "right" : "left"}`}>
              {m.from === "bot" && <div className="avatar">C</div>}
              <div className={`bubble ${m.from === "user" ? "user" : "bot"}`}>{m.text}</div>
            </div>
          ))}
        </div>

        <form className="reg-bottom" onSubmit={onContinue}>
          <div className="reg-bottom-inner">
            {step === 1 && (
              <input
                className="reg-input"
                placeholder={t("name")}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            )}

            {step === 2 && (
              <input
                className="reg-input"
                placeholder={t("email")}
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                autoComplete="email"
              />
            )}

            {step === 3 && (
              <input
                className="reg-input"
                placeholder={t("password")}
                type="password"
                value={draftPassword}
                onChange={(e) => setDraftPassword(e.target.value)}
                autoComplete="new-password"
              />
            )}

            {error && <div className="reg-error">{error}</div>}

            <button className="reg-btn" type="submit" disabled={loading}>
              {loading ? "..." : t("continue")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}