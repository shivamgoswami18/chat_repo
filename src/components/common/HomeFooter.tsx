import Link from "next/link";
import {
  footerConstants,
  customerServiceIcons,
  socialMediaIcons,
} from "@/components/constants/HomePage";

const HomeFooter = () => {
  const footerColumns = footerConstants?.columns;
  const customerServiceItems = footerConstants?.customerService;
  const legalLinks = footerConstants?.legalLinks;
  const socialMediaItems = footerConstants?.socialMedia;

  return (
    <footer className="w-full bg-obsidianBlack text-white">
      <div className="w-full mx-auto max-w-container px-[20px] py-[60px] xs:px-[40px] md:px-[80px] desktop:px-[152px] md:py-[80px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] md:gap-[60px] lg:gap-[80px]">
          {footerColumns?.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col">
              <h3 className="text-textBase font-extraLight text-white text-opacity-50 mb-[24px] uppercase xl:leading-[100%] tracking-[0px]">
                {column?.title}
              </h3>
              <ul className="flex flex-col gap-[12px] list-none marker:none">
                {column?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link?.href}
                      className="text-textBase text-white hover:text-stoneGray transition-colors xl:leading-[36px] tracking-[0px] no-underline"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col">
            <h3 className="text-textBase font-extraLight text-white text-opacity-50 mb-[24px] uppercase xl:leading-[100%] tracking-[0px]">
              {footerConstants?.customerServiceTitle}
            </h3>
            <ul className="flex flex-col gap-[16px]">
              {customerServiceItems?.map((item, index) => (
                <li key={index} className="flex items-start gap-[12px]">
                  {customerServiceIcons?.[index]}
                  {item?.isLink && item?.href ? (
                    <a
                      href={item.href}
                      className="text-textBase text-white hover:text-stoneGray transition-colors xl:leading-[100%] tracking-[0px] no-underline"
                    >
                      {item?.text}
                    </a>
                  ) : (
                    <span className="text-textBase text-white hover:text-stoneGray transition-colors xl:leading-[100%] tracking-[0px]">
                      {item?.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white bg-opacity-10"></div>

      <div className="w-full mx-auto max-w-container px-[20px] py-[24px] xs:px-[40px] md:px-[80px] desktop:px-[152px] md:py-[32px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[24px] md:gap-[40px]">
          <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-[12px]">
            <p className="text-titleMid font-bold text-white xl:leading-[100%] xl:tracking-[-1px]">
              {footerConstants?.logo}
            </p>
            <span className="text-textSm text-white text-opacity-50 font-extraLight xl:leading-[100%] tracking-[0px]">
              {footerConstants?.copyright}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center">
            {legalLinks?.map((link, index) => (
              <div key={index} className="flex items-center">
                <Link
                  href={link?.href}
                  className="text-textSm text-white text-opacity-50 font-extraLight xl:leading-[100%] tracking-[0px] hover:text-white transition-colors no-underline"
                >
                  {link?.label}
                </Link>
                {index < (legalLinks?.length ?? 0) - 1 && (
                  <span className="text-white text-opacity-50 text-textSm mx-[8px]">
                    •
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[16px]">
            {socialMediaItems?.map((item, index) => (
              <Link
                key={index}
                href={item?.href}
                className="text-white hover:text-opacity-50 transition-colors flex items-center justify-center no-underline"
              >
                {socialMediaIcons?.[index]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
