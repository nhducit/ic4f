/**
 * Created by duc on 27/01/2016.
 */
var http = require('http');
var https = require('https');
var imageType = require('image-type');
var url = 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/12360399_10205184423202754_2267272230650535782_n.jpg?oh=742775b3bbf137e8348cb340f8877cb0&oe=56FEBB89';

getImageType(url);

function getImageType(url){
  if(url.indexOf('https') === 0){
    https.get(url, function (res) {
      res.once('data', function (chunk) {
        res.destroy();
        console.log(chunk);
        console.log(imageType(chunk));
        //=> {ext: 'gif', mime: 'image/gif'}
      });
    });
  }else{
    http.get(url, function (res) {
      res.once('data', function (chunk) {
        res.destroy();
        console.log(chunk);
        console.log(imageType(chunk));
        //=> {ext: 'gif', mime: 'image/gif'}
      });
    });
  }
}