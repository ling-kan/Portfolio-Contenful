import React from 'react'

const TableOfContents = ({ list }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: list,
      }}
    />
  )
}

export default TableOfContents
