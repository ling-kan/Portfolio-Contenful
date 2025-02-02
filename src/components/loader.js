import React, { useEffect, useState } from 'react';

const Loader = () => {
    const [isClient, setIsClient] = useState(false);
    const [Lottie, setLottie] = useState(null);
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        setIsClient(true);
        // Dynamically import Lottie and animation data only on the client side
        import('react-lottie').then(LottieModule => {
            setLottie(() => LottieModule.default);
        });
        import('../assets/lotties/DashboardReview.lottie.json').then(animation => {
            setAnimationData(animation);
        });
    }, []);

    if (!isClient || !Lottie || !animationData) {
        return null; // Return null during SSR or while loading Lottie and animation data
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className='w-screen min-h-screen flex p-20'>
            <div className="m-auto h-fit">
                <div className='max-w-xs max-h-xs'>
                    <div className='p-5'>
                        <Lottie
                            options={defaultOptions}
                            alt="Loader"
                        />
                    </div>
                    <div className="relative">
                        <div className="loading">
                            <div className="loading-bar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;