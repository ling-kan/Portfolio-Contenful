export const isBrowser = () => typeof window !== "undefined";

export const getUser = () => {
    if (!isBrowser()) return {};
    const user = window.localStorage.getItem("portfolioAccess");
    return user ? JSON.parse(user) : {};
};

export const setUser = (user) => {
    if (isBrowser()) {
        window.localStorage.setItem("portfolioAccess", JSON.stringify(user));
    }
};

export const handleLogin = ({ password }) => {
    if (!isBrowser()) return false;
    const correctPassword = process.env.GATSBY_PORTFOLIO_ACCESS_PASS;
    if (!correctPassword) {
        console.error("Password is not set.");
        return false;
    }

    if (password === correctPassword) {
        setUser({ name: "guest" });
        return true;
    }

    return false;
};

export const isLoggedIn = () => {
    const user = getUser();
    return user && user.name;
};
