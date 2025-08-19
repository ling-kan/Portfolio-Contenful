import React from 'react'
import CookieConsent from "react-cookie-consent";

const Cookie = () => {
    return (
        <CookieConsent
            disableStyles
            location="bottom"
            buttonText="Accept"
            cookieName="gdpr-google-analytics"
            contentClasses=""
            expires={360}
            enableDeclineButton="true"
            declineButtonText={<React.Fragment><svg className=" h-6 w-6 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg></React.Fragment>}
            declineButtonClasses="m-2 absolute top-0 right-0 border-none"
            buttonWrapperClasses="justify-center flex mt-3"
            containerClasses="fixed max-w-sm w-auto bottom-0 z-50 m-3 p-4 pt-5 pr-5 bg-primary rounded-md"
            buttonClasses="flex items-center justify-center px-4 py-2 border-transparent rounded-md shadow-sm text-sm font-medium  "
        >
            <div className="flex items-center justify-between flex-wrap">
                <div className="w-100 flex items-center">
                    <span className="hidden sm:flex p-2 rounded-lg">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    </span>
                    <p className="ml-3 mr-4 text-xs">
                        <span >This website uses cookies that help the website to function and also to track how you interact with our website. But for us to provide the best user experience click on Accept.</span>
                    </p>
                </div>
            </div>
        </CookieConsent >
    );
};

export default Cookie;