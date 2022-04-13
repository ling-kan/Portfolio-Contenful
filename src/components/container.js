import React from 'react'

const Container = ({ darkMode = false, thinPadding, children, as = 'div' }) => {
  const Tag = as

  return (
    <Tag
      style={{
        maxWidth: 'var(--size-max-width)',
        margin: '0 auto',
        padding: `${thinPadding ? 'var(--space-xl)' : 'var(--space-3xl)'} var(--size-gutter)`,
      }}
      className={`${darkMode ? "dark:bg-black" : ""}`}
    >
      {children}
    </Tag>
  )
}

export default Container
