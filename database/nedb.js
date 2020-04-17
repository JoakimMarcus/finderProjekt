const Datastore = require('nedb-promise')

const users = new Datastore({ filename: './data/users.db', autoload: true })
const games = new Datastore({ filename: './data/games.db', autoload: true })
let collections = { users, games }


async function connect() {
    return {
        collection: function(collectionName) {
            let c = collections[collectionName]
            if (!c) { throw new Error('collection not found') }
            return c
        }
    }
}

module.exports = { connect, collections }