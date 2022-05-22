import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/solid'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { GatsbyImage } from 'gatsby-plugin-image'
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'

const VerticalLoadMore = ({ timeline }) => {
    const third = Math.ceil(timeline.length / 3);
    const firstSection = timeline.slice(0, 3)
    const [elements, setElements] = useState(firstSection);

    const loadMore = () => {
        console.log('loradmore')
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
                contentStyle={{ background: '#fff', color: '#000' }}
                contentArrowStyle={{ borderRight: '7px solid  #fff' }}
                date={event?.startDate && `${event.startDate} - ${event.endDate}`}
                iconStyle={{ background: '#000', color: '#000' }}
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
                {elements.length !== timeline.length && <button onClick={(e) => { e.preventDefault(); loadMore(); }}><VerticalTimelineElement
                    className='load-more'
                    iconOnClick={loadMore}
                    iconClassName="vertical-timeline-element-icon--button flex"
                    icon={addButton()}
                    textClassName="w-fit h-fit"
                    dateClassName="hidden"
                    iconStyle={{ background: '#fff', color: '#000' }}
                > <p className="vertical-timeline-element-subtitle">Load more</p></VerticalTimelineElement></button>}
            </VerticalTimeline>
        </div>
    );
};

export default VerticalLoadMore;