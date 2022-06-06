import React, { useEffect, useState } from 'react'
import Container from './container';
import GithubIcon from "../assets/icons/github.svg";
import MailIcon from "../assets/icons/mail.svg";
import LinkedinIcon from "../assets/icons/linkedin.svg";
import BuyACoffeeIcon from "../assets/icons/buy-a-coffee.svg";
import { useReducedMotion } from "framer-motion"
import { AnimatePresence, motion, useTransform, useViewportScroll } from "framer-motion";
import FadeIn from './motion/fade-in';

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
    const { scrollY } = useViewportScroll();

    useEffect(() => {
        setTimeout(() => {
            let next = index + 1;
            if (next === animatedList.length) {
                next = 0;
            }
            setIndex(next);
        }, 4 * 1000);
    }, [animatedList, index, setIndex]);

    return (
        <FadeIn>
            <div id="home" className="h-screen items-center flex relative" >
                < Container >
                    <motion.div
                        style={{
                            scale: useTransform(scrollY, [0, 300], [1, 0.75]),
                        }}
                        className="text-center items-center justify-center my-auto">
                        <h1 className="text-6xl sm:text-9xl uppercase font-black tracking-wide">
                            {name}
                        </h1>
                        {animatedList && <section className="text-2xl sm:text-5xl font-bold uppercase relative h-8 md:h-20">
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
                        {socials && <ul className="flex justify-center space-x-6 my-5">
                            {socials?.map((value, index) => {
                                return (
                                    <li key={index}>
                                        <a href={value.url} target="_blank" rel="noreferrer">
                                            {value.type === 'Buy Me A Coffee' && <BuyACoffeeIcon className="w-8 " />}
                                            {value.type === 'Github' && <GithubIcon className="w-8 " />}
                                            {value.type === 'Email' && <MailIcon className="w-8" />}
                                            {value.type === 'Linkedin' && <LinkedinIcon className="w-8" />}
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                        }
                    </motion.div>
                    <div className="scroll-down" />
                </Container >
            </div >
        </FadeIn>
    )
}

export default HomeHero;

