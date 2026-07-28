import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "motion/react";
import { GatsbyImage } from 'gatsby-plugin-image'
import { PlusIcon } from '@heroicons/react/24/solid'

const EASE = [0.22, 1, 0.36, 1];

const Resume = ({ timeline, idPrefix = 'timeline' }) => {
    const firstSection = timeline.slice(0, 6)
    const [elements, setElements] = useState(firstSection);
    const [selectedArr, setSelectedArr] = useState([]);
    const trackRef = useRef(null);
    const prefersReduced = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start 70%', 'end 55%'],
    });
    const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useEffect(() => {
        setElements(timeline.slice(0, 6));
    }, [timeline]);

    const loadMore = () => {
        setElements(timeline);
    };

    const toggleActiveItem = (index) => {
        if (selectedArr.includes(index)) {
            setSelectedArr(selectedArr.filter((i) => i !== index))
        } else {
            setSelectedArr([...selectedArr, index])
        }
    }

    return (
        <>
            <div ref={trackRef} className="relative">
                <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
                <motion.div
                    style={{ scaleY: prefersReduced ? 1 : lineScale }}
                    className="absolute left-[11px] top-3 bottom-3 w-px origin-top bg-accent"
                />

                <ol className="flex flex-col" id="timeline">
                    {elements.map((event, index) => {
                        const isOpen = selectedArr.includes(index);
                        const period = event?.startDate && `${event.startDate} - ${event.currentRole ? "Current" : event.endDate}`;

                        return (
                            <motion.li
                                key={index}
                                initial={prefersReduced ? false : { opacity: 0, x: 16 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
                                className="relative pl-12"
                            >
                                <div className="absolute left-0 top-6 z-10">
                                    {event?.icon?.gatsbyImageData ? (
                                        <GatsbyImage
                                            imgClassName="rounded-full"
                                            className="h-4 w-4 rounded-full ring-4 ring-card"
                                            alt={event?.jobTitle || "Company logo"}
                                            image={event.icon.gatsbyImageData}
                                        />
                                    ) : (
                                        <motion.span
                                            aria-hidden
                                            animate={{
                                                scale: isOpen ? 1.3 : 1,
                                                backgroundColor: isOpen ? 'var(--accent)' : 'var(--card)',
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="block h-4 w-4 rounded-full border-2 border-accent ring-4 ring-card"
                                        />
                                    )}
                                </div>

                                <div className="border-b border-border/70">
                                    <button
                                        type="button"
                                        onClick={() => toggleActiveItem(index)}
                                        aria-expanded={isOpen}
                                        aria-controls={`${idPrefix}-panel-${index}`}
                                        className="group flex w-full items-center gap-4 rounded-lg py-6 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-card"
                                    >
                                        <div className="min-w-0 flex-1">
                                            {period && (
                                                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                                    {period}
                                                </span>
                                            )}
                                            <h4 className="mt-1.5 font-serif text-xl font-semibold text-foreground transition-colors group-hover:text-accent sm:text-2xl">
                                                {event.jobTitle}
                                            </h4>
                                            <p className="mt-0.5 font-serif text-base italic text-accent">
                                                {event.company}
                                            </p>
                                        </div>

                                        <motion.span
                                            aria-hidden
                                            animate={{
                                                rotate: isOpen ? 135 : 0,
                                                backgroundColor: isOpen ? 'var(--accent)' : 'rgba(0,0,0,0)',
                                                color: isOpen ? 'var(--accent-foreground)' : 'var(--foreground)',
                                            }}
                                            transition={{ duration: 0.3, ease: EASE }}
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent"
                                        >
                                            <PlusIcon className="h-5 w-5" />
                                        </motion.span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                id={`${idPrefix}-panel-${index}`}
                                                key="content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: EASE }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-8">
                                                    {event?.description?.childMarkdownRemark?.html && (
                                                        <div
                                                            className="max-w-xl text-sm leading-relaxed text-foreground/70"
                                                            dangerouslySetInnerHTML={{
                                                                __html: event.description.childMarkdownRemark.html,
                                                            }}
                                                        />
                                                    )}
                                                    {event?.bio?.childMarkdownRemark?.html && (
                                                        <div
                                                            className="mt-5 max-w-xl text-sm leading-relaxed text-foreground/85"
                                                            dangerouslySetInnerHTML={{
                                                                __html: event.bio.childMarkdownRemark.html,
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.li>
                        )
                    })}
                </ol>
            </div>

            {elements.length !== timeline.length && (
                <button
                    type="button"
                    className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:text-foreground"
                    onClick={(e) => { e.preventDefault(); loadMore(); }}
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Load more</span>
                </button>
            )}
        </>
    )
}

export default Resume;
