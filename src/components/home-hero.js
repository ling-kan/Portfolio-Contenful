import React, { useEffect, useState } from 'react'
import Container from './container';
import { useReducedMotion } from "framer-motion"
import { GatsbyImage } from 'gatsby-plugin-image'
import { AnimatePresence, motion, useTransform, useViewportScroll } from "framer-motion";
import FadeIn from './motion/fade-in';
import Socials from './socials';

const HomeHero = ({ name, animatedList, image, tagline }) => {
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
            <div id="home" className="h-screen z-0 items-center flex relative pt-16 md:pt-28" >
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
                        {animatedList && <section className="text-2xl sm:text-5xl uppercase relative font-semibold h-16 md:h-20">
                            {prefersReducedMotion ?
                                <p className="whitespace-pre-line">{animatedList.join(', \n')} </p>
                                :
                                <AnimatePresence>
                                    <motion.span
                                        className='absolute w-full top-0 left-0'
                                        variants={{
                                            initial: { opacity: 0, y: -10 },
                                            animate: { opacity: 1, y: 0 },
                                            exit: { opacity: 0, y: 10 },
                                        }}
                                        key={index}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{
                                            y: { type: "spring", stiffness: 300, damping: 200 },
                                            opacity: { duration: 0.7 },
                                        }}
                                    >
                                        {animatedList[index]}
                                    </motion.span>
                                </AnimatePresence>}
                        </section>
                        }
                        {tagline && (
                            <div
                                className="text-center mb-3 w-full max-w-3xl mx-auto"
                                dangerouslySetInnerHTML={{
                                    __html: tagline,
                                }}
                            />
                        )}
                        <Socials width="w-10" />
                        <div className="scroll-down-space" />
                    </motion.div>
                    <div className="scroll-down-container absolute">
                        <div className="scroll-down opacity-30" />
                    </div>

                </Container>
            </div >
        </FadeIn>
    )
}

export default HomeHero;

