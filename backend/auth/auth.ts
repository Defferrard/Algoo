import passport from "passport";
import passportLocal from "passport-local";
import {Express, NextFunction, Request, Response} from "express";
// import {ErrorCause, SimpleError} from "./error";
import session from 'express-session';

export class User {
    private readonly _username: string;

    constructor(username: string) {
        this._username = username;
    }

    get username(): string {
        return this._username;
    }
}

/**
 * Retrieve the user from the current request's session.
 * @param req HTTP request.
 */
export function getUser(req: any):User {
    return new User(req.session?.passport?.user);
}

/**
 * Apply authentication's routes on the Express Application
 * @param APP Express Application
 */
export function applyAuth(APP: Express) {
    // create a new express session to manage user session
    // and send cookie session to the client to maintain the login session.
    APP.use(session({
        secret: process.env.SESSION_SECRET || 'secure_me',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.HTTPS?.toLowerCase() === "true", // HTTPS only
            httpOnly: true, // Prevent XSS attacks
            maxAge: 4 * 60 * 60 * 1000 // set expires time in milliseconds: 4 hours
        }
    }))
        .use(passport.initialize())
        .use(passport.session())
        /* Request body should be like :
        {
            "username":"john",
            "password":"P455w0rd"
        }
         */
        .post('/login', authenticate, (req: Request, res: Response) => {
            res.send({
                message: 'Logged In Successful',
                username: getUser(req).username
            })
        })
        .post('/logout', function (req: Request, res: Response, next: NextFunction) {
            req.logout(function (err: Error) {
                if (err) {
                    return next(err);
                }
                res.send({
                    message: 'Logged Out Successful'
                })
            });
        })
        // TODO : Return User Information
        .get('/secret', ensureAuthenticated, function (req: Request, res: Response, next: NextFunction) {
            res.send({
                username: getUser(req).username
            })
        });
}

/**
 * Verify that the user is correctly authenticated.
 *
 * @param req The HTTP request.
 * @param res The HTTP response.
 * @param next The next function to call the next middleware.
 */
export const ensureAuthenticated = (req: Request, res: Response, next: CallableFunction) => {
    try {
        if (req.isAuthenticated()) {
            // If the user is authenticated, continue to the next middleware
            next();
        } else {
            // Send a not connected response to the client.
            // TODO : new SimpleError('You must be logged in to see this page.', ErrorCause.NOT_CONNECTED).send(res);
        }
    } catch (e) {
        next(e);
    }
};

/**
 * Retrieve the local user by unique email and then
 * compare given hashed password with the hashed database password.
 */
passport.use('login',
    new passportLocal.Strategy(
        async function (username, password, done) {
            try {
                // TODO : Make identification with an external service. (By example a Database, or another API).
                //  It could help to retrieve more information about the user.
                if (password === process.env.AUTH_PASSWORD && username === process.env.AUTH_USERNAME) {
                    // Log In Successfully
                    return done(null, new User(username));
                }
                // Bad credentials
                return done(null, false);
            } catch (err) {
                // Something wrong !
                return done(err);
            }
        }
    ));

const authenticate = (req: Request, res: Response, next: CallableFunction) => {
    passport.authenticate('login', (err: Error, user: any, _: CallableFunction) => {
        if (err) {
            return next(err);
        }
        if (!user) { // Login Strategy returned done(null, false)
            // TODO : new SimpleError('Bad credentials', ErrorCause.BAD_CREDENTIALS).send(res)
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return next();
        });

    })(req, res, next);
};

/**
 * Indicate what to save in the session.
 * Only the user mail is saved when a session is created.
 */
passport.serializeUser(function (user: any, done: CallableFunction) {
    if (user) {
        done(null, user.username);
    }
});

/**
 * Indicate how to retrieve the user's data
 */
passport.deserializeUser(function (username: string, done: (err: any, user: Express.User) => void) {
    done(null, new User(username));
});