const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/4f84af0c9e";

  const options = {
    method: "POST",
    auth: "shreya1:0161a46a7bda44f0602a58e201c8acda-us1"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/")
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and running on port 3000");
});

// API Key
// 0161a46a7bda44f0602a58e201c8acda-us1

// List Key
// 4f84af0c9e
