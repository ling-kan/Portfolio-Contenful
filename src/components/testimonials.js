import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Stagger, StaggerItem } from './motion/reveal'

// Quotes from the "Testimonial" content type; the section is hidden when there are none
const Testimonials = ({ items = [] }) => (
  <Stagger as="ul" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0">
    {items.map((t) => (
      <StaggerItem as="li" key={`${t.name}-${t.quote.slice(0, 20)}`} className="list-none">
        <figure className="h-full flex flex-col justify-between rounded-[1.5rem] border border-line bg-paper/70 p-8 m-0">
          <blockquote className="m-0 text-lg leading-relaxed text-ink">
            <span aria-hidden="true" className="block font-[family-name:var(--font-accent)] text-5xl leading-none text-accent mb-2">
              “
            </span>
            {t.quote}
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            {t.photo?.gatsbyImageData && (
              <GatsbyImage image={t.photo.gatsbyImageData} alt="" className="w-12 h-12 rounded-full shrink-0" imgClassName="rounded-full object-cover" />
            )}
            <span>
              <span className="block font-semibold text-ink">{t.name}</span>
              {(t.role || t.company) && <span className="block text-sm text-ink/75">{[t.role, t.company].filter(Boolean).join(', ')}</span>}
            </span>
          </figcaption>
        </figure>
      </StaggerItem>
    ))}
  </Stagger>
)

export default Testimonials
