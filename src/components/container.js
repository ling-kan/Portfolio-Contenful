import React from 'react'

const Container = ({ id, className = '', pageId, children, as = 'div', style, ...rest }) => {
  const Tag = as
  return (
    <Tag
      {...rest}
      id={id}
      style={{
        width: '100%',
        maxWidth: 'var(--size-max-width)',
        paddingLeft: 'var(--size-gutter)',
        paddingRight: 'var(--size-gutter)',
        height: pageId === 'navigation' ? 'var(--nav-height)' : undefined,
        ...style,
      }}
      className={`mx-auto ${className}`}
    >
      {children}
    </Tag>
  )
}

export default Container
