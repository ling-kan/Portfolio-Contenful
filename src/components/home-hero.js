import React, { useEffect, useState } from 'react'
import Container from './container';
import { useReducedMotion } from "motion/react"
import { GatsbyImage } from 'gatsby-plugin-image'
import { motion, useTransform, useScroll } from "motion/react";
import FadeIn from './motion/fade-in';
import Socials from './socials';

const HomeHero = ({ name, animatedList, image, tagline }) => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { scrollY } = useScroll();

    useEffect(() => {
        if (prefersReducedMotion) {
            setDisplayText(animatedList.join(", "));
            return;
        }

        const currentText = animatedList[index];

        const typingSpeed = 150;   // 150ms per character
        const deletingSpeed = 50; // 100ms per character
        const pauseTime = 4000;    // 5000ms pause at full text

        let timeout;

        if (!isDeleting && displayText.length < currentText.length) {
            // Typing
            timeout = setTimeout(() => {
                setDisplayText(currentText.substring(0, displayText.length + 1));
            }, typingSpeed);
        } else if (!isDeleting && displayText.length === currentText.length) {
            // Pause before deleting
            timeout = setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && displayText.length > 0) {
            // Deleting
            timeout = setTimeout(() => {
                setDisplayText(currentText.substring(0, displayText.length - 1));
            }, deletingSpeed);
        } else if (isDeleting && displayText.length === 0) {
            // Move to next item
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % animatedList.length);
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, index, animatedList, prefersReducedMotion]);

    return (
        <FadeIn>
            <div id="home" className="h-screen z-0 items-center flex relative mb-8" >
                <Container>
                    <motion.div
                        style={{
                            scale: useTransform(scrollY, [0, 300], [1, 0.75]),
                        }}
                        className="text-center items-center justify-center my-auto"
                    >
                        {image?.gatsbyImageData &&
                            <GatsbyImage
                                imgClassName='rounded-full'
                                className="rounded-full h-20 w-20 border-0 bg-primary mx-auto"
                                alt="Profile Image"
                                image={image?.gatsbyImageData}
                            />
                        }
                        <h1 className="text-6xl md:text-9xl uppercase tracking-wide">{name}</h1>
                        {animatedList &&
                            <section className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl uppercase relative font-semibold h-16 xxs:h-10 xs:h-12 sm:h-12 md:h-18 lg:h-20">
                                <span className="absolute w-full top-0 left-0">
                                    {displayText}
                                    <span className="ml-1" style={{
                                        display: 'inline-block',
                                        width: '1ch',
                                        backgroundColor: 'currentColor',
                                        animation: 'blink 1s steps(2, start) infinite'
                                    }} />
                                </span>
                                <style>
                                    {`
                    @keyframes blink {
                      0%, 50%, 100% { opacity: 1; }
                      25%, 75% { opacity: 0; }
                    }
                  `}
                                </style>
                            </section>
                        }
                        {tagline &&
                            <div className='mb-4 text-md sm:text-xl max-w-xl mx-auto'
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
