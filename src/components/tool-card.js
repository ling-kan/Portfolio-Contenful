import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import Tags from './tags'
import FadeIn from './motion/fade-in'

const ToolCard = ({ cards }) => {
    if (!cards) return null
    if (!Array.isArray(cards)) return null
    return (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cards.map((card) => {
                return (
                    <FadeIn key={card.id}>
                        <div className='md:max-w-lg md:max-h-xl bg-white rounded-md'>
                            <Link to={card.link} target="_blank" className='article items-center'>
                                <div className='rounded-md'>
                                    {card.image && <div className='article-image'>
                                        <GatsbyImage alt={card.title} className="z-0 image object-cover w-full h-auto rounded-md md:h-full md:w-full md:max-w-100" image={card.image.gatsbyImageData} />
                                    </div>}
                                </div>
                                <div className="details transition ease-in-out left-0 bottom-0 w-full p-4 leading-normal">
                                    <p className="mt-0 text-grey text-sm uppercase pb-2">{card.date || card.createdDate || card.updatedAt}</p>
                                    <h5 className="text-xl tracking-tight pb-2">{card?.title}</h5>
                                    <div className="description text-sm" dangerouslySetInnerHTML={{
                                        __html: card?.description.childMarkdownRemark.html,
                                    }} />
                                    <div className="flex justify-start">
                                        <Tags tags={card?.tag} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </FadeIn>
                )
            })}
        </ul >
    )
}

export default ToolCard
