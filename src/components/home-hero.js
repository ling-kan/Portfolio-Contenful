import React, { useEffect, useState } from 'react'
import Container from './container';
import GithubIcon from "../assets/icons/github.svg";
import MailIcon from "../assets/icons/mail.svg";
import LinkedinIcon from "../assets/icons/linkedin.svg";
import BuyACoffeeIcon from "../assets/icons/buy-a-coffee.svg";
import { useReducedMotion } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion";

const variants = {
    enter: direction => {
        return {
            y: -20,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        y: 0,
        opacity: 1
    },
    exit: direction => {
        return {
            zIndex: 0,
            opacity: 0
        };
    }
};


const HomeHero = ({ name, content, animatedList, socials }) => {
    const [index, setIndex] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        setTimeout(() => {
            let next = index + 1;
            if (next === animatedList?.length) {
                next = 0;
            }
            setIndex(next);
        }, 4 * 1000);
    }, [index, setIndex]);

    return (
        <div id="home" className="h-screen md:auto items-center flex relative" >
            < Container >
                <div className=" grid grid-cols-2 py-20 gap-2">
                    <div className="z-20 col-span-3 md:col-span-3 text-center items-center justify-center my-auto">
                        <h1 className="text-8xl uppercase font-black text-border-small tracking-wide">
                            {name}
                        </h1>
                        {animatedList && <section className="big text-5xl uppercase font-black text-border-small relative h-12">
                            {prefersReducedMotion ?
                                <p className="whitespace-pre-line">{animatedList.join(', \n')} </p>
                                :
                                <AnimatePresence>
                                    <motion.span
                                        className='absolute w-full top-0 left-0'
                                        variants={variants}
                                        key={index}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            y: { type: "spring", stiffness: 300, damping: 200 },
                                            opacity: { duration: 0.5 }
                                        }}
                                    >
                                        {animatedList[index]}
                                    </motion.span>
                                </AnimatePresence>}
                        </section>}
                        {content && <p>{content}</p>}
                        {socials && <ul className="flex space-x-6 my-5 justify-center">
                            {socials?.map((value, index) => {
                                return (
                                    <li key={index}>
                                        <a href={value.url} target="_blank" rel="noreferrer">
                                            {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon className="w-10 " />}
                                            {value.type === 'Github' && <GithubIcon className="w-10 " />}
                                            {value.type === 'Email' && <MailIcon className="w-10 " />}
                                            {value.type === 'Linkedin' && <LinkedinIcon className="w-10" />}
                                        </a>
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

