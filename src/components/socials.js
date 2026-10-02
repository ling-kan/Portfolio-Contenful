import React from 'react';
import GithubSvg from "../assets/icons/github.svg";
import MailSvg from "../assets/icons/mail.svg";
import LinkedinSvg from "../assets/icons/linkedin.svg";
import BuyACoffeeSvg from "../assets/icons/buy-a-coffee.svg";
import useSocialData from '../services/useSocialData';

const withIconWrapper = (SvgIcon) => {
  if (SvgIcon.defaultProps) delete SvgIcon.defaultProps;

  return ({ width = 'w-6', className = 'fill-grey', ...props }) => (
    <SvgIcon className={`${width} ${className}`} {...props} />
  );
};


const Icons = {
  Github: withIconWrapper(GithubSvg),
  Email: withIconWrapper(MailSvg),
  Linkedin: withIconWrapper(LinkedinSvg),
  'Buy Me A Coffee': withIconWrapper(BuyACoffeeSvg),
};

const Socials = ({ width = 'w-6', className = '', iconClassName = 'fill-grey text-ink/60 hover:text-accent transition-colors' }) => {
  const socials = useSocialData();

  return (
    <ul className={`flex gap-6 p-0 m-0 ${className}`}>
      {socials?.map(({ type, url }, index) => {
        const Icon = Icons[type];
        return (
          <li key={index} className="list-none">
            <a href={url} target="_blank" rel="noreferrer" aria-label={type} className="block hover:-translate-y-0.5 transition-transform">
              {Icon && <Icon width={width} className={iconClassName} />}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Socials;
