const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const collection = "chat"
const chatSchema = new Schema({
  
})

class ChatDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super(collection,chatSchema)
  }
}

module.exports = ChatDaoMongoDb;