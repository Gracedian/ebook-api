require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('helpers/jwt');
const errorHandler = require('helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes


app.get('/', function (req, res) {
    res.json({
        status: 200,
        message: 'API dah jalan created with love <3'
    });
});
app.use('/api/users', require('./modules/users/users.controller'));
app.use('/api/quiz', require('./modules/quiz/quiz.controller'));
app.use('/api/latian', require('./modules/latian/latian.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
