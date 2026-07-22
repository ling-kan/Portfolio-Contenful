import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { useReducedMotion } from "motion/react"
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import FadeIn from './motion/fade-in'

const HomeHero = ({ name, animatedList, image, tagline }) => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!animatedList?.length || !isMounted) return;

        if (prefersReducedMotion) {
            setDisplayText(animatedList.join(", "));
            return;
        }

        const currentText = animatedList[index];

        const typingSpeed = 150;
        const deletingSpeed = 50;
        const pauseTime = 4000;

        let timeout;

        if (!isDeleting && displayText.length < currentText.length) {
            timeout = setTimeout(() => {
                setDisplayText(currentText.substring(0, displayText.length + 1));
            }, typingSpeed);
        } else if (!isDeleting && displayText.length === currentText.length) {
            timeout = setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && displayText.length > 0) {
            timeout = setTimeout(() => {
                setDisplayText(currentText.substring(0, displayText.length - 1));
            }, deletingSpeed);
        } else if (isDeleting && displayText.length === 0) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % animatedList.length);
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, index, animatedList, prefersReducedMotion, isMounted]);

    const nameParts = name?.trim().split(/\s+/) || [];
    const firstName = nameParts[0]?.toUpperCase() || 'LING';
    const lastName = nameParts.slice(1).join(' ').toUpperCase() || 'KAN';

    return (
        <FadeIn>
            <section id="top" className="px-6 pt-36 sm:px-12 sm:pt-44 lg:pt-48">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                        <div>
                            <h1 className="font-serif text-6xl font-semibold leading-[0.92] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                                {firstName}
                                <br />
                                {lastName}
                            </h1>

                            <div className="mt-8 max-w-md">
                                <div className="flex items-center gap-4">
                                    {animatedList && (
                                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground min-h-[1rem]">
                                            {isMounted ? displayText : ''}
                                            {!prefersReducedMotion && isMounted && (
                                                <span
                                                    className="ml-1 inline-block w-[1ch] bg-current animate-pulse"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </span>
                                    )}
                                    <span className="h-px flex-1 bg-border" />
                                    {image?.gatsbyImageData && (
                                        <GatsbyImage
                                            imgClassName="rounded-full"
                                            className="h-10 w-10 shrink-0 rounded-full"
                                            alt="Profile Image"
                                            image={image.gatsbyImageData}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:pb-2">
                            {tagline && (
                                <div
                                    className="max-w-sm text-pretty text-sm leading-relaxed text-foreground/80 sm:text-base"
                                    dangerouslySetInnerHTML={{
                                        __html: tagline.childMarkdownRemark.html,
                                    }}
                                />
                            )}
                            <Link
                                to="/#contact"
                                className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                Let&apos;s connect
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </FadeIn>
    )
}

export default HomeHero;
