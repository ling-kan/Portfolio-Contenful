import React from 'react'

const Container = ({ thinPadding, children, as = 'div' }) => {
  const Tag = as

  return (
    <Tag
      style={{
        width: '100%',
        maxWidth: 'var(--size-max-width)',
        margin: '0 auto',
        padding: `${thinPadding ? 'var(--space-xl)' : 'var(--space-3xl)'} var(--size-gutter)`,
      }}
    >
      {children}
    </Tag>
  )
}

export default Container
