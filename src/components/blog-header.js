import React from 'react'
import Container from './container';
import Tags from './tags';

const BlogHeader = ({ title, content, rawDate, endDate, timeToRead, tags }) => {
  return (
    <div className="grid grid-col-2 text-black mt-24 ">
      <Container>
        <h1 className="text-center text-3xl md:text-3xl mb-2 uppercase" >{title}</h1>
        {content && <p className="text-center text-1xl mb-2 italic">{content}</p>}
        <p className="text-center text-grey italic">
          <time dateTime={rawDate}>{endDate}</time>
          {timeToRead && <p> –{' '}
            {timeToRead} minute read</p>}
          {tags &&
            <Tags tags={tags} />}
        </p>
      </Container>
    </div>
  )
}

export default BlogHeader
