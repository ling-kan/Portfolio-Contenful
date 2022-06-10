import { graphql, useStaticQuery } from "gatsby";

const useSocialData = () => {
  const data = useStaticQuery(graphql`
   query SocialsQuery {
    allContentfulSocials {
      nodes {
        url
        type
      }
    }
  
  }
  `);

  return data.allContentfulSocials.nodes;
};

export default useSocialData;