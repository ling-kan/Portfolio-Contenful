import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react";
import styled from "styled-components"
import { GatsbyImage } from 'gatsby-plugin-image'
import { PlusIcon } from '@heroicons/react/24/solid'
import FadeIn from './motion/fade-in';

const ResumeWrapper = styled.li`
  border-left: 4px solid var(--primary);
  display: block;
  padding: 0.5rem 0 2rem 2.5rem;
  position: relative;
  margin-left:1rem;

  ul {
    margin: 0;
        padding: 0;
  list-style-type: none;

  > li {
    text-indent: 0px;
    &:before {
      content: "-";
      text-indent: 0px;
      margin-right: 10px;
    }
}
    }
  @media (min-width: var(--xs-mq)) {
    margin-left: 1.5rem;
    padding: 0.5rem 3rem 2.5rem;
  } 
`;

const Resume = ({ timeline }) => {
    const firstSection = timeline.slice(0, 6)
    const [elements, setElements] = useState(firstSection);
    const [selectedArr, setSelectedArr] = useState([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.5
            }
        }
    }

    return (
        <>
            <motion.ul variants={container}
                initial="hidden"
                animate="show"
                className="ml-0 sm:ml-3 mt-0 md:mt-6" id="timeline">
                {elements.map((event, index) => {
                    return (
                        <ResumeWrapper key={index}>
                            <div className="absolute top-0 -left-5" >
                                {event?.icon?.gatsbyImageData ?
                                    <GatsbyImage imgClassName='rounded-full' className="rounded-full h-10 w-10 border-solid border-grey-light border-1 bg-primary" alt={event?.title || "Company logo"} image={event?.icon?.gatsbyImageData} /> :
                                    <div className="rounded-full h-10 w-10 border-solid border-grey-light border-1 bg-primary" alt="Company logo" />
                                }
                            </div>
                            <FadeIn>
                                <div className="flex flex-col-reverse justify-between uppercase mb-1 text-lg font-semibold md:flex-row">
                                    <div>{event.company}</div> <div className='md:text-base text-sm mb-4 md:mb-0'>{event?.startDate && `${event.startDate} - ${event.currentRole ? "CURRENT" : event.endDate}`}</div>
                                </div>
                                <h3 className="vertical-timeline-element-subtitle text-md font-medium mb-2">{event.jobTitle}</h3>
                                {isClient && event?.description?.childMarkdownRemark?.html && (
                                    <p className="text-sm mb-2 text-grey"
                                        dangerouslySetInnerHTML={{ __html: event.description.childMarkdownRemark.html }} />
                                )}
                                <div className="italic text-sm text-link inline text-underline text-blue-dark" onClick={() => toggleActiveItem(index)} onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        toggleActiveItem(index);
                                    }
                                }}
                                    role="button"
                                    tabIndex={0}>  {selectedArr.includes(index) ? '- Read less' : '+ Read more'}</div>
                                <AnimatePresence>
                                    {selectedArr.includes(index) && <motion.div initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }} dangerouslySetInnerHTML={{ __html: event?.bio?.childMarkdownRemark?.html }} className='my-3 text-sm' />}

                                </AnimatePresence>
                            </FadeIn>
                        </ResumeWrapper>
                    )
                })}
            </motion.ul >
            {
                elements.length !== timeline.length &&
                <button className="m-auto flex py-2 px-4 rounded-md items-center" onClick={(e) => { e.preventDefault(); loadMore(); }}>
                    <PlusIcon className=" h-4 w-4 mr-4 fill-blue" />
                    <span>Load more</span>
                </button>
            }

        </ >

    )
}

export default Resume;

