self.addEventListener( 'fetch', (event) => {
  if ( event.request.url.indexOf( '/public/' ) !== -1 ) {
    return false
  }
});
