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


var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: 'O7GZASfLzPRxAMjOZxJNw7ni6',
  consumer_secret: 'BlQGP4ptjcsT9lCrLnMmcaiQaNMeIlzlDoQyO8xPC02OQybe2L',
  access_token_key: '289043683-bjaEdR5n9wu336LiogNE0jhXVoVkRXILvXbtKR6O',
  access_token_secret: 'pb4trWNelnsmPDgTYbPqbY4TNwBeH132yp80HKrywWbud'
});

/*
function sendData(data){
  var textList = [];
    for (i = 0; i < data.length; i++){
      textList.push(data[i].full_text)
    }
  return textList;
}
*/

function sendData2(ourData){
  var htmlTweetList = [];

  for (i = 0; i< ourData.length; i++){
    htmlTweetList.push(embedTweet(ourData, i));
  }

  console.log(htmlTweetList);
  return htmlTweetList;
}

function embedTweet(ourData, i){
  https.get('https://api.twitter.com/oauth/authenticate?oauth_token=' + client.access_token_key, (resp) => {
    let data = '';

  // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
  })});


  https.get('https://publish.twitter.com/oembed?url='.concat('https://twitter.com/', ourData[i].screen_name, '/status/', ourData[i].id_str), (resp) => {
  let body = '';
  // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      body += chunk;
    });

    resp.on('end', () => {
      console.log(JSON.parse(body).html);
      return JSON.parse(body).html;
    });
  });

}
//params for our twitter api call
var params = {
  q: 'RBC fix',
  count: 50,
  result_type: 'recent',
  lang: 'en',
  tweet_mode:'extended'
}

app.get('/send', (req, res) => {
  client.get('search/tweets', params, function(err, data, response) {
    if(!err){
      res.send(sendData2(data.statuses));
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
