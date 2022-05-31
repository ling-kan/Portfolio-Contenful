import React from 'react';
import styled from "styled-components"


const SectionDividerWrapper = styled.div`
display:flex;
align-item:center;
width:100%;
span{
    background: var(--black);
    height:3px;
    flex:1;
    margin: auto 0;
}
`;

const SectionDivider = ({ title, className }) => {
    return (
        <SectionDividerWrapper>
            <h2 className={`${className && className} text-3xl text-left pr-4`}>{title}</h2>
            <span />
        </SectionDividerWrapper >
    )
}

export default SectionDivider
