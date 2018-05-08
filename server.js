const fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');

if(typeof require !== 'undefined') XLSX = require('xlsx');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/static"));
// app.use(session({secret: 'thisIsSecret',resave: true, saveUninitialized: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
})



var workbook = XLSX.readFile('file.xlsx');
var cells = []
var data = []
var key_cells = []


function get_Data_From_Sheet(workbook) {
  for (var key in workbook.Sheets.Sheet1) {
    if (workbook.Sheets.Sheet1.hasOwnProperty(key)) {
      cells.push(key)
    }
  }

  for (var i = 0; i < cells.length-1; i++) {
    var name = cells[i]
    var object = workbook.Sheets.Sheet1[name]
    // console.log(object.w);
    var split_key = cells[i].split("")
    data.push(object.w)
    key_cells.push(split_key[0])
  }
}

get_Data_From_Sheet(workbook)



function countUnique(list) {
  var unique = {}
  var length = 0
  for (var i = 0; i < list.length; i++) {
    if (!unique.hasOwnProperty(list[i])) {
      length++
      unique[list[i]] = 1
    }
    else {
    }
  }
  return length
}

var length = countUnique(key_cells)


function organize_data(data, num) {
  var list = [];
  var list_of_lists = [];

  for (var key in data.Sheets.Sheet1) {
    list.push(key);
  }

  for (var i = 0; i < list.length-1; i+=num) {

    var temp_list = [];
    var j = i;
    var count = 0;
    while (count < num) {
      var name = list[j]
      var object = data.Sheets.Sheet1[name]

      var split_key = list[i].split("")
      if (typeof object == 'object') {
        temp_list.push(object.w)
      }
      count++;
      j++;
    }
    list_of_lists.push(temp_list)
  }
  return list_of_lists
}

const email_data = organize_data(workbook, length);


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jradtkey',
    pass: 'Jaredradtkey1'
  }
});
var i = 0
function assignVariables(data) {
  var fails = [];
  setTimeout(function () {

      if (i < data.length) {
        let email = data[i][0];
        var mailOptions = {
          from: "jradtkey@gmail.com",
          to: email,
          subject: 'Hi' + ' ' + data[i][1] + '!',
          text: 'It looks like you had' + ' ' + data[i][2] + ' customers this week. WHOOOOO YAAAA' + ' ' + data[i][3]
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            fails.push(email);
            console.log(fails);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        assignVariables(data);
      }
      i++;
   }, 1000)

  // setTimeout(function(){ console.log(email_data[0]); }, 2000);
  // setTimeout(function(){ console.log("hello"); }, 4000);
  // setTimeout(function(){ console.log(email_data[2]); }, 6000);
}
assignVariables(email_data);

// while (data.length > 0) {
//   var i = data.length-1;
//   assignVariables(email_data);
//   data.pop();
//   i--;
// }


// function sendEmails(data) {
//
//   var fails = []
//   var inputs = {}
//
//   for (var i = 0; i < data.length; i++) {
//     for (var j = 0; j < data[i].length; j++) {
//       inputs[j] = data[i][j]
//     }
//
//     let email = inputs[0];
//
//     function send_emails(email, inputs) {
//
//       var mailOptions = {
//         from: "jradtkey@gmail.com",
//         to: email,
//         subject: 'Hi' + ' ' + inputs[1] + '!',
//         text: 'It looks like you had' + ' ' + inputs[2] + ' customers this week. WHOOOOO YAAAA' + ' ' + inputs[3]
//       };
//       return mailOptions
//     }
//     function sendEm(mailOptions) {
//       transporter.sendMail(mailOptions, function(error, info){
//         console.log("sending");
//         if (error) {
//           data.push(data[i]);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
//     }
//     sendEm(send_emails(email, inputs))
//
//   }
// }
// sendEmails(email_data)
app.listen(process.env.PORT || 8000);
// print to terminal window
console.log("Listening on 8000");
