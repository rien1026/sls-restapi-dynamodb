import AWS from 'aws-sdk';
import { Constants } from '../utils';

export const getDBInstance = () => {
	let config = {
		region: Constants.DB_CONFIG.REGION,
		convertEmptyValues: true,
	};

	return new AWS.DynamoDB.DocumentClient(config);
};
