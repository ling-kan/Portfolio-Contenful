import React from 'react'

const Tags = ({ tags }) =>
  tags?.length > 0 && (
    <small className="flex flex-wrap gap-1 justify-center mt-4" >
      {tags.map((tag) => (
        <div key={tag} className="bg-primary text-sm rounded-md px-2.5 py-1 text-black hover:text-black" >
          {tag}
        </div>
      ))}
    </small>
  )

export default Tags
