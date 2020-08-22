import Koa from 'koa';
import koabody from 'koa-body';
import cors from '@koa/cors';
import Router from 'koa-router';
import swaggerUi from 'swagger-ui-koa';
import serverless from 'serverless-http';
import mount from 'koa-mount';
import { Constants } from './utils/Constants';
import { swaggerSpec } from './configs';
import { HTTP_RES_BAD_REQUEST, HTTP_RES_BAD_REQUEST_MSG, HTTP_RES_NOT_FOUND, HTTP_RES_NOT_FOUND_MSG } from './utils';
import { UserController } from './components/User';

const app = new Koa();
const router = new Router();

// it can be used with router by specific option.
app.use(koabody());
app.use(cors());
app.use(mount('/app', swaggerUi.serve));

// api-docs
if (Constants.PROD_MODE != 'prod') {
	router.get('/app/api-docs', swaggerUi.setup(swaggerSpec));
}

// handle error
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
	try {
		console.log(ctx.request.method + '---' + ctx.request.url);
		await next();

		if (!ctx.status) {
			ctx.status = HTTP_RES_BAD_REQUEST;
			ctx.body = { msg: HTTP_RES_BAD_REQUEST_MSG };
		}
	} catch (err) {
		ctx.status = err.response ? err.response : HTTP_RES_NOT_FOUND;
		let msg = Constants.PROD_MODE === 'prod' ? HTTP_RES_NOT_FOUND_MSG : err.message;
		ctx.body = { msg: msg, errCode: err.errCode };
	}
});

app.use(router.routes());
app.use(router.allowedMethods());

//users
router.get('/app/users', UserController.getUserList);
router.get('/app/users/:email', UserController.getUser);
router.post('/app/users', UserController.postUser);
router.put('/app/users/:email', UserController.putUser);
router.delete('/app/users/:email', UserController.deleteUser);

if (Constants.PROD_MODE === 'local') {
	app.listen(3000, () => {
		console.log({ i: '[SERVER] is listening.', mode: Constants.PROD_MODE, port: 3000 });
	});
}

export const appHandler = serverless(app);
