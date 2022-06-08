import React from "react";
import Container from "./container";
import FadeIn from "./motion/fade-in";

const Bio = ({ content }) => {
    return (
        <FadeIn id="bio">
            <Container>{content && <p>{content}</p>}</Container>
        </FadeIn>
    );
};

export default Bio;
