import React from 'react'

const Tags = ({ tags }) =>
  tags?.length > 0 && (
    <small className="flex gap-1" >
      {tags.map((tag) => (
        <div key={tag} className="bg-gray-200 rounded-md px-2.5 py-1" >
          {tag}
        </div>
      ))}
    </small>
  )

export default Tags
