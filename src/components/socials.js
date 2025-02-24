import React from 'react';
import GithubIcon from "../assets/icons/github.svg";
import MailIcon from "../assets/icons/mail.svg";
import LinkedinIcon from "../assets/icons/linkedin.svg";
import BuyACoffeeIcon from "../assets/icons/buy-a-coffee.svg";
import useSocialData from '../services/useSocialData';

const Socials = ({ width = 'default-width' }) => {
    const socials = useSocialData();
    return (
        <ul className="flex space-x-6 justify-center">
            {socials?.map((value, index) => {
                return (
                    <li key={index} className="my-4 sm:my-0 ">
                        <a href={value.url} target="_blank" rel="noreferrer">
                            {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon alt="Buy Me A Coffee" className={`${width} fill-grey`} />}
                            {value.type === 'Github' && <GithubIcon alt="Github" className={`${width} fill-grey`} />}
                            {value.type === 'Email' && <MailIcon alt="Email" className={`${width} fill-grey`} />}
                            {value.type === 'Linkedin' && <LinkedinIcon alt="Linkedin" className={`${width} fill-grey`} />}
                        </a>
                    </li>
                )
            })}
        </ul>
    );
}

export default Socials;
