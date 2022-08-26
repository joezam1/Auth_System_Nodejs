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
        //NOTE : Run the full project and register users with the following information


        /*


        //NOTE : Run the full project and register users with the following information, The reason is
        //because the password encryption process will take care of the selected password for your development
        //environment, The password can be updated to any other value

            Register Page

        FirstName              ,  LastName  , Username   ,         Email                                        , Password , Password
        JohnOwner              ,  Taylor    , johnowner01               , johnowner01@west.com                    , abcd     , abcd
        TomSuperAdmin          ,  Jordan    , tomsuperadmin02           , tomsuperadmin02@west.com                , abcd     , abcd
        MarkAdmin              ,  Rennix    , markadmin03               , markadmin03@west.com                    , abcd     , abcd
        RickyEditor            ,  Tolley    , rickyeditor04             , rickyeditor04@west.com                  , abcd     , abcd
        DanielModerator        ,  Parrit    , danielmoderator05         , danielmoderator05@west.com              , abcd     , abcd
        JeanneAdvertiser       ,  Yancik    , jeanneadvertiser06        , jeanneadvertiser06@west.com             , abcd     , abcd
        TamaraTechnicalAnalyst ,  Guo       , tamaratechnicalAnalyst07  , tamaratechnicalAnalyst07@west.com       , abcd     , abcd
        SammyCommercialAnalyst ,  Chey      , sammycommercialanalyst08  , sammycommercialanalyst08@west.com       , abcd     , abcd

        RayBaseCustomer        , Komol      , raybasecustomer09         , raybasecustomer09@west.com              , abcd     , abcd
        SallySilverCustomer    , Sirel      , sallysilvercustomer10     , sallysilvercustomer10@west.com          , abcd     , abcd
        MaryGoldCustomer       , Senkis     , marygoldcustomer11        , marygoldcustomer11@west.com             , abcd     , abcd
        BenPremiumCustomer     , Burton     , benpremiumcustomer12      , benpremiumcustomer12@west.com           , abcd     , abcd




        */

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
