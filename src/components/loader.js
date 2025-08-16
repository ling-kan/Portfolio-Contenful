import React from 'react'
import CircularText from './motion/circular-text';
// import animation from '../assets/lotties/DashboardReview.lottie.json';
// import Lottie from 'lottie-react';

const Loader = () => {
    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animation,
    //     rendererSettings: {
    //         preserveAspectRatio: "xMidYMid slice"
    //     }
    // };
    return (
        <div className='w-screen min-h-screen flex p-20'>
            <div className="m-auto h-fit">
                <div className='max-w-xs max-h-xs'>
                    <div className='p-5'>
                        {/* <Lottie
                            options={defaultOptions}
                            alt="Loader"
                        /> */}
                        <CircularText
                            text="LING KAN - PORTFOLIO - "
                            onHover="speedUp"
                            spinDuration={20}
                            className="custom-class"
                        />
                    </div>
                    <div className="relative">
                        <div className="loading">
                            <div className="loading-bar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Loader
