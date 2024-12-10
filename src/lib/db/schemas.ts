import {DataTypes} from "sequelize";
import {sequelize} from "$lib/db/sequelize";

export const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: false, // Disable `createdAt` and `updatedAt`
    });

export const Project = sequelize.define("Project", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("MANTAINED", "ORPHAN", "NEVER RELEASED"),
            allowNull: true,
        },
    },
    {
        timestamps: false, // Disable `createdAt` and `updatedAt`
    });
