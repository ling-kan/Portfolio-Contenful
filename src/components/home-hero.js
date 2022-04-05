
import React from 'react'
import { getSrc } from 'gatsby-plugin-image'
import { ParallaxBanner } from 'react-scroll-parallax'

const HomeHero = ({ image, name, title, content }) => {
    const backgroundImage = image && getSrc(image);
    return (
        <ParallaxBanner
            layers={[
                { image: backgroundImage, speed: -20 },
                { image: backgroundImage, speed: -10 },
                {
                    translateY: [0, 50],
                    scale: [1.15, 1, 'easeOutCubic'],
                    shouldAlwaysCompleteAnimation: true,
                    expanded: false,
                    children: (
                        <div className="mt-10 absolute inset-0 text-center items-center justify-center">
                            <h1 className="text-2xl md:text-2xl">
                                {name}
                            </h1>
                            <h2 className=" text-4xl md:text-4xl">{title}</h2>
                            <body>{content}</body>
                        </div>
                    ),
                },
            ]}
            className="w-full aspect-[7/2]"
        >
        </ParallaxBanner>
    )
}

export default HomeHero;

