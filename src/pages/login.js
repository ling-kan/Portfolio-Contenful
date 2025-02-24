import React, { useState, useEffect } from 'react';
import { graphql, navigate, Link } from "gatsby"
import get from "lodash/get";
import { handleLogin, isLoggedIn } from "../services/auth"
import Layout from "../components/layout";
import Container from '../components/container';
import Header from '../components/header';
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'

const Login = (props) => {
    const socials = get(props, "data.allContentfulSocials.nodes");
    const email = socials?.filter(social => social.type === 'Email');
    const [form, setForm] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);

    function handleSubmit(event) {
        event.preventDefault()
        handleLogin(form)
        if (checkLogin()) {
            setLoginFailed(false)
        } else {
            setLoginFailed(true)
        }
    }

    function checkLogin() {
        if (isLoggedIn()) {
            navigate(-1, { replace: true })
        }
    }

    useEffect(() => {
        checkLogin()
    }, [])

    return (
        <Layout location={props.location} socials={socials} >
            <div className="min-h-screen-90 ">
                <Container>
                    <button className="text-black  flex m-2 border-none" onClick={(e) => { e.preventDefault(); navigate(-2) }}>
                        <ArrowNarrowLeftIcon className="mr-2 my-auto h-5 w-5" />
                        Back</button>
                </Container>
                <Container>
                    <Header title="Protected Page" className="text-center" />
                    <div className="w-full max-w-xs mt-20 mx-auto">
                        <form method="post"
                            onSubmit={event => {
                                handleSubmit(event)
                            }} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-6">
                                <label
                                    htmlFor="password"
                                    for="password"
                                    className="block text-black text-sm font-bold" >
                                    Password
                                    <input onChange={event => setForm({
                                        [event.target.name]: event.target.value,
                                    })} className={`${loginFailed ? 'border-red' : 'border-grey-light'} bg-transparent shadow appearance-none border rounded w-full mt-2 py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password"
                                        name="password" placeholder="********" />
                                </label>
                                {loginFailed && <p className="text-red text-xs italic">Incorrect password, please try again</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <input type="submit" className="button-fill cursor-pointer mr-2 bg-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="Enter" />
                                {email && <Link to={email[0]?.url} className="inline-block align-baseline font-bold text-sm text-link text-black">
                                    Request Access
                                </Link>}
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
  }
`;
