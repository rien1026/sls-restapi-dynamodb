import AWS from 'aws-sdk';

import { Portfolio, PortfolioSchema } from './portfolio.model';
import { constants } from '../../util';
import { AppError } from '../common';
import { commonUtil } from '../../util/common.util';

const insertPortfolio = async (portfolio: Portfolio) => {
	try {
		let config = {
			endpoint: constants.DB_CONFIG.ENDPOINT,
			region: constants.DB_CONFIG.REGION,
		};
		let dynamoDB = new AWS.DynamoDB.DocumentClient(config);

		portfolio.inDt = new Date().getTime();
		portfolio.no = await commonUtil.getTableSeq('PORTFOLIO');
		portfolio.seq = portfolio.no;

		await PortfolioSchema.validateAsync(portfolio);

		await dynamoDB.put({ TableName: constants.TABLE_NAMES.PORTFOLIO, Item: portfolio }).promise();
	} catch (err) {
		throw new AppError('insertPortfolio', err.message, err.stack);
	}
};

const getPortfolioList = async () => {
	let portfolioList = [];
	try {
		let config = {
			endpoint: constants.DB_CONFIG.ENDPOINT,
			region: constants.DB_CONFIG.REGION,
		};
		let dynamoDB = new AWS.DynamoDB.DocumentClient(config);
		let result = await dynamoDB.scan({ TableName: constants.TABLE_NAMES.PORTFOLIO }).promise();

		if (result.Count > 0) {
			portfolioList = result.Items;

			portfolioList.sort((a, b) => {
				return a.seq < b.seq ? 1 : -1;
			});
		}
	} catch (err) {
		throw new AppError('getPortfolioList', err.message, err.stack);
	}

	return portfolioList;
};

export const portfolioService = {
	insertPortfolio,
	getPortfolioList,
};
