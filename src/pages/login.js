import React, { useState, useEffect } from 'react';
import { graphql, navigate, Link } from "gatsby";
import get from "lodash/get";
import { handleLogin, isLoggedIn } from "../services/auth";
import Layout from "../components/layout";
import Container from '../components/container';
import Header from '../components/header';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const Login = (props) => {
    const socials = get(props, "data.allContentfulSocials.nodes");
    const email = socials?.filter(social => social.type === 'Email');

    const [form, setForm] = useState({ password: '' });
    const [loginFailed, setLoginFailed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate(-1, { replace: true });
        }
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoginFailed(false);

        const loginSuccess = await handleLogin(form);
        if (loginSuccess) {
            navigate(-1, { replace: true });
        } else {
            setLoginFailed(true);
        }
    }

    return (
        <Layout location={props.location} socials={socials}>
            <div className="min-h-screen-90">
                <Container>
                    <button className="flex m-2 border-none text-link" onClick={(e) => { e.preventDefault(); navigate(-2) }}>
                        <ArrowLeftIcon className="mr-2 my-auto h-5 w-5" />
                        Back
                    </button>
                </Container>
                <Container>
                    <Header title="Protected Page" className="text-center" />
                    <div className="w-full max-w-xs mt-20 mx-auto">
                        <form method="post" onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-bold">
                                    Password
                                    <div className="relative flex items-center">
                                        <input
                                            onChange={event => {
                                                const value = event.target.value;
                                                setForm({ password: value });
                                                if (!value) setLoginFailed(false); // Remove error message when field is emptied
                                            }}
                                            className={`${loginFailed ? 'border-red' : 'border-grey-light'} bg-transparent shadow appearance-none border rounded w-full mt-2 py-2 px-3 mb-3 leading-tight focus:outline-hidden focus:shadow-outline pr-8`}
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="********"
                                        />
                                        <button
                                            type="button"
                                            className="no-fill absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 border-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5 no-fill" /> : <EyeIcon className="h-5 w-5 no-fill" />}
                                        </button>
                                    </div>
                                </label>
                                {loginFailed && <p className="text-red text-xs italic">Incorrect password, please try again</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <input type="submit" className="button cursor-pointer mr-2 font-semibold py-2 px-4 rounded focus:outline-hidden focus:shadow-outline" value="Enter" />
                                {email && <Link to={email[0]?.url} className="inline-block align-baseline font-semibold text-sm text-link">
                                    Request Access
                                </Link>}
                            </div>
                        </form>
                    </div>
                </Container>
            </div>
        </Layout>
    );
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
