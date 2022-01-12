const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  console.log("Newsletter status: ", res.statusCode);
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [{
      "email_address": email,
      "status": "subscribed",
      "merge_fields": {
        "FNAME": firstName,
        "LNAME": lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "TestIt2128506:36157c2f9d72a2dcdff9eede391d8c34-us20"

  };

  const url = "https://us20.api.mailchimp.com/3.0/lists/e3ef5a997f/";

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      console.log("Sending to mailchimp status: " + response.statusCode);

      res.sendFile(__dirname + "/success.html");

    } else {

      console.log("Sending to mailchimp status: " + response.statusCode);
      res.sendFile(__dirname + "/failure.html");

    }

    response.on("data", function(data) {
      //console.log(JSON.parse(data));

    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
  // res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Newsletter on port 3000");
});


// apiKey = "36157c2f9d72a2dcdff9eede391d8c34-us20";
// listID = "e3ef5a997f";

//https://us20.api.mailchimp.com/3.0/lists/e3ef5a997f/members?user="anystring:36157c2f9d72a2dcdff9eede391d8c34-us20"&d={"email_address":"","email_type":"","status":"subscribed","merge_fields":{},"interests":{},"language":"","vip":false,"location":{"latitude":0,"longitude":0},"marketing_permissions":[],"ip_signup":"","timestamp_signup":"","ip_opt":"","timestamp_opt":"","tags":[]}'
