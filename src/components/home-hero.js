
import React from 'react'
// import { getSrc } from 'gatsby-plugin-image'
import Container from './container';
// import IdeaImage from "../assets/illustration/idea.svg";
// import { ReactComponent as Idea } from '../assets/illustration/idea.svg';
import Lottie from 'react-lottie';
import animation from '../assets/lotties/DashboardReview.lottie.json';
import darkAnimation from '../assets/lotties/DarkboardReview-dark.lottie.json';

const HomeHero = ({ image, name, title, content }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <div className="min-h-screen">
            <Container>
                <div className="grid grid-cols-3 pt-6">
                    <div className='col-span-3 md:col-span-3'>
                        <Lottie
                            width={300}
                            options={defaultOptions}
                        />
                        {/* <IdeaImage className="idea-image bg-white dark:bg-black" /> */}
                    </div>
                    <div className=" col-span-3 md:col-span-3 text-center items-center justify-center ">
                        <h1 className="text-9xl md:text-9xl text-border uppercase">
                            {name}
                        </h1>
                        <h2 className=" text-4xl md:text-4xl">{title}</h2>
                        <p>{content}</p>
                    </div>

                </div>
            </Container >
        </div>
    )
}

export default HomeHero;

