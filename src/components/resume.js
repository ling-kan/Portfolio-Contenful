import React, { useState } from 'react'
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import styled from "styled-components"
import { GatsbyImage } from 'gatsby-plugin-image'
import { PlusIcon } from '@heroicons/react/solid'

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

    return (
        <AnimateSharedLayout>
            <AnimatePresence>
                <ul>
                    {elements.map((event, index) => {
                        return (

                            <ResumeWrapper >
                                <GatsbyImage className="absolute rounded-full h-10 w-10 top-0  -left-5 border-solid border-primary border-2" alt={event.title} image={event?.icon?.gatsbyImageData} />

                                <div className="flex flex-col-reverse justify-between uppercase mb-1 text-lg font-semibold md:flex-row">
                                    <div>{event.company}</div> <div className='md:text-base text-sm pb-4 md:pb-0'>{event?.startDate && `${event.startDate} - ${event.endDate}`}</div>
                                </div>
                                <h3 className="vertical-timeline-element-subtitle text-md font-medium ">{event.jobTitle}</h3>
                                <motion.div layout>
                                    <button className='read-more italic text-grey text-sm py-2' onClick={() => toggleActiveItem(index)}>  {selectedArr.includes(index) ? 'Collapse info' : 'Show more info'}</button>


                                    {selectedArr.includes(index) && <div dangerouslySetInnerHTML={{ __html: event?.bio?.childMarkdownRemark?.html }} />}
                                </motion.div>

                            </ResumeWrapper>
                        )
                    })}
                </ul >
                {elements.length !== timeline.length &&
                    <button class="m-auto flex py-2 px-4 rounded-full items-center border-white border-solid border-2" onClick={(e) => { e.preventDefault(); loadMore(); }}>
                        <PlusIcon className=" h-4 w-4 mr-4" />
                        <span>Load more</span>
                    </button>}
            </AnimatePresence>
        </AnimateSharedLayout>

    )
}

export default Resume;

