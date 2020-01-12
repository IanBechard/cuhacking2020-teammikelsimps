var createError = require('http-errors');
const https = require('https');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//nlp and sentiment analysis
const { SentimentAnalyzer } = require('node-nlp');
const sentiment = new SentimentAnalyzer({ language: 'en' });

//twitter api
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: 'O7GZASfLzPRxAMjOZxJNw7ni6',
  consumer_secret: 'BlQGP4ptjcsT9lCrLnMmcaiQaNMeIlzlDoQyO8xPC02OQybe2L',
  access_token_key: '289043683-bjaEdR5n9wu336LiogNE0jhXVoVkRXILvXbtKR6O',
  access_token_secret: 'pb4trWNelnsmPDgTYbPqbY4TNwBeH132yp80HKrywWbud'
});

//aggregate tweet data to send
function sendData(ourData){
  var textList = [];
    for (i = 0; i < ourData.length; i++){
      textList.push(ourData[i])
    }
  return textList;
}

//params for our twitter api call

var appQS =  ['RBC -RT', '', ', ']
var appParams = {
  q: appQS[i],
  count: 50,
  result_type: 'recent',
  lang: 'en',
  tweet_mode:'extended'
}

//send tweet list to client
app.get('/appSend', (req, res) => {
  client.get('search/tweets',
  q: ['RBC -RT', '', ', '],
  count: 50,
  result_type: 'recent',
  lang: 'en',
  tweet_mode:'extended', function(err, data, response) {
    if(!err){
      res.send(sendData(data.statuses));
      console.log("send data recieved")
    } else {
      console.log(err);
    }
  })
})


app.use('/', indexRouter);


app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
