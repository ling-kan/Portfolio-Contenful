
import React, { useEffect, useState } from 'react'
// import { getSrc } from 'gatsby-plugin-image'
import Container from './container';
// import IdeaImage from "../assets/illustration/idea.svg";
// import { ReactComponent as Idea } from '../assets/illustration/idea.svg';
import Lottie from 'react-lottie';
import animation from '../assets/lotties/DashboardReview.lottie.json';
import darkAnimation from '../assets/lotties/DarkboardReview-dark.lottie.json';
import ReactTextTransition, { presets } from "react-text-transition";

const HomeHero = ({ image, name, content, animatedList }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() =>
            setIndex(index => index + 1),
            5000
        );
        return () => clearTimeout(intervalId);
    }, []);


    return (
        <div className="min-h-screen md:auto items-center flex relative">
            <Container>
                <div className="grid grid-cols-3 py-6">
                    {/* <div className='col-span-3 md:col-span-35'>
                        <Lottie
                            width={300}
                            options={defaultOptions}
                            alt="Ling Kan Portfolio"
                        />
                      <IdeaImage className="idea-image bg-white dark:bg-dark" />
                </div> */}
                    <div className=" col-span-3 md:col-span-3 text-left items-left justify-left my-auto">
                        <h1 className="text-9xl md:text-9xl text-border uppercase">
                            {name}
                        </h1>
                        {animatedList && <section className="inline">
                            <ReactTextTransition
                                text={animatedList[index % animatedList.length]}
                                springConfig={presets.slow}
                                className="big text-5xl uppercase font-bold"
                                delay={700}
                                noOverflow
                                direction="down"
                            />
                        </section>
                        }
                        {content && <p>{content}</p>}
                    </div>
                    <div className="scroll-down"></div>
                </div>
            </Container >
        </div >
    )
}

export default HomeHero;

