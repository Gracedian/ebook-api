 
const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../modules/users/users.model'),
    Quiz : require('../modules/quiz/quiz.model'),
    Latian : require('../modules/latian/latian.model'),
    ResultQuiz : require('../modules/quiz/result.model'),
    ResultLat : require('../modules/latian/resultlat.model')

};