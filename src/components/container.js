import React from 'react'

const Container = ({ id, className, pageId, children, as = 'div', subtitle }) => {
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
      className={`${className} ${pageId === "home" ? 'pt-0 pb-16 md:pb-16' : 'py-6 md:py-16'}} my-0 mx-auto`} >
      {children}
    </Tag >
  )
}

export default Container
