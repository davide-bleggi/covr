import { DataTypes } from 'sequelize';
import { sequelize } from '$lib/db/sequelize';
import { ProjectStatus } from '$lib/db/types';
import { projectStatusOptions } from '$lib/db/enums';

export const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	},
	{
		timestamps: false // Disable `createdAt` and `updatedAt`
	});

export const Project = sequelize.define('Project', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM(...projectStatusOptions.map(opt=>opt.value))
			,
			allowNull: false
		},
	},
	{
		timestamps: true // Disable `createdAt` and `updatedAt`
	});
