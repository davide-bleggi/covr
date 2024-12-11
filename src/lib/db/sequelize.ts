import {Sequelize, DataTypes} from "sequelize";

export const sequelize = new Sequelize("CovrDB", "sa", "YourStrongPassword123!", {
    host: "localhost",
    dialect: "mssql",
    dialectOptions: {
        encrypt: true, // Enables TLS
        trustServerCertificate: true, // Bypass certificate validation
    },
});

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established!");

        // Sync models
        await sequelize.sync({alter: true});
        console.log("Models synchronized!");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

