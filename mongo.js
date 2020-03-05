const { MongoClient } = require("mongodb")

require("dotenv").config()
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`

const dbName = "finderDB"
const client = new MongoClient(url)


async function connect() {
    await client.connect()
    const db = client.db(dbName)
    return db

}

module.exports = connect