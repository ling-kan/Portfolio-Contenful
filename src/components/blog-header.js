import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import Container from './container'
import Tags from './tags'
import ImageSlot, { slotVisible } from './image-slot'
import { Reveal, SplitText } from './motion/reveal'

const BlogHeader = ({ title, eyebrow = 'Portfolio', content, rawDate, endDate, timeToRead, tags, image, slot, slotImage, children }) => {
  return (
    <header className="relative isolate overflow-hidden -mt-20 md:-mt-20 pt-24 md:pt-26 pb-12 md:pb-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-40 right-0 w-[34rem] h-[34rem] rounded-full bg-mint/50 blur-[110px]" />
        <div className="absolute top-20 -left-40 w-[26rem] h-[26rem] rounded-full bg-accent-soft/70 blur-[110px]" />
      </div>

      <Container>
        <Reveal y={16}>
          <p className="eyebrow text-ink/75 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {eyebrow}
          </p>
        </Reveal>
        <SplitText as="h1" text={title} animateOnMount className="display-lg block mt-6 max-w-5xl text-ink" />
        {content && (
          <p className="lead mt-6 max-w-2xl text-ink/75">{content}</p>
        )}

        {(endDate || timeToRead || tags?.length > 0) && (
          <Reveal delay={0.12} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-line">
            {endDate && (
              <div>
                <p className="eyebrow !text-[0.7rem] text-ink/75">Date</p>
                <time dateTime={rawDate} className="font-medium text-ink">{endDate}</time>
              </div>
            )}
            {timeToRead && (
              <div>
                <p className="eyebrow !text-[0.7rem] text-ink/75">Reading time</p>
                <p className="font-medium text-ink">{timeToRead} min read</p>
              </div>
            )}
            {tags?.length > 0 && <Tags tags={tags} className="sm:ml-auto" />}
          </Reveal>
        )}
        {children}
      </Container>

      {image && (
        <Container className="mt-12 md:mt-16">
          <Reveal className="mobile-image-frame relative aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-sand">
            <GatsbyImage image={image} alt={title} className="w-full h-full" imgClassName="object-cover" />
          </Reveal>
        </Container>
      )}

      {/* Optional AI artwork banner for index pages (see src/data/imagery.js) */}
      {!image && slot && slotVisible(slot, slotImage) && (
        <Container className="mt-12 md:mt-16">
          <Reveal className="mobile-image-frame relative aspect-[16/9] sm:aspect-[12/5] rounded-[1.5rem] overflow-hidden bg-sand">
            <ImageSlot slot={slot} image={slotImage} />
          </Reveal>
        </Container>
      )}
    </header>
  )
}

export default BlogHeader
