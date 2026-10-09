import React from 'react'
import { Reveal } from './motion/reveal'
import ImageSlot, { hasImage } from './image-slot'

// Preserve spacing between top-level rich-text blocks.
const toBlocks = (html = '') => {
  const blocks = html.match(/<(p|ul|ol|blockquote|h[1-6])[\s>][\s\S]*?<\/\1>/g)
  // Only split if the blocks account for all of the content (no nested lists, tables, stray text...)
  const strip = (s) => s.replace(/\s+/g, '')
  return blocks && strip(blocks.join('')) === strip(html) ? blocks : [html]
}

const AboutSection = ({ html, image, imageAlt, caption = '' }) => {
  const withImage = hasImage('about', image)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {withImage && (
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal
            as="figure"
            className="mobile-image-frame relative rounded-[1.5rem] bg-sand overflow-hidden aspect-[16/10] lg:aspect-[4/3.4] max-w-2xl lg:max-w-none"
          >
            <ImageSlot slot="about" image={image} alt={imageAlt} className="absolute inset-0" />
            {caption && (<figcaption className="absolute bottom-5 left-6 right-6 flex justify-between eyebrow text-paper drop-shadow">
              <span>Fig. 01</span>
              <span>{caption}</span>
            </figcaption>)}
          </Reveal>
        </div>
      )}

      <div className={`${withImage ? 'lg:col-span-7' : 'lg:col-span-12'} rich-text text-lg md:text-[1.375rem] leading-relaxed tracking-tight text-ink space-y-6 font-sans`}>
        {toBlocks(html).map((block, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: block }} />
        ))}
      </div>
    </div>
  )
}

export default AboutSection
