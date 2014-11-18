var exports = module.exports = {};
var url = require("url");
var database = {};
database.results = [];

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  //
  var writeToDatabase = function(query, room) {
      var query = JSON.parse(query);
      var room = room || "";
      var item = {
        room: room,
        message: query.message,
        username: query.username
      };
      database.results.push(item);
    };

  console.log("Serving request type " + request.method + " for url " + request.url);
  // var query = url.parse(request.url, true).query;
  var path = url.parse(request.url, true).pathname;
  var route = path.split('/classes')[1];


  var headers = defaultCorsHeaders;

// Do something with options
  if (request.method === "OPTIONS") {
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }


  // if request.method == get
  if (request.method === "GET") {
    // var query = url.parse(request.url, true).query;
    // var path = url.parse(request.url, true).pathname;
    // console.log(path);
    if (route === "/messages"){
      var statusCode = 200;
      // console.log(JSON.stringify(database));
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(database));
    } else if (route === "/room1" ){
      console.log(route);
      var statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(database));

    } else {
      var statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
    //  parse the url for funny stuff
    // var query = url.parse(request.url, true).query;
    //  filter through storage
    //  check if data is in storage
    //    if not, return the 400 status code
    //  put filtered data in json format
  }
  //  return data

  if(request.method === "POST") {
    // var query = url.parse(request.url, true).query;
    // var path = url.parse(request.url, true).pathname;
    // console.log("This is posting something1" + path);
    if (route === "/messages" || path === "/send"){
      // console.log("This is posting something" + query);
      var statusCode = 201;
      request.on("data", function(data) {
        // console.log(data);
        writeToDatabase(data, "");
      });
      // database.results.push(query);
      // console.log(database);
      response.writeHead(statusCode, headers);
      response.end();
    } else if (route.length > 0 ){
      // console.log("route: " + route);
      // console.log("query: " + query.username);
      var statusCode = 201;
      request.on("data", function(data) {
        console.log(data);
        writeToDatabase(data, route);
      });
      // // database.results.push(query);
      // console.log(database);
      console.log(statusCode);
      response.writeHead(statusCode, headers);
      response.end();
    }else {
      var statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }
  // if request.method == post
  //   parse the url for funny stuff
  //   put the data from url into storage
  //   return 200 status
  //else
  //  (nothing in url) send 400 code


  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "text/plain";


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify(database));


};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "Origin, x-parse-application-id, x-parse-rest-api-key, content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;

