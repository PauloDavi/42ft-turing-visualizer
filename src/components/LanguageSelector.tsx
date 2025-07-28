import { Button } from "@chakra-ui/react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "pt-BR" ? "en-US" : "pt-BR";
    i18n.changeLanguage(newLanguage);
  };

  const getCurrentLanguageInfo = () => {
    if (i18n.language === "en-US") {
      return { flag: "🇺🇸", text: "EN" };
    }
    return { flag: "🇧🇷", text: "PT" };
  };

  const { flag, text } = getCurrentLanguageInfo();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      title={
        i18n.language === "pt-BR"
          ? t("language.switchToEnglish")
          : t("language.switchToPortuguese")
      }
    >
      <FaGlobe />
      {flag} {text}
    </Button>
  );
};
