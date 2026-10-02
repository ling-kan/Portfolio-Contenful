import React from 'react'
import { Stagger, StaggerItem } from './motion/reveal'

// Used until "Value Pillar" entries exist in Contentful
const DEFAULT_PILLARS = [
  {
    title: 'Experience design',
    description: 'User-centred UX, from research and journey mapping to polished, accessible interfaces.',
  },
  {
    title: 'Conversion & growth',
    description: 'Data-led CRO, A/B testing and analytics that turn traffic into measurable results.',
  },
  {
    title: 'Front-end delivery',
    description: 'Hands-on development with modern web technology, so ideas ship quickly and scale.',
  },
]

const ValuePillars = ({ items, label = 'What I bring' }) => {
  const pillars = items?.length ? items : DEFAULT_PILLARS
  return (
    <div className="mt-20 md:mt-28">
      <p className="eyebrow text-ink/75 mb-8">{label}</p>
      <Stagger
        as="ul"
        className={`grid grid-cols-1 ${pillars.length % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-px bg-line rounded-[1.5rem] overflow-hidden border border-line p-0 m-0`}
      >
        {pillars.map((p, i) => (
          <StaggerItem as="li" key={p.title} className="list-none bg-paper p-8 md:p-10">
            <span className="eyebrow text-accent">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-6 display-md !text-[clamp(1.4rem,2vw,1.75rem)] text-ink">{p.title}</h3>
            {p.description && <p className="mt-3 text-ink/75 leading-relaxed">{p.description}</p>}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

export default ValuePillars
