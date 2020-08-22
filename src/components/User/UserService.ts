import { AppError, Constants } from '../../utils';

import { getDBInstance } from '../../configs';

const getUserList = async ({ attributes }: { attributes?: string[]; limit?: number; offset?: number }) => {
	try {
		let result = await getDBInstance()
			.scan({
				TableName: Constants.TABLE_NAMES.USER,
				AttributesToGet: attributes,
			})
			.promise();
		return result.Items;
	} catch (err) {
		new AppError('SgetUserList', err.message, err.stack);
		return [];
	}
};

const getUserByPk = async (email: string, attributes: string[] = undefined) => {
	try {
		let result = await getDBInstance()
			.get({
				TableName: Constants.TABLE_NAMES.USER,
				Key: {
					email,
				},
				AttributesToGet: attributes,
			})
			.promise();

		return result.Item;
	} catch (err) {
		new AppError('SgetUser', err.message, err.stack);
		return undefined;
	}
};

const insertUser = async (params: { email: string; passwd: string }) => {
	try {
		return await getDBInstance()
			.put({
				TableName: Constants.TABLE_NAMES.USER,
				Item: params,
			})
			.promise();
	} catch (err) {
		throw new AppError('SinsertUser', err.message, err.stack);
	}
};

const updateUser = async (email: string, updateInfo: { passwd?: string }) => {
	try {
		return await getDBInstance()
			.update({
				TableName: Constants.TABLE_NAMES.USER,
				Key: {
					email,
				},
				ExpressionAttributeValues: {
					':passwd': updateInfo.passwd,
				},
				UpdateExpression: 'SET passwd = :passwd',
			})
			.promise();
	} catch (err) {
		throw new AppError('SupdateUser', err.message, err.stack);
	}
};

const deleteUser = async (email: string) => {
	try {
		return await getDBInstance()
			.delete({
				TableName: Constants.TABLE_NAMES.USER,
				Key: { email },
			})
			.promise();
	} catch (err) {
		throw new AppError('SdeleteUser', err.message, err.stack);
	}
};

export const UserService = { getUserByPk, getUserList, insertUser, deleteUser, updateUser };
