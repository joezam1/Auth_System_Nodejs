'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        //await queryInterface.sequelize.query("INSERT INTO ROLES (RoleId, Name, Description, IsActive, UTCDateCreated, UTCDateUpdated) VALUES ( UUID(), 'Base_Customer','User is registered and is willing to purchase goods and services from the website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() );");

        let insertRolesIntoTableRoles =[
            "INSERT INTO ROLES (RoleId, Name, Description, IsActive, UTCDateCreated, UTCDateUpdated) VALUES",

            "(NEW UUID(), 'Owner','User is registered and has total control over the full website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'SuperAdmin','User is registered and is the Second in Command with Not total control over the full website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'Admin','User is registered and is the Third in Command with less control over the full website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'Editor','User is registered and is in charge of modifying sections of the full website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'Moderator','User is registered and is in charge of interviging the chat section of the website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'Advertiser','User is registered and is in charge of Managing the Marketing and publicity section of the website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'TechnicalAnalyst','User is registered and is in charge of Evaluating Technical performance of the website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'CommercialAnalyst','User is registered and is in charge of Evaluating Economical and Financial performance of the website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'BaseCustomer','User is registered and is willing to purchase goods and services from the website', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'SilverCustomer','User is registered and purchased a Silver Subscription for goods, services Offers and Discounts', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'GoldCustomer','User is registered and purchased a Gold Subscription for goods, services, Offers and Discounts', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() ),",

            "( UUID(), 'PremiumCustomer','User is registered and purchased a Premium Subscription for goods, services, Offers and Discounts', true, UTC_TIMESTAMP(), UTC_TIMESTAMP() )",

            ";"
        ].join(' ');

         await queryInterface.sequelize.query(insertRolesIntoTableRoles);

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
