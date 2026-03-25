
const authMiddleware = (req, res, next) => {
    // place holder to check if the user is authenticated
    res.locals.isAuthenticated = true;
    res.locals.user = {
        id: 1,
        name: 'John Doe',
        email: [EMAIL_ADDRESS]
    };
    next();
}

export default authMiddleware;