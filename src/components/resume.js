import React, { useState } from 'react'
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import styled from "styled-components"
import { GatsbyImage } from 'gatsby-plugin-image'
import { PlusIcon } from '@heroicons/react/solid'
import FadeIn from './motion/fade-in';

const ResumeWrapper = styled.li`
  border-left: 4px solid var(--primary);
  display: block;
  padding: 0.5rem 3rem 2.5rem;
  margin-left: 1.5rem;
  position: relative;
  ul {
    list-style: outside;
    margin: 0 1rem;
    padding: 0 1rem;
  }
`;


const Resume = ({ timeline }) => {
    const firstSection = timeline.slice(0, 4)
    const [elements, setElements] = useState(firstSection);
    const [selectedArr, setSelectedArr] = useState([]);

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
        <AnimateSharedLayout>
            <motion.ul variants={container}
                initial="hidden"
                animate="show">
                {elements.map((event, index) => {
                    return (

                        <ResumeWrapper >
                            <div className="absolute top-0  -left-5" >
                                {event?.icon?.gatsbyImageData ?
                                    <GatsbyImage imgClassName='rounded-full' className="rounded-full h-10 w-10 border-solid border-primary border-2 bg-primary" alt={event.title} image={event?.icon?.gatsbyImageData} /> :

                                    <div className="rounded-full h-10 w-10 border-solid border-primary border-2 bg-primary" />
                                }
                            </div>
                            <FadeIn>
                                <div className="flex flex-col-reverse justify-between uppercase mb-1 text-lg font-semibold md:flex-row">
                                    <div>{event.company}</div> <div className='md:text-base text-sm pb-4 md:pb-0'>{event?.startDate && `${event.startDate} - ${event.endDate}`}</div>
                                </div>
                                <h3 className="vertical-timeline-element-subtitle text-md font-medium ">{event.jobTitle}</h3>

                                <button className='read-more italic text-grey text-sm py-2' onClick={() => toggleActiveItem(index)}>  {selectedArr.includes(index) ? 'Collapse info' : 'Show more info'}</button>
                                <AnimatePresence>

                                    {selectedArr.includes(index) && <motion.div initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }} dangerouslySetInnerHTML={{ __html: event?.bio?.childMarkdownRemark?.html }} />}

                                </AnimatePresence>
                            </FadeIn>
                        </ResumeWrapper>
                    )
                })}
            </motion.ul >
            {
                elements.length !== timeline.length &&
                <button class="m-auto flex py-2 px-4 rounded-full items-center border-primary border-solid border-2" onClick={(e) => { e.preventDefault(); loadMore(); }}>
                    <PlusIcon className=" h-4 w-4 mr-4" />
                    <span>Load more</span>
                </button>
            }

        </AnimateSharedLayout >

    )
}

export default Resume;

