const Datastore = require('nedb-promise')

const users = new Datastore({ filename: './data/users.db', autoload: true })

const userList = require('./users.json')

users.insert(userList.users, function(err, newDoc) {});