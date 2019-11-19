import express from 'express';

import Authentication from '../../controllers/security/authenticationController';
import UserController from '../../controllers/user/userController';

const router = express.Router();
const authenticate = new Authentication();
const user = new UserController();

// server test
router.get('/', (req, res) => {
    res.status(200);
    res.send('Node server is running!');
});

/**
 * @swagger
 * paths:
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     name: login
 *     summary: Process authentication
 *     operationId: login
 *     parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            userName:
 *              type: string
 *              example: test@test.com
 *            password:
 *              type: string
 *              example: password1
 *     responses:
 *      200:
 *       description: User found and logged in successfully
 *      401:
 *       description: Username not found in DB / Password does not match / User account locked / User password expired / New user login
 *      400:
 *       description: Username or password missing
 */
// Route for login action
router.post('/login', (req: express.Request, res: express.Response) => authenticate.processLogin(req, res));

/**
 * @swagger
 * paths:
 * /logout:
 *   post:
 *     tags:
 *       - Logout
 *     name: logout
 *     summary: Process logout
 *     operationId: logout
 *     responses:
 *      200:
 *       description: logout processed successfully
 */
// Route for logout action
router.post('/logout', (req: express.Request, res: express.Response) => authenticate.processLogout(req, res));


/**
 * @swagger
 * paths:
 * /user/info:
 *   get:
 *     tags:
 *       - User
 *     operationId: userInfo
 *     description: Get logged in user info
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
// Route to get the logged in user info
router.get('/user/info', (req: express.Request, res: express.Response) => {
    user.getLoggedInUserInfo(req, res);
});


export default router;

