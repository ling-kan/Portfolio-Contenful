import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/solid'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { GatsbyImage } from 'gatsby-plugin-image'
import 'react-vertical-timeline-component/style.min.css';
import './timeline.scss'

const VerticalLoadMore = ({ timeline }) => {
    const firstSection = timeline.slice(0, 5)
    const [elements, setElements] = useState(firstSection);

    const loadMore = () => {
        setElements(timeline);
    };

    const addButton = () => {
        return (
            <PlusIcon className="relative m-auto h-full w-full" />
        )
    };

    const getTimelineElements = () =>
        elements.map(event => (
            <VerticalTimelineElement {...event.props}
                className="vertical-timeline-element--work"
                dateClassName="hidden"
                icon={<GatsbyImage alt={event.title} image={event?.icon?.gatsbyImageData} />}
            >
                <div className="flex justify-between uppercase mb-1 text-lg font-semibold">
                    <div>{event.company}</div> <div>{event?.startDate && `${event.startDate} - ${event.endDate}`}</div>
                </div>
                <h3 className="vertical-timeline-element-subtitle italic text-md font-medium">{event.jobTitle}</h3>
                <div dangerouslySetInnerHTML={{ __html: event?.bio?.childMarkdownRemark?.html }} />
            </VerticalTimelineElement >
        ));
    return (
        <div>
            <VerticalTimeline layout='1-column-left'>
                {getTimelineElements()}
                {elements.length !== timeline.length && <button className="flex m-auto" onClick={(e) => { e.preventDefault(); loadMore(); }}><VerticalTimelineElement
                    className='vertical-timeline-element--load-more'
                    iconOnClick={loadMore}
                    iconClassName="vertical-timeline-element-icon--button"
                    icon={addButton()}
                    textClassName="w-fit h-fit flex"
                    dateClassName="hidden"
                    iconStyle={{ background: '#fff', color: '#000' }}
                > <p className="vertical-timeline-element-subtitle flex">   <PlusIcon className="my-auto mr-1 h-4 w-4" /> Load more</p></VerticalTimelineElement></button>}
            </VerticalTimeline>
        </div>
    );
};

export default VerticalLoadMore;