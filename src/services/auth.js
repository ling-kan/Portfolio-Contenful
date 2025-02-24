export const isBrowser = () => typeof window !== "undefined"
export const getUser = () =>
    isBrowser() && window?.localStorage.getItem("portfolioAccess")
        ? JSON.parse(window?.localStorage.getItem("portfolioAccess"))
        : {}

const setUser = user =>
    window?.localStorage.setItem("portfolioAccess", JSON.stringify(user))

export const handleLogin = ({ password }) => {
    if (password === process.env.GATSBY_PORTFOLIO_ACCESS_PASS) {
        return setUser({
            name: `guest`,
        })
    }
    return false
}
export const isLoggedIn = () => {
    const user = getUser()
    console.log(user)
    return !!user.name
}
