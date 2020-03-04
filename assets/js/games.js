const Datastore = require('nedb-promise')

const games = new Datastore({ filename: './data/games.db', autoload: true })

const gameList = require('./games.json')

games.insert(gameList.games, function(err, newDoc) {});