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
 *       - Auth
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
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     name: logout
 *     summary: Process logout
 *     operationId: logout
 *     parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            access_token:
 *              type: string
 *              example: token
 *              required: false
 *     responses:
 *      200:
 *       description: logout processed successfully
 */
// Route for logout action
router.post('/logout', (req: express.Request, res: express.Response) => authenticate.processLogout(req, res));

/**
 * @swagger
 * paths:
 * /password/reset/token:
 *   post:
 *     tags:
 *       - Auth
 *     name: passwordResetToken
 *     summary: Fetch password reset token
 *     operationId: passwordResetToken
 *     parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              example: test@test.com
 *     responses:
 *      200:
 *       description: User found and reset link is sent in successfully
 *      401:
 *       description: email not found in DB
 *      400:
 *       description: email or password missing
 */
// Route for password reset action
router.post('/password/reset/token', (req: express.Request, res: express.Response) => authenticate.passwordResetToken(req, res));

/**
 * @swagger
 * paths:
 * /password/reset/{id}/{token}:
 *   get:
 *     tags:
 *       - Auth
 *     name: verifyPasswordResetToken
 *     summary: Verify password reset token
 *     operationId: verifyPasswordResetToken
 *     parameters:
 *       - description: UserId
 *         in: path
 *         name: id
 *         required: true
 *         type: string
 *       - description: token
 *         in: path
 *         name: token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Record not found
 *       400:
 *         description: Bad data requested
 *       500:
 *         description: Server error
 */
// Route for password reset action
router.get('/password/reset/:id/:token', (req: express.Request, res: express.Response) => authenticate.verifyPasswordResetToken(req, res));

/**
 * @swagger
 * paths:
 * /password/reset:
 *   post:
 *     tags:
 *       - Auth
 *     name: resetpassword
 *     summary: Reset password
 *     operationId: resetpassword
 *     parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              example: userId
 *            token:
 *              type: string
 *              example: token
 *            password:
 *              type: string
 *              example: newpassword
 *     responses:
 *      200:
 *       description: Password reset successfully
 *      401:
 *       description: email not found in DB
 *      400:
 *       description: email or password missing
 */
// Route for reset password with new password
router.post('/password/reset', (req: express.Request, res: express.Response) => authenticate.resetPassword(req, res));

/**
 * @swagger
 * paths:
 * /user/activate/{id}/{token}:
 *   get:
 *     tags:
 *       - Auth
 *     name: activateAccount
 *     summary: Activate user account
 *     operationId: activateAccount
 *     parameters:
 *       - description: UserId
 *         in: path
 *         name: id
 *         required: true
 *         type: string
 *       - description: token
 *         in: path
 *         name: token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Record not found
 *       400:
 *         description: Bad data requested
 *       500:
 *         description: Server error
 */
// Route for password reset action
router.get('/user/activate/:id/:token', (req: express.Request, res: express.Response) => authenticate.activateAccount(req, res));

/**
 * @swagger
 * paths:
 * /user/register:
 *   post:
 *     tags:
 *       - User
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
 *            firstName:
 *              type: string
 *              example: Abhinav
 *            lastName:
 *              type: string
 *              example: Kumar
 *            age:
 *              type: number
 *              example: 29
 *            gender:
 *              type: string
 *              example: Male
 *     responses:
 *      200:
 *       description: User created in successfully
 */
// Route for register action
router.post('/user/register', (req: express.Request, res: express.Response) => user.register(req, res));

export default router;

