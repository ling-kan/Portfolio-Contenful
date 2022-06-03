import React, { useEffect, useState } from 'react'
import Container from './container';
import ReactTextTransition, { presets } from "react-text-transition";
import GithubIcon from "../assets/github.svg";
import MailIcon from "../assets/mail.svg";
import LinkedinIcon from "../assets/linkedin.svg";
import BuyACoffeeIcon from "../assets/buy-a-coffee.svg";
import { Link } from 'gatsby'
import { useReducedMotion } from "framer-motion"

const HomeHero = ({ name, content, animatedList, socials }) => {
    const [index, setIndex] = useState(0);
    const prefersReducedMotion = useReducedMotion();
    useEffect(() => {
        const intervalId = setInterval(() =>
            setIndex(index => index + 1),
            5000
        );
        return () => clearTimeout(intervalId);
    }, []);
    return (
        <div id="home" className="h-screen md:auto items-center flex relative" >
            <Container>
                <div className="grid grid-cols-2 py-20 gap-2">
                    <div className=" col-span-3 md:col-span-3 text-left items-left justify-left my-auto">
                        <h1 className="text-9xl md:text-9xl uppercase">
                            {name}
                        </h1>
                        {animatedList && <section className="inline big text-5xl uppercase font-bold">
                            {prefersReducedMotion ?
                                <p className="whitespace-pre-line">{animatedList.join(', \n')} </p>
                                :
                                <ReactTextTransition
                                    text={animatedList[index % animatedList.length]}
                                    springConfig={presets.slow}
                                    delay={700}
                                    noOverflow
                                    direction="down"
                                />}
                        </section>
                        }
                        {content && <p>{content}</p>}
                        {socials && <ul className="flex space-x-6 my-5">
                            {socials?.map((value, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={value.url} target="_blank">
                                            {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon className="w-10 " />}
                                            {value.type === 'Github' && <GithubIcon className="w-10 " />}
                                            {value.type === 'Email' && <MailIcon className="w-10 " />}
                                            {value.type === 'Linkedin' && <LinkedinIcon className="w-10" />}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                        }
                    </div>
                    <div className="scroll-down" />
                </div>
            </Container >
        </div >
    )
}

export default HomeHero;

