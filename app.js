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
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

//twitter api
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: 'O7GZASfLzPRxAMjOZxJNw7ni6',
  consumer_secret: 'BlQGP4ptjcsT9lCrLnMmcaiQaNMeIlzlDoQyO8xPC02OQybe2L',
  access_token_key: '289043683-bjaEdR5n9wu336LiogNE0jhXVoVkRXILvXbtKR6O',
  access_token_secret: 'pb4trWNelnsmPDgTYbPqbY4TNwBeH132yp80HKrywWbud'
});

//app tweets
//
//
var appParams = {
  //keywords to search for in addtion to our main search term (rbc + app or site)
  //correct query if enterprise apis enabled -> RBC app -RT bug OR fix OR broke OR support OR crash OR fail OR outage OR problem
  q: 'RBC app OR RBC app down -RT',
  count: 90,
  result_type: 'mixed',
  lang: 'en',
  tweet_mode:'extended'
}
//send tweet list to client
app.get('/appSend', (req, res) => {
    client.get('search/tweets', appParams, function(err, data, response) {
      if(!err){
        res.send(sendData(data.statuses));
      } else {
        console.log(err);
      }
    })
})

//site tweets
//
//
//
var siteParams = {
  //keywords to search for in addtion to our main search term (rbc + app or site)
  //correct query if enterprise apis enabled -> RBC site -RT bug OR fix OR broke OR support OR crash OR fail OR outage OR problem
  q: 'RBC site fix OR RBC site down OR RBC site -RT -Indigenous',
  count: 90,
  result_type: 'mixed',
  lang: 'en',
  tweet_mode:'extended'
}
//send tweet list to client
app.get('/siteSend', (req, res) => {
    client.get('search/tweets', siteParams, function(err, data, response) {
      if(!err){
        res.send(nplRemovePositive(sendData(data.statuses)));
      } else {
        console.log(err);
      }
    })
})

//negative scored Tweets
//
//
var negParams = {
  //keywords to search for in addtion to our main search term (rbc + app or site)
  q: 'RBC fix -RT -UBER -low',
  count: 90,
  result_type: 'recent',
  lang: 'en',
  tweet_mode:'extended'
}

//send tweet list to client
app.get('/negSend', (req, res) => {
    client.get('search/tweets', negParams, function(err, data, response) {
      if(!err){
        res.send(nplRemovePositive(sendData(data.statuses)));
      } else {
        console.log(err);
      }
    })
})

//aggregate tweet data to send
function sendData(ourData){
  var textList = [];
    for (i = 0; i < ourData.length; i++){
      textList.push(ourData[i])
    }
  return textList;
}

//analyze textList from sendData
//use as a wrapper: nplRemovePositive(sendData(data.statuses))
function nplRemovePositive(textList){
  console.log(textList.length);

  for(i = 0; i < textList.length; i++){
    if(sentiment.analyze(textList[i].full_text).score > -4){
      textList.splice(i, 1)
    }
  }
  console.log(textList.length);
  return textList
}



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
