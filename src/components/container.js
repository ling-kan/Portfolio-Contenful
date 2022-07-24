import React from 'react'

const Container = ({ id, className, pageId, children, as = 'div' }) => {
  const Tag = as
  return (
    <Tag
      id={id}
      style={{
        width: '100%',
        maxWidth: 'var(--size-max-width)',
        paddingLeft: 'var(--size-gutter)',
        paddingRight: 'var(--size-gutter)',
        height: `${pageId === "navigation" && ' var(--nav-height)'}`
      }}
      className={`${className} ${pageId === "home" ? 'py-16' : 'py-4'} my-0 mx-auto`}
    >

      {children}
    </Tag >
  )
}

export default Container
