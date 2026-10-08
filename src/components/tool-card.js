import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import Tags from './tags'
import { Stagger, StaggerItem } from './motion/reveal'

const ToolCard = ({ cards }) => {
  if (!Array.isArray(cards)) return null
  return (
    <Stagger as="ul" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0">
      {cards.map((card) => (
        <StaggerItem as="li" key={card.id} className="list-none">
          <a
            href={card.link}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col h-full rounded-[1.5rem] border border-line bg-white/60 hover:bg-white overflow-hidden !text-ink hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(23,51,43,0.4)] transition-all duration-500"
          >
            {card.image?.gatsbyImageData && (
              <div className="relative aspect-[16/10] bg-sand overflow-hidden">
                <GatsbyImage
                  alt={card.title}
                  image={card.image.gatsbyImageData}
                  className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  imgClassName="object-cover"
                />
                <span className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full glass group-hover:bg-accent transition-colors duration-300">
                  <ArrowUpRightIcon className="w-4 h-4 no-fill fill-ink group-hover:fill-white group-hover:rotate-45 transition-all duration-500" />
                </span>
              </div>
            )}
            <div className="flex flex-col flex-1 p-6">
              <p className="eyebrow !text-[0.7rem] text-ink/75">{card.date || card.createdAt || card.updatedAt}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight group-hover:text-accent transition-colors">{card?.title}</h3>
              {card?.description?.childMarkdownRemark?.html && (
                <div
                  className="rich-text mt-3 text-ink/75 text-base"
                  dangerouslySetInnerHTML={{ __html: card.description.childMarkdownRemark.html }}
                />
              )}
              <Tags tags={card?.tag} className="mt-auto pt-6" />
            </div>
          </a>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

export default ToolCard
