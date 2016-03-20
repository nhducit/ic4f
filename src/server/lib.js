/**
 * Created by duc on 20/03/2016.
 */

module.exports = {
  getImagesInOnePage: getImagesInOnePage,
  getImagesInMultiplePage: getImagesInMultiplePage
};

var fs = require('fs');
var Promise = require('bluebird');
var requestPromise = require('request-promise');
var request = Promise.promisifyAll(require("request"), {multiArgs: true});
// Promise.promisifyAll(request);
var cheerio = require('cheerio');

var _ = require('lodash');
var lastPage = 1;
var images = [];
var imageMapping = {};

/**
 *
 * @param url
 * @returns {*}
 */
function getImagesInOnePage(url) {
  // request.getAsync({
  //   url: url,
  //   method: 'GET'
  // })

  return requestPromise(url)
    .then(function (body) {
      var images = getImages(body);
      return images;
    });
}

/**
 *
 * @param htmlString
 * @returns {*}
 */
function getImages(htmlString) {
  var $ = cheerio.load(htmlString);
  var posts = $('div#posts div.voz-post-message img');
  var images = _.chain(posts).filter(function (image) {
    var imageSrc = image.attribs.src;
    return imageSrc.indexOf('images') !== 0 && imageSrc.indexOf('images') !== 1;
  }).map(function (image) {
    return image.attribs.src;
  }).value();
  return images;
}

/**
 *
 * @param url
 * @returns {*}
 */
function getImagesInMultiplePage(url) {
  var max = 347;
  var promises = [];
  var pageUrl;
  _.times(max, function (i) {
    pageUrl = getPageUrl(url, i);
    promises.push(getImagesInOnePage(pageUrl));
  });
  return Promise.all(promises).then(function (array) {
    var result = [];
    var mapping = {};
    _.forEach(array, function (images) {
      result = result.concat(images);
    });
    // _.forEach(result, function (image) {
    //   if (!mapping[image]) {
    //     mapping[image] = image;
    //     result.push(image);
    //   }
    // });
    result = _.uniq(result);
    return result;
  });
}

/**
 *
 * @param url
 * @param pageNum
 * @returns {string}
 */
function getPageUrl(url, pageNum) {
  return url + '&page=' + pageNum;
}

/**
 *
 * @param $
 * @returns {*}
 */
function getLastPageNumber($) {
  //find a better way to get title
  var title = $('div.pagenav td.alt1 a').attr(title);
  title = title.title;
  var lastPage = _.last(title.split(' '));
  lastPage = parseInt(lastPage.replace(/,/g, ''), 10);
  lastPage = parseInt(lastPage/10, 10);
  return lastPage;
}

var url = 'https://vozforums.com/showthread.php?t=3018723';
getImagesInMultiplePage(url);

/**
 *
 * @param pageImages
 */
function pushImagesToArray(pageImages) {
  _.forEach(pageImages, function (image, index) {
    if (!imageMapping[image]) {
      imageMapping[image] = image;
      // download(image, image, _.noop);
    }
  });
}

/**
 *
 * @param uri
 * @param filename
 * @param callback
 */
function download(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}


// getImagesInOnePage(url, pushImagesToArray)