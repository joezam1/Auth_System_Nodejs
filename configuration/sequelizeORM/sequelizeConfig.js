
let emptyConnection = {
    database:'auth_server',
    username:'',
    password:'',
    options:{
        host:'',
        dialect:'mysql'
    }
}
let service = {
    emptyConnection: emptyConnection
}

module.exports = service;