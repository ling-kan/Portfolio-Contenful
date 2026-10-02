import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import Marquee from './motion/marquee'

/**
 * Quiet ticker of company logos from the timeline, greyscale until hovered.
 */
const LogoStrip = ({ items = [], label = 'Organisations I’ve worked with' }) => {
  const seen = new Set()
  const logos = items.filter((e) => {
    if (!e?.icon?.gatsbyImageData || seen.has(e.company)) return false
    seen.add(e.company)
    return true
  })
  if (logos.length < 3) return null

  return (
    <div className="mb-16 md:mb-20">
      <p className="eyebrow text-ink/75 mb-6">{label}</p>
      <Marquee duration={35} gap="1rem">
        {logos.map((e) => (
          <span
            key={e.company}
            title={e.company}
            className="group flex items-center gap-3 shrink-0 rounded-full border border-line bg-white/60 pl-1.5 pr-4 py-1.5"
          >
            <span className="w-8 h-8 rounded-full overflow-hidden bg-white grid place-items-center">
              <GatsbyImage
                image={e.icon.gatsbyImageData}
                alt=""
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                imgClassName="object-contain p-1"
              />
            </span>
            <span className="text-sm font-medium text-ink/75 group-hover:text-ink whitespace-nowrap transition-colors">{e.company}</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}

export default LogoStrip
