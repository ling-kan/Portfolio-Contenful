import React, { useEffect, useState } from 'react'
import Container from './container';
import { useReducedMotion } from "framer-motion"
import { AnimatePresence, motion, useTransform, useViewportScroll } from "framer-motion";
import FadeIn from './motion/fade-in';
import Socials from './socials';
import { Link } from 'gatsby';

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


const HomeHero = ({ name, animatedList, socials }) => {
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
            <div id="home" className="h-screen z-0 items-center flex relative" >
                <Container>
                    <motion.div
                        style={{
                            scale: useTransform(scrollY, [0, 300], [1, 0.75]),
                        }}
                        className="text-center items-center justify-center my-auto">
                        <h1 className="text-7xl md:text-9xl uppercase tracking-wide">
                            {name}
                        </h1>
                        {animatedList && <section className="text-2xl sm:text-5xl uppercase relative font-semibold h-16 md:h-20">
                            {prefersReducedMotion ?
                                <p className="whitespace-pre-line">{animatedList.join(', \n')} </p>
                                :
                                <AnimatePresence>
                                    <motion.span
                                        className='absolute w-full top-0 left-0'
                                        variants={variants}
                                        key={index}
                                        initial={{
                                            opacity: 0,
                                            y: -10
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: 10
                                        }}
                                        transition={{
                                            y: { type: "spring", stiffness: 300, damping: 200 },
                                            opacity: { duration: 0.7 }
                                        }}
                                    >
                                        {animatedList[index]}
                                    </motion.span>
                                </AnimatePresence>}
                        </section>}
                        <Socials width="w-10" />
                    </motion.div>
                    <Link to="#firstSection" className="scroll-down opacity-30" />
                </Container>
            </div >
        </FadeIn>
    )
}

export default HomeHero;

