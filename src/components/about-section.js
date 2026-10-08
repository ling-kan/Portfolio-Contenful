import React, { useRef } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, useScroll, useTransform } from 'motion/react'
import ImageSlot, { hasImage } from './image-slot'

// Split markdown HTML into top-level blocks so each one can animate on its own.
const toBlocks = (html = '') => {
  const blocks = html.match(/<(p|ul|ol|blockquote|h[1-6])[\s>][\s\S]*?<\/\1>/g)
  // Only split if the blocks account for all of the content (no nested lists, tables, stray text...)
  const strip = (s) => s.replace(/\s+/g, '')
  return blocks && strip(blocks.join('')) === strip(html) ? blocks : [html]
}

const InkBlock = ({ html }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.45'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.18, 1])

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { opacity }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const AboutSection = ({ html, image, imageAlt, caption = '' }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const withImage = hasImage('about', image)

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {withImage && (
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <motion.figure
            style={reduce ? undefined : { y: artY }}
            className="mobile-image-frame relative rounded-[1.5rem] bg-sand overflow-hidden aspect-[16/10] lg:aspect-[4/3.4] max-w-2xl lg:max-w-none"
          >
            <ImageSlot slot="about" image={image} alt={imageAlt} className="absolute inset-0" />
            {caption && (<figcaption className="absolute bottom-5 left-6 right-6 flex justify-between eyebrow text-paper drop-shadow">
              <span>Fig. 01</span>
              <span>{caption}</span>
            </figcaption>)}
          </motion.figure>
        </div>
      )}

      <div className={`${withImage ? 'lg:col-span-7' : 'lg:col-span-12'} rich-text text-lg md:text-[1.375rem] leading-relaxed tracking-tight text-ink space-y-6 font-sans`}>
        {toBlocks(html).map((block, i) => (
          <InkBlock key={i} html={block} />
        ))}
      </div>
    </div>
  )
}

export default AboutSection
