import Koa from 'koa';
import { AppError } from '../../utils/AppError';
import { UserService } from './UserService';
import { EmailPathParam, PostUserParams, PutUserParams } from './User';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         passwd:
 *           example: passwd
 *
 * /users/:email:
 *   get:
 *     tags: [User]
 *     parameters:
 *       - $ref: '#components/parameters/EmailPathParam'
 *     responses:
 *       200:
 *         description: SUC
 *         type: object
 *         properties:
 *           msg:
 *             type: string
 *             example: suc
 *           data:
 *             $ref: '#components/schemas/UserSchema'
 *
 */
const getUser = async (ctx: Koa.Context) => {
	try {
		let pathParam = await EmailPathParam.validateAsync({ email: ctx.params.email });

		let user = await UserService.getUserByPk(pathParam.email);

		ctx.status = 200;
		ctx.body = { msg: 'suc', data: user };
	} catch (err) {
		throw new AppError('CgetUser', err.message, err.stack, {
			errCode: err.errCode,
			responseCode: err.responseCode,
		});
	}
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserListItemSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         passwd:
 *           example: passwd
 *
 * /users:
 *   get:
 *     tags: [User]
 *     responses:
 *       200:
 *         description: SUC
 *         type: object
 *         properties:
 *           msg:
 *             type: string
 *             example: suc
 *           data:
 *             type: array
 *             items:
 *               $ref: '#components/schemas/UserListItemSchema'
 *
 */
const getUserList = async (ctx: Koa.Context) => {
	try {
		let userList = await UserService.getUserList({});

		ctx.status = 200;
		ctx.body = { msg: 'suc', data: userList };
	} catch (err) {
		throw new AppError('CgetUserList', err.message, err.stack, {
			errCode: err.errCode,
			responseCode: err.responseCode,
		});
	}
};

/**
 * @swagger
 *
 * /users:
 *   post:
 *     tags: [User]
 *     parameters:
 *       - $ref: '#components/parameters/EmailPathParam'
 *       - $ref: '#components/parameters/PostUserParams'
 *     responses:
 *       200:
 *         description: SUC
 *         type: object
 *         properties:
 *           msg:
 *             type: string
 *             example: suc
 *
 */
const postUser = async (ctx: Koa.Context) => {
	try {
		let params = await PostUserParams.validateAsync(ctx.request.body);

		// insert User
		await UserService.insertUser(params);

		ctx.status = 200;
		ctx.body = { msg: 'suc' };
	} catch (err) {
		throw new AppError('CpostUser', err.message, err.stack, {
			errCode: err.errCode,
			responseCode: err.responseCode,
		});
	}
};

/**
 * @swagger
 *
 * /users/:email:
 *   put:
 *     tags: [User]
 *     parameters:
 *       - $ref: '#components/parameters/EmailPathParam'
 *       - $ref: '#components/parameters/PutUserParams'
 *     responses:
 *       200:
 *         description: SUC
 *         type: object
 *         properties:
 *           msg:
 *             type: string
 *             example: suc
 *
 */
const putUser = async (ctx: Koa.Context) => {
	try {
		let pathParam = await EmailPathParam.validateAsync({ email: ctx.params.email });
		let params = await PutUserParams.validateAsync(ctx.request.body);

		// update User
		await UserService.updateUser(pathParam.email, params);

		ctx.status = 200;
		ctx.body = { msg: 'suc' };
	} catch (err) {
		throw new AppError('CputUser', err.message, err.stack, {
			errCode: err.errCode,
			responseCode: err.responseCode,
		});
	}
};

/**
 * @swagger
 *
 * /users/:email:
 *   delete:
 *     tags: [User]
 *     parameters:
 *       - $ref: '#components/parameters/EmailPathParam'
 *     responses:
 *       200:
 *         description: SUC
 *         type: object
 *         properties:
 *           msg:
 *             type: string
 *             example: suc
 *
 */
const deleteUser = async (ctx: Koa.Context) => {
	try {
		let pathParam = await EmailPathParam.validateAsync({ email: ctx.params.email });

		// delete User
		await UserService.deleteUser(pathParam.email);

		ctx.status = 200;
		ctx.body = { msg: 'suc' };
	} catch (err) {
		throw new AppError('CdeleteUser', err.message, err.stack, {
			errCode: err.errCode,
			responseCode: err.responseCode,
		});
	}
};

export const UserController = { getUserList, getUser, postUser, putUser, deleteUser };
