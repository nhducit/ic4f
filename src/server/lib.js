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

function isStartWithHttpOrHttps(link) {
  return link.indexOf('http') === 0 || link.indexOf('https') === 0;
}

function imageFilter(link) {
  if (!link || !isStartWithHttpOrHttps(link)) {
    return;
  }
  var blackListKeyword = ['http://vozforums.com/specials', 'http://www.google.com/'];
  return !_.some(blackListKeyword, function (keyword) {
    return link.indexOf(keyword) === 0;
  });
}


/**
 *
 * @param htmlString
 * @returns {*}
 */
function getImages(htmlString) {
  var $ = cheerio.load(htmlString);
  return _.chain($('img'))
    .map(function (image) {
      return _.get(image, 'attribs.src', '');
    })
    .filter(function (imageSrc) {
      return imageFilter(imageSrc);
    })
    .uniq()
    .value();
}

/**
 *
 * @param url
 * @returns {*}
 */
function getImagesInMultiplePage(url, config) {
  var promises = [];
  var pageUrl;
  var _config = config;
  _config.firstPage = _config.firstPage || 1;
  _config.maxPage = _config.maxPage || 1;
  // var promise = new Promise();
  _.times(config.maxPage, function (i) {
    pageUrl = getPageUrl(url, _config.firstPage + i + 1);
    promises.push(getImagesInOnePage(pageUrl));
  });
  return Promise.all(promises).then(function (array) {
    var result = [];
    _.forEach(array, function (images) {
      result = result.concat(images);
    });
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
  lastPage = parseInt(lastPage / 10, 10);
  return lastPage;
}

// var url = 'https://vozforums.com/showthread.php?t=4590241';
// getImagesInMultiplePage(url);

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