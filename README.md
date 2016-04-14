# ic4f - Image crawler for forum

Get images link from vBulletin forum (tested with version 3.8);

Clone this repository.

```
npm install
npm start
```
open this url: localhost:3456

##feature:
- choose first page to view picture.
- choose max page.
- remove website local files (log, avatar)
- remove broken images
- remove duplicated images
- support gif pictures

## Technologies and libraries.
- oboe.js: loading JSON using streaming, combining the convenience of DOM with the speed and fluidity of SAX
- bluebird: a fully featured library
- cheerio: Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- express: Fast, unopinionated, minimalist web framework for node


## Todo
- [ ] Cancel server request when click cancel button on UI
- [x] stream response
- [x] use https
- [ ] add nginx
- [ ] serve static file use nginx
- [x] apply service worker
- [ ] apply web worker
- [ ] lazy load images
- [ ] cancel request in service worker. reproduce steps: get images from 100 pages, repeat the request. 
expected behavior, second request should stop service worker fetch on going  request
