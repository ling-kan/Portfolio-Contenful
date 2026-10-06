import React, { useState, useEffect } from 'react';
import { graphql, navigate } from "gatsby";
import get from "lodash/get";
import { handleLogin, isLoggedIn } from "../services/auth";
import Layout from "../components/layout";
import Container from '../components/container';
import Header from '../components/header';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/solid';
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
            <section className="relative isolate overflow-hidden -mt-28 md:-mt-32 min-h-[100svh] flex items-center pt-32 pb-16">
                <div aria-hidden="true" className="absolute inset-0 -z-10">
                    <div className="absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-mint/50 blur-[110px]" />
                    <div className="absolute bottom-0 -left-40 w-[28rem] h-[28rem] rounded-full bg-accent-soft/70 blur-[110px]" />
                </div>
                <Container>
                    <div className="w-full max-w-md mx-auto">
                        <button className="group inline-flex items-center gap-2 mb-8 text-sm font-medium !text-ink" onClick={(e) => { e.preventDefault(); navigate(-2) }}>
                            <ArrowLeftIcon className="h-4 w-4 no-fill fill-ink group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <form method="post" onSubmit={handleSubmit} className="glass rounded-[1.5rem] border border-white/70 shadow-[0_40px_80px_-40px_rgba(23,51,43,0.45)] p-8 md:p-10">
                            <span className="grid place-items-center w-12 h-12 rounded-full bg-ink mb-6">
                                <LockClosedIcon className="w-5 h-5 no-fill fill-accent" />
                            </span>
                            <p className="eyebrow text-ink/75">Private case study</p>
                            <Header title="Protected page" className="mt-3" />
                            <p className="text-ink/75 mb-8">Enter the access password to continue.</p>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-semibold text-ink">
                                    Password
                                    <div className="relative flex items-center">
                                        <input
                                            onChange={event => {
                                                const value = event.target.value;
                                                setForm({ password: value });
                                                if (!value) setLoginFailed(false); // Remove error message when field is emptied
                                            }}
                                            className={`${loginFailed ? 'border-red' : 'border-line'} bg-white/80 appearance-none border rounded-full w-full mt-2 py-3 px-5 pr-12 leading-tight focus:outline-none focus:border-ink transition-colors`}
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            aria-invalid={loginFailed}
                                        />
                                        <button
                                            type="button"
                                            className="no-fill absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-ink/75 border-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5 no-fill" /> : <EyeIcon className="h-5 w-5 no-fill" />}
                                        </button>
                                    </div>
                                </label>
                                {loginFailed && <p className="text-red text-sm mt-2" role="alert">Incorrect password, please try again</p>}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <input type="submit" className="cursor-pointer rounded-full !bg-ink !text-paper px-7 py-3 font-medium hover:!bg-accent transition-colors !border-0" value="Enter" />
                                {email && <a href={email[0]?.url} className="font-medium text-sm text-link">
                                    Request access
                                </a>}
                            </div>
                        </form>
                    </div>
                </Container>
            </section>
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
