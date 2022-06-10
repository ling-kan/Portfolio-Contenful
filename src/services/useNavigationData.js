import { graphql, useStaticQuery } from "gatsby";

const useNavigationData = () => {
    const data = useStaticQuery(graphql`
    query navigationQuery {
    allContentfulNavigation(sort: { fields: [order], order: ASC }) {
      nodes {
        title
        url
        order
      }
    }
  }
  `);

    return data.allContentfulNavigation.nodes;
};

export default useNavigationData;