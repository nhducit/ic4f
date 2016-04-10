/**
 * Created by duc on 10/04/2016.
 */

// navigator.serviceWorker.getRegistrations().then(function (registrations) {
//   console.log('re', registrations);
//   registrations.forEach(function(registration){
//     registration.unregister()
//
//   });
// });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/src-sw.js', {scope: '/'})
    .then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ',    registration.scope);
    }).catch(function (err) {
    console.log('ServiceWorker registration failed: ', err);
  });
}
