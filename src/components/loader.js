import React from 'react'
import animation from '../assets/lotties/DashboardReview.lottie.json';
import Lottie from 'react-lottie';
const Loader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <div className='w-screen h-screen flex p-20'>
            <div className="m-auto h-fit">
                <div className='max-w-xs max-h-xs'>
                    <div className='p-5'>
                        <Lottie
                            options={defaultOptions}
                            alt="Loader"

                        />
                    </div>
                    <div className="relative">
                        <div class="loading">
                            <div class="loading-bar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Loader
