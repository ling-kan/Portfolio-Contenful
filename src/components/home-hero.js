
import React from 'react'
import Container from './container';
import Lottie from 'react-lottie';
import animation from '../assets/lotties/DashboardReview.lottie.json';

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

