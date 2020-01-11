var express = require('express');
var router = express.Router();
var path = require('path');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});




/*
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: 'O7GZASfLzPRxAMjOZxJNw7ni6',
  consumer_secret: 'BlQGP4ptjcsT9lCrLnMmcaiQaNMeIlzlDoQyO8xPC02OQybe2L',
  access_token_key: '289043683-bjaEdR5n9wu336LiogNE0jhXVoVkRXILvXbtKR6O',
  access_token_secret: 'pb4trWNelnsmPDgTYbPqbY4TNwBeH132yp80HKrywWbud'
});


client.get('search/tweets', params, function(err, data, response) {
  if(!err){
    for(let i = 0; i < data.statuses.length; i++){
      //console.log(data.statuses[i].text);
    }
  } else {
    console.log(err);
  }
})
*/


module.exports = router;
