import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import imagery from '../data/imagery'

/* global __IMAGERY_FILES__ */
const available = typeof __IMAGERY_FILES__ !== 'undefined' ? __IMAGERY_FILES__ : []

/** True when artwork exists for a slot: a Contentful asset (`image`) or a file in static/images. */
export const hasImage = (slot, image) => !!image || available.includes(imagery[slot]?.file)

/** True when the slot has artwork to render. */
export const slotVisible = hasImage

/**
 * Renders a slot's artwork, preferring the Contentful asset (`image` = gatsbyImageData),
 * then static/images/<file>. Renders nothing when neither source exists.
 */
const ImageSlot = ({ slot, image, alt, className = '', imgClassName = 'object-cover' }) => {
  const meta = imagery[slot]
  if (!meta) return null

  if (image) {
    // Wrapper carries positioning: .gatsby-image-wrapper forces position: relative
    return (
      <div className={`w-full h-full ${className}`}>
        <GatsbyImage image={image} alt={alt ?? meta.alt} className="w-full h-full" imgClassName={imgClassName} />
      </div>
    )
  }

  if (!hasImage(slot)) return null

  return (
    <img
      src={`/images/${meta.file}`}
      alt={alt ?? meta.alt}
      loading="lazy"
      decoding="async"
      className={`w-full h-full ${imgClassName} ${className}`}
    />
  )
}

export default ImageSlot
