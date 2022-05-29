import React from 'react'

const Container = ({ className, navigation, children, as = 'div' }) => {
  const Tag = as
  return (
    <Tag
      style={{
        width: '100%',
        maxWidth: 'var(--size-max-width)',
      }}
      className={`my-0 mx-auto px-6 ${navigation ? 'py-4' : 'py-6'} ${className}`}
    >
      {children}
    </Tag >
  )
}

export default Container
