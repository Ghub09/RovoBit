import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoSrc from "../../assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-8 shadow-top">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div className="mb-4 md:mb-0">
            <div className="logo-container flex items-center">
              <Link to={"/"} className="">
                <i>
                  <img className="w-[8vw]" src={LogoSrc} alt="LOGO" />
                </i>
              </Link>
            </div>
            <p className="mt-2 text-[#F5F5F5]">{t("trusted_trading")}</p>
          </div>
          <div className="flex gap-8 justify-center flex-wrap  md:flex-row space-y-4 md:space-y-0 md:space-x-16">
            <div>
              <h3 className="text-xl font-semibold text-[#1E90FF]">
                {t("company")}
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/about" className="hover:text-[#00FF7F]">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[#00FF7F]">
                    {t("careers")}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#00FF7F]">
                    {t("contact_us")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E90FF]">
                {t("support")}
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/faq" className="hover:text-[#00FF7F]">
                    {t("faq")}
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-[#00FF7F]">
                    {t("help")}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#00FF7F]">
                    {t("terms_of_service")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E90FF]">
                {t("follow_us")}
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="https://facebook.com"
                    className="hover:text-[#00FF7F]"
                  >
                    {t("facebook")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    className="hover:text-[#00FF7F]"
                  >
                    {t("twitter")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    className="hover:text-[#00FF7F]"
                  >
                    {t("linkedin")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-[#F5F5F5]">
            &copy; 2025 BitEx. {t("all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
