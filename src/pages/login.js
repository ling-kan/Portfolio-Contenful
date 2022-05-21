import React, { useState } from 'react';
import { graphql, navigate } from "gatsby"
import { handleLogin, isLoggedIn } from "../services/auth"
import get from "lodash/get";
import Layout from "../components/layout";
import Container from '../components/container';
import Header from '../components/header';
const Login = (props) => {
    const navigation = get(this, "props.data.allContentfulNavigation.nodes");
    const socials = get(this, "props.data.allContentfulSocials.nodes");
    const email = socials?.filter(social => social.type === 'Email');
    const [form, setForm] = useState('');

    function handleSubmit(event) {
        event.preventDefault()
        handleLogin(form)
        checkLogin()
    }

    function checkLogin() {
        if (isLoggedIn()) {
            navigate(-1)
        }
    }

    return (
        <Layout location={props.location} navigation={navigation} socials={socials} >
            <div className="bg-gray-100">
                <Container>
                    <Header title="Protected Page" style={{ textAlign: 'center' }} />
                    <div className="w-full max-w-xs m-auto">
                        <form method="post"
                            onSubmit={event => {
                                handleSubmit(event)
                            }} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

                            <div className="mb-6">
                                <label
                                    for="password"
                                    className="block text-gray-700 text-sm font-bold mb-2" >
                                    Password

                                    <input onChange={event => setForm({
                                        [event.target.name]: event.target.value,
                                    })} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password"
                                        name="password" placeholder="********" />
                                </label>
                                <p className="text-red-500 text-xs italic">Please choose a password.</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <input type="submit" className="bg-dark hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="Enter" />
                                {email && <a className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-500" href={email[0]?.url}>
                                    Request Access
                                </a>}
                            </div>
                        </form>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}


export default Login;

export const pageQuery = graphql`
  query LoginQuery {
    allContentfulSocials {
      nodes {
        url
        type
      }
    }
    allContentfulNavigation(sort: { fields: [order], order: ASC }) {
      nodes {
        title
        url
        order
      }
    }
  }
`;
