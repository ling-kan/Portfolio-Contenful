import React, { useEffect } from 'react'
import { useLocation } from '@reach/router';
import { initializeAndTrack } from 'gatsby-plugin-gdpr-cookies';

function isBrowser() {
    return typeof window !== 'undefined';
}

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
        initializeAndTrack(location);
    }

    const [bannerHidden, setBannerHidden] = useStickyState(
        false,
        'consentCookieHidden',
    );

    const EnableAnalytics = () => {
        document.cookie = 'gatsby-gdpr-google-analytics=true';
        setBannerHidden(true);
    };

    return (
        <>
            {!bannerHidden && (
                <div class="fixed w-screen bottom-0 z-50">
                    <div class="max-w-7xl m-3 p-3 sm:px-6 lg:px-8 bg-primary rounded-md">
                        <div class="flex items-center justify-between flex-wrap">
                            <div class="w-0 flex-1 flex items-center">
                                <span class="flex p-2 rounded-lg bg-indigo-800">
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </span>
                                <p class="ml-3 font-medium text-white truncate">
                                    <span > We use cookies to analyze
                                        traffic. </span>
                                </p>
                            </div>
                            <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                                <button onClick={EnableAnalytics} class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-primary hover:bg-blue">Yes, I accept cookies </button>
                            </div>
                            <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                <button type="button" class="-mr-1 flex p-2 rounded-md hover:bg-blue focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                                    <span class="sr-only">Dismiss</span>
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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