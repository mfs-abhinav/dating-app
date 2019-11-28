import express from 'express';

import { authenticateRequest } from '../../middlewares/requestAuthentication';
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
 *            email:
 *              type: string
 *              example: test@test.com
 *            password:
 *              type: string
 *              example: password1
 *     responses:
 *      200:
 *       description: User found and logged in successfully
 *      401:
 *       description: email not found in DB / Password does not match / User account locked / User password expired / New user login
 *      400:
 *       description: email or password missing
 */
// Route for login action
router.post('/login', (req: express.Request, res: express.Response) => authenticate.processLogin(req, res));

/**
 * @swagger
 * paths:
 * /user/register:
 *   post:
 *     tags:
 *       - Register
 *     name: register
 *     summary: Register user
 *     operationId: register
 *     parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              example: test@test.com
 *            password:
 *              type: string
 *              example: password1
 *     responses:
 *      200:
 *       description: User created in successfully
 */
// Route for register action
router.post('/user/register', (req: express.Request, res: express.Response) => user.register(req, res));

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


export default router;

