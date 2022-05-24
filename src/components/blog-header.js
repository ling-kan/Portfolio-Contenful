import React from 'react'
import Container from './container';

const BlogHeader = ({ title, content, rawDate, endDate, timeToRead }) => {
  return (
    <div className="grid grid-col-2 text-secondary mt-24 ">
      <Container>
        <h1 className="text-center text-3xl md:text-3xl mb-2 uppercase" >{title}</h1>
        {content && <p className="text-center text-1xl mb-2 italic">{content}</p>}
        <p className="text-center text-gray-800 italic">
          <time dateTime={rawDate}>{endDate}</time>
          {timeToRead && <p> –{' '}
            {timeToRead} minute read</p>}
        </p>
      </Container>
    </div>
  )
}

export default BlogHeader
