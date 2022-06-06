import React from 'react'

const Container = ({ className, navigation, children, as = 'div' }) => {
  const Tag = as
  return (
    <Tag
      style={{
        width: '100%',
        maxWidth: 'var(--size-max-width)',
        paddingLeft: 'var(--size-gutter)',
        paddingRight: 'var(--size-gutter)',
        height: `${navigation && ' var(--nav-height)'}`
      }}
      className={`my-0 mx-auto ${navigation ? 'py-4' : 'py-6'} ${className}`}
    >

      {children}
    </Tag >
  )
}

export default Container
