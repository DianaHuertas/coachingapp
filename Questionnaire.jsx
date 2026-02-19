import { useTranslation } from "react-i18next";

export default function Questionnaire() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: 24 }}>
      <h2>{t("injuries")}</h2>

      <button style={{ marginRight: 8 }}>{t("yes")}</button>
      <button>{t("no")}</button>
    </div>
  );
}
