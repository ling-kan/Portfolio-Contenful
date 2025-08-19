import React, { useEffect, useState } from 'react'
import Container from './container';
import { useReducedMotion } from "motion/react"
import { GatsbyImage } from 'gatsby-plugin-image'
import { AnimatePresence, motion, useTransform, useScroll } from "motion/react";
import FadeIn from './motion/fade-in';
import Socials from './socials';

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


const HomeHero = ({ name, animatedList, image, tagline }) => {
    const [index, setIndex] = useState(0);
    const prefersReducedMotion = useReducedMotion();
    const { scrollY } = useScroll();

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
            <div id="home" className="h-screen z-0 items-center flex relative mb-8" >
                <Container>
                    <motion.div
                        style={{
                            scale: useTransform(scrollY, [0, 300], [1, 0.75]),
                        }}
                        className="text-center items-center justify-center my-auto">
                        {image?.gatsbyImageData &&
                            <GatsbyImage imgClassName='rounded-full' className="rounded-full h-20 w-20 border-solid border-primary border-2 bg-primary mx-auto" alt="Profile Image" image={image?.gatsbyImageData} />
                        }
                        <h1 className="text-6xl md:text-9xl uppercase tracking-wide">
                            {name}
                        </h1>
                        {animatedList && <section className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl uppercase relative font-semibold h-16 xxs:h-10 xs:12 sm:h-12 md:h-18 lg:h-20">
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
                        {tagline && <div className='mb-4 text-md sm:text-xl max-w-xl mx-auto'
                            dangerouslySetInnerHTML={{
                                __html: tagline.childMarkdownRemark.html,
                            }}
                        />}
                        <Socials width="w-10" className="justify-center" />
                    </motion.div>
                    <div className="scroll-down opacity-30" />
                </Container>
            </div >
        </FadeIn>
    )
}

export default HomeHero;

