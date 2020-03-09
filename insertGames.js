 let connect = require("./mongo")
 let jsonData = require('./games.json')

 async function insertGames() {
     let db = await connect()
     let games = db.collection('games')
     const result = await games.insert(jsonData.games)
     console.log(result);

 }
 insertGames()