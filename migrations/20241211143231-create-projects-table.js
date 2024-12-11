'use strict';

const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('Projects', {
       id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         primaryKey: true
       },
       name: {
         type: Sequelize.STRING,
         allowNull: false
       },
       description: {
         type: Sequelize.STRING,
         allowNull: false
       },
       code: {
         type: Sequelize.STRING,
         allowNull: false
       },
       status: {
         type: DataTypes.ENUM('MANTAINED', 'ORPHAN', 'NEVER RELEASED'),
         allowNull: false
       },
       createdAt: {
         type: Sequelize.DATE,
         allowNull: false,
       },
       updatedAt: {
         type: Sequelize.DATE,
         allowNull: false,
       }});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:*/
      await queryInterface.dropTable('Projects');

  }
};
