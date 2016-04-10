# ic4f - Image crawler for forum

Get images link from vBulletin forum (tested with version 3.8);

Clone this repository.

```
npm install
npm start
```
open this url: localhost:3000

feature:
- choose first page to view picture.
- choose max page.
- remove website local files (log, avatar)
- remove broken images
- remove duplicated images
- support gif pictures

## Todo
- [x] stream response
- [x] use https
- [ ] add nginx
- [ ] serve static file use nginx
- [ ] apply service worker
- [ ] apply web worker
- [ ] lazy load
- [ ] cancel request in service worker. reproduce steps: get images from 100 pages, repeat the request. 
expected behavior, second request should stop service worker fetch on going  request