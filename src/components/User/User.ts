import Joi from '@hapi/joi';

export class User {
	public email: string;
	public passwd: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PostUserSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: email
 *         passwd:
 *           type: string
 *           example: passwd
 *       required:
 *         - email
 *         - passwd
 *
 *   parameters:
 *     PostUserParams:
 *       name: PostUserParams
 *       in: body
 *       description: params for insert user.
 *       required: true
 *       schema:
 *         $ref: '#components/schemas/PostUserSchema'
 */

export const PostUserParams = Joi.object({
	email: Joi.string().email().max(100).required(),
	passwd: Joi.string().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     PutUserSchema:
 *       type: object
 *       properties:
 *         passwd:
 *           type: string
 *           example: passwd
 *
 *   parameters:
 *     PutUserParams:
 *       name: PutUserParams
 *       in: body
 *       description: params for update user.
 *       required: true
 *       schema:
 *         $ref: '#components/schemas/PutUserSchema'
 */

export const PutUserParams = Joi.object({
	passwd: Joi.string(),
});

/**
 * @swagger
 * components:
 *   parameters:
 *     EmailPathParam:
 *       name: email
 *       in: path
 *       required: true
 *
 */
export const EmailPathParam = Joi.object({
	email: Joi.string().email().required(),
});
