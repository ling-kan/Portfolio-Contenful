import React from 'react'

const Container = ({ navigation, children, as = 'div' }) => {
  const Tag = as

  return (
    <Tag
      style={{
        width: '100%',
        maxWidth: 'var(--size-max-width)',
        margin: '0 auto',
        padding: `${navigation ? 'var(--space-lg)' : 'var(--space-2xl)'} var(--size-gutter)`,
      }}
    >
      {children}
    </Tag>
  )
}

export default Container
