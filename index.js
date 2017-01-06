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
    loadDriveApi();
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

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
  gapi.client.load('drive', 'v3', readFile);
  console.log('loaded drive');
};

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
        fields: 'name,webContentLink'
      }
    }).then(
      function (resp) {
        console.log(resp.result);
        console.log('requesting ' + resp.result.webContentLink);
      $.ajax(resp.result.webContentLink, { dataType : 'text' }).done(function(xml) {
        viewer.importXML(xml);
      });
        // gapi.client.request({
          // path: resp.result.webContentLink
        // }).then(
          // function (response) {
            // console.log(response.result);
          // }, function (err) {console.log(err);}
        // );
      },
      function (err) {console.log(err);}
    );
    // gapi.client.drive.files.get({
      // fileId: file_id
    // }).then(
      // function (resp) {
        // console.log(resp.result);
      // },
      // function (err) {console.log(err);}
    // );
  } else {
    console.log("unhandled action");
  }
};
