const express = require("express");
const app = express();

const zod = require("zod");

// app.get("/ride1", function (req, res) {
//   if (oldEnough(req.query.age)) {
//     res.json({
//       msg: "you have successfully riden",
//     });
//   } else {
//     res.json({ msg: "sorry you are not of age yet" });
//   }
// });
// function oldEnough(age) {
//   return age > 14 ? true : false;
// }

// app.get("/ride2", function (req, res) {
//   if (oldEnough(req.query.age)) {
//     res.json({
//       msg: "you have successfully ride 2",
//     });
//   } else {
//     res.json({ msg: "sorry you are not of age yet" });
//   }
// });

app.get("/ride1", oldEnough, function (req, res) {
  res.json({
    msg: "you have successfully riden",
  });
});
function oldEnough(req, res, next) {
  return req.query.age > 14
    ? next()
    : res.json({ msg: " sorry not of ypiur age" });
}

app.get("/ride2", oldEnough, function (req, res) {
  res.json({
    msg: "you have successfully ride 2",
  });
});

app.listen(3000);
