const express = require('express');
const bodyParser = require('body-parser');
//const request = require("request");
const https = require("https");
var request = require('superagent');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


// Route to serve the HTML file
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
  });
  
  // Start the server
  app.listen(3003, function() {
    console.log('Server is running on port 3003');
  });



  var mailchimpInstance   = 'us17';
  var listUniqueId        = '8a1ee774df';
  var mailchimpApiKey     = {YOUR_API_KEY};

app.post('/', function (req, res) {
  const firstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.email;

  request
      .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .send({
        'email_address': req.body.email,
        'status': 'subscribed',
        'merge_fields': {
          'FNAME': req.body.firstName,
          'LNAME': req.body.lastName
        }
      })
          .end(function(err, response) {
            if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
              res.sendFile(__dirname + '/success.html');
            } else {
              res.sendFile(__dirname + '/failure.html');
            }
        });
});

app.post("/failure" ,function (req, res) {
  res.redirect("/")
});
