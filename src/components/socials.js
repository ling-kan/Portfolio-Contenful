import React from 'react';
import GithubSvg from "../assets/icons/github.svg";
import MailSvg from "../assets/icons/mail.svg";
import LinkedinSvg from "../assets/icons/linkedin.svg";
import BuyACoffeeSvg from "../assets/icons/buy-a-coffee.svg";
import useSocialData from '../services/useSocialData';

const withIconWrapper = (SvgIcon) => {
  if (SvgIcon.defaultProps) delete SvgIcon.defaultProps;

  return ({ width = 'w-6', className = 'fill-muted-foreground hover:fill-foreground transition-colors', ...props }) => (
    <SvgIcon className={`${width} ${className}`} {...props} />
  );
};


const Icons = {
  Github: withIconWrapper(GithubSvg),
  Email: withIconWrapper(MailSvg),
  Linkedin: withIconWrapper(LinkedinSvg),
  'Buy Me A Coffee': withIconWrapper(BuyACoffeeSvg),
};

const Socials = ({ width = 'w-6', className = '' }) => {
  const socials = useSocialData();

  return (
    <ul className={`flex space-x-6 list-none pl-0 ${className}`}>
      {socials?.map(({ type, url }, index) => {
        const Icon = Icons[type];
        return (
          <li key={index} className="my-0 before:content-none pl-0">
            <a href={url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              {Icon && <Icon width={width} />}
              <span className="sr-only">{type}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Socials;
