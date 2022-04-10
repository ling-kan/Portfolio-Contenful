
import React from 'react'
// import { getSrc } from 'gatsby-plugin-image'
import Container from './container';
// import IdeaImage from "../assets/illustration/idea.svg";
// import { ReactComponent as Idea } from '../assets/illustration/idea.svg';
import Lottie from 'react-lottie';
import animation from '../assets/lotties/DashboardReview.lottie.json';
import darkAnimation from '../assets/lotties/DarkboardReview-dark.lottie.json';

const HomeHero = ({ darkMode, image, name, title, content }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: !!darkMode ? animation : darkAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <Container>
            <div class="grid grid-cols-2">
                <div className="text-left items-center justify-center text-gray-900 dark:text-white">
                    <h1 className="text-2xl md:text-2xl">
                        {name}
                    </h1>
                    <h2 className=" text-4xl md:text-4xl">{title}</h2>
                    <p>{content}</p>
                </div>
                <div className=''>
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400}
                    />
                    {/* <IdeaImage className="idea-image bg-white dark:bg-black" /> */}
                </div>
            </div>
        </Container >
    )
}

export default HomeHero;

