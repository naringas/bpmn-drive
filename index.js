function checkAuth() {
  console.log('checking auth');
  // check authorization
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
};

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    $("#authorize-div").modal('hide');
    readFile();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    $("#authorize-div").modal('show');
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

function readFile() {
  var search_params = window.location.search;
  var state_uri = search_params.replace('?state=', '');
  var state = JSON.parse(decodeURIComponent(state_uri));

  console.log(state);
  if (state.action == 'open') {
    var file_id = state.ids[0];
    gapi.client.request({
      path: 'https://www.googleapis.com/drive/v3/files/' + file_id,
      params: {
        alt: 'media'
      }
    }).then(
      function (resp) {
        viewer.importXML(resp.body);
      }
    );
  } else {
    console.log("unhandled action");
  }
};
