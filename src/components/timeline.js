import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const Timeline = ({ timeline }) => {
  if (!timeline) return null
  if (!Array.isArray(timeline)) return null

  return (
    <VerticalTimeline>
      {timeline.map((event) => {
        return (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#fff', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid  #fff' }}
            date={`${event.startDate} - ${event.endDate}`}
            iconStyle={{ background: '#000', color: '#000' }}
            icon={<GatsbyImage alt={event.title} image={event.icon.gatsbyImageData} />}
          >
            <h4 className="vertical-timeline-element-subtitle">{event.company}</h4>
            <p>
              {event.bio.bio}
            </p> </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
  )
}

export default Timeline
