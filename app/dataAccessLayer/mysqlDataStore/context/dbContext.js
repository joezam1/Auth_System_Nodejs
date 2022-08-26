const Sequelize = require('sequelize');
const sequelizeConfig = require('../../../../configuration/sequelizeORM/sequelizeConfig.js');
const User = require('../mappings/models/user.js');
const Role = require('../mappings/models/role.js');
const UserRole = require('../mappings/models/userrole.js');
const Register = require('../mappings/models/register.js');
const AuthRoleSection = require('../mappings/models/authrolesection.js');
const Session = require('../mappings/models/session.js');
const SessionActivity = require('../mappings/models/sessionactivity.js');
const Token = require('../mappings/models/token.js');


let sequelizeConnection = null;
let allSequelizeModels = null;

function getSequelizeConnection(){

    if(sequelizeConnection === null){

        let database = sequelizeConfig.emptyConnection.database;
        let username = sequelizeConfig.emptyConnection.username;
        let password = sequelizeConfig.emptyConnection.password;
        let options = sequelizeConfig.emptyConnection.options;
        sequelizeConnection = new Sequelize(database,username,password,options);
    }

    return sequelizeConnection;
}


let getActiveDatabaseName = function(){
    let database = sequelizeConfig.emptyConnection.database;
    return database
}

let getSequelizeContext = function(){
    if(allSequelizeModels === null){
        let sequelize = getSequelizeConnection();
        let allDataTypes = Sequelize.DataTypes;
        let userDtoModel = User(sequelize, allDataTypes);
        let roleDtoModel = Role(sequelize, allDataTypes);
        let userRoleDtoModel = UserRole(sequelize, allDataTypes);
        let registerDtoModel = Register(sequelize, allDataTypes);
        let authRoleSectionDtoModel = AuthRoleSection(sequelize, allDataTypes);
        let sessionDtoModel = Session(sequelize, allDataTypes);
        let sessionActivityDtoModel = SessionActivity(sequelize, allDataTypes);
        let tokenDtoModel = Token(sequelize, allDataTypes);

        allSequelizeModels = {
            userDtoModel : userDtoModel,
            roleDtoModel : roleDtoModel,
            userRoleDtoModel : userRoleDtoModel,
            registerDtoModel :  registerDtoModel,
            authRoleSectionDtoModel : authRoleSectionDtoModel,
            sessionDtoModel : sessionDtoModel,
            sessionActivityDtoModel : sessionActivityDtoModel,
            tokenDtoModel : tokenDtoModel
        }
        return allSequelizeModels;
    }

    return allSequelizeModels;
}


let service = {
    getActiveDatabaseName : getActiveDatabaseName,
    getSequelizeContext : getSequelizeContext
}
module.exports = service;