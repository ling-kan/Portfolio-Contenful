import React from 'react'

const Container = ({ darkMode, children, as = 'div' }) => {
  const Tag = as

  return (
    <Tag
      style={{
        maxWidth: 'var(--size-max-width)',
        margin: '0 auto',
        padding: 'var(--space-xl) var(--size-gutter)',
      }}
      className={!darkMode && "bg-white dark:bg-black"}
    >      {children}
    </Tag>
  )
}

export default Container
