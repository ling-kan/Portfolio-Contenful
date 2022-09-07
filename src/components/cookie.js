import React, { useEffect } from 'react'
import { useLocation } from '@reach/router';
import { initializeAndTrack } from 'gatsby-plugin-gdpr-cookies';
import { isBrowser } from '../services/auth';

function getValue(key, defaultValue) {
    return isBrowser() && window.localStorage.getItem(key)
        ? JSON.parse(window.localStorage.getItem(key))
        : defaultValue;
}

function setValue(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

function useStickyState(defaultValue, key) {
    const [value, setter] = React.useState(() => {
        return getValue(key, defaultValue);
    });

    useEffect(() => {
        setValue(key, value);
    }, [key, value]);

    return [value, setter];
}

const CookieConsent = () => {
    const location = useLocation();
    if (isBrowser()) {
        location && initializeAndTrack(location) || null;
    }

    const [bannerHidden, setBannerHidden] = useStickyState(
        false,
        'consentCookieHidden',
    );

    const EnableAnalytics = () => {
        document.cookie = 'gatsby-gdpr-google-analytics=true';
        document.cookie = 'gatsby-gdpr-google-tagmanager=true';
        setBannerHidden(true);
    };

    return (
        <>
            {!bannerHidden && (
                <div className="fixed max-w-sm w-screen bottom-0 z-50">
                    <div className="m-3 p-3 py-4 bg-primary rounded-md">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex p-2 rounded-lg">
                                    <svg className="h-6 w-6 dark:text-white text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </span>
                                <p className="ml-3 text-xs text-black dark:text-white">
                                    <span >This website uses cookies that help the website to function and also to track how you interact with our website. But for us to provide the best user experience, enable the specific cookies from Settings, and click on Accept.</span>
                                </p>
                            </div>
                            <div className="order-3 mt-4 mx-4 w-full flex justify-center ">
                                <button onClick={EnableAnalytics} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-primary hover:bg-blue">Accept</button>
                            </div>
                            <div className="order-2 flex-shrink-0 ">
                                <button type="button" onClick={() => { setBannerHidden(true) }} className="-mr-1 flex p-2 rounded-md hover:bg-blue focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-6 w-6 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            )}
        </>
    );
};

export default CookieConsent;