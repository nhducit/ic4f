var lib = require('./src/server/lib');
var express = require('express');
var path = require('path');
var _ = require('lodash');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('./src/client'));


// var url = 'https://vozforums.com/showthread.php?t=3018723';
//
// lib.getImagesInOnePage(url, function (images) {
//   console.log('images', images);
// });


app.get('/', function(req, res) {
  console.log('__dirname', __dirname);
  res.sendFile(path.join(__dirname + 'src/client/index.html'));
});

app.post('/getImages', streamResponse);
function sendAll(req, res) {
  lib.test(req.body.url, req.body.config).then(function (images) {
    res.json(images);
  });
}

function streamResponse(req, res) {
  var result ;
  var JSON_MIME_TYPE = "application/octet-stream";
  res.setHeader("Content-Type", JSON_MIME_TYPE);
  res.writeHead(200);
  var mapping = {};
  function handlePartial(partialData) {
    _.each(partialData, function (url) {
      if(!mapping[url]){
        mapping[url] = true;
        res.write(JSON.stringify({url: url}) + ',');
      }
    });

  }
  res.write('{"data": [');
  lib.getImagesInMultiplePage(req.body.url, req.body.config, handlePartial).then(function (images) {
    res.write('{"url":""}]}');
    res.end();
    // result = images;
    // res.send(images);
  });
  //   lib.getImagesInOnePage(req.body.url).then(function (images) {
  //     result = images;
  //     res.send(images);
  //   });
}
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
