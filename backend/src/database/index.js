import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/devradar',
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    );

    mongoose.connection.on('connected', () =>
      console.log('Database connected')
    );
  }
}

export default new Database();
