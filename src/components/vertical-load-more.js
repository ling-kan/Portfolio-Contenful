import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/solid'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { GatsbyImage } from 'gatsby-plugin-image'
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'

const VerticalLoadMore = ({ timeline }) => {
    const firstSection = timeline.slice(0, 3)
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
                date={event?.startDate && `${event.startDate} - ${event.endDate}`}

                icon={<GatsbyImage alt={event.title} image={event?.icon?.gatsbyImageData} />}
            >
                <h4 className="vertical-timeline-element-subtitle">{event.company} - {event.jobTitle}</h4>
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