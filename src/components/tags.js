import React from 'react'

const Tags = ({ tags, className = '' }) =>
  tags?.length > 0 && (
    <ul className={`flex flex-wrap gap-2 p-0 m-0 ${className}`}>
      {tags.map((tag) => (
        <li key={tag} className="list-none rounded-full border border-line bg-paper/60 px-3 py-1 text-xs font-medium text-ink/80">
          {tag}
        </li>
      ))}
    </ul>
  )

export default Tags
