import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import imagery from '../data/imagery'

/* global __IMAGERY_FILES__ */
const available = typeof __IMAGERY_FILES__ !== 'undefined' ? __IMAGERY_FILES__ : []
const isDev = process.env.NODE_ENV === 'development'

/** True when artwork exists for a slot: a Contentful asset (`image`) or a file in static/images. */
export const hasImage = (slot, image) => !!image || available.includes(imagery[slot]?.file)

/** True when the slot renders something: the artwork, or a placeholder during development. */
export const slotVisible = (slot, image) => hasImage(slot, image) || isDev

/**
 * Renders a slot's artwork, preferring the Contentful asset (`image` = gatsbyImageData),
 * then static/images/<file>. Otherwise: a labelled placeholder in development, `fallback` in production.
 */
const ImageSlot = ({ slot, image, alt, className = '', imgClassName = 'object-cover', fallback = null, dark = false }) => {
  const meta = imagery[slot]
  if (!meta) return fallback

  if (image) {
    // Wrapper carries positioning: .gatsby-image-wrapper forces position: relative
    return (
      <div className={`w-full h-full ${className}`}>
        <GatsbyImage image={image} alt={alt ?? meta.alt} className="w-full h-full" imgClassName={imgClassName} />
      </div>
    )
  }

  if (hasImage(slot)) {
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

  if (!isDev) return fallback

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-2 text-center p-6 border-2 border-dashed ${
        dark ? 'border-paper/25 bg-paper/5 text-paper/70' : 'border-ink/20 bg-white/60 text-ink/75'
      } ${className}`}
      title={meta.prompt}
    >
      <span className="eyebrow">Image placeholder</span>
      <span className="text-sm font-semibold">Upload in Contentful, or static/images/{meta.file}</span>
      <span className="text-xs opacity-80">{meta.size}</span>
      <span className="text-[0.7rem] opacity-60 max-w-xs">Prompt in src/data/imagery.js · dev only</span>
    </div>
  )
}

export default ImageSlot
