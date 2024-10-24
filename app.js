const express = require("express");
const app = express();

const zod = require("zod");
// an array of numbers the schema will be
const schema = zod.array(zod.number());
// app.get("/health", function (req, res) {
//   const username = req.headers.username;
//   const password = req.headers.password;
//   const kidneyId = req.query.kidneyId;
//   if (username !== "kirat" || password != "pass") {
//     res.status(400).json({ msg: "something wrong " });
//     return;
//   }
//   if (kidneyId != 2 && kidneyId != 5) {
//     res.status(400).json({ msg: "something is wrong" });
//     // control does nt go beyond return
//     return;
//   }
//   res.status(400).json({ msg: "kidney is fine" });
// });

// dont define res after next() , it shows error
//  Cannot set headers after they are sent to the client

app.get(
  "/hello",
  function (req, res, next) {
    console.log("hi 1 ");

    next();
    console.log("hello 1");
    // dont define res after next() , it shows error
    //  Cannot set headers after they are sent to the client
    // res.json({ msg: "hi 1" });
  },
  function (req, res, next) {
    console.log("hi 2");
    next();
    console.log("hello 2");
  },
  function (req, res) {
    console.log("hi 3");
    res.json({ msg: "hi 3" });
  }
);
// output:-
// hi 1
// hi 2
// hi 3
// hello 2
// hello 1

function userMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;
  // if (username !== "kirat" || password != "pass") {
  //   same as above
  if (!(username == "kirat" && password == "pass")) {
    res.status(400).json({ msg: "something wrong " });
    return;
  } else {
    next();
  }
}
function kidneyMiddleware(req, res, next) {
  const kidneyId = req.query.kidneyId;
  if (kidneyId != 2 && kidneyId != 5) {
    res.status(400).json({ msg: "something is wrong" });
  } else {
    next();
  }
}
app.get("/health", userMiddleware, kidneyMiddleware, (req, res) => {
  res.send("you hear is health");
});
let numberofRequest = 0;
function calculateRequest(req, res, next) {
  numberofRequest++;
  next();
}
app.get("/healthcheck", calculateRequest, function (req, res) {});

// app.use(middleware_name);
// any route coming after this line will have this middleware added
//  any request that is coming it will go to whatever function express.json() returns
// express.json() get the post body and put them somewhere so that we can access

// express.json() comes before all the the routes , because it needs to gets called first and then the route needs to get called
app.use(express.json()); // express.json itself return a middleware
// why body needs this express.json(), but not req.headers and req.query
// it because I am expecting json as an input , please parse out json as input for the request
//  if you dont use express.json() , thenn body will not be extracted
console.log("express");
app.post("/healthcheckup", calculateRequest, function (req, res) {
  console.log(req.body);
});

app.post("/healthcheckkidney", function (req, res) {
  // any type of error occurs here the control  reaches here
  const kidneys = req.body.kidneys;
  // const kidneysLength = kidneys.length;
  // input validation
  const response = schema.safeParse(kidneys);
  // res.send(`you have ${kidneysLength} kidneys`);
  res.send({ response });
});
//global catches will be put at the end ,
// what will be at the end, will be called after the routes is called if there is an exception i.e the error
// error based middleware or the error handling middleware
// app.use(function (err, req, res, next) {
//   res.json({ msg: "sorry something is wrong with the server " });
// });

// input validation of an object conatining
// {
// email: string=> email
// password: atleast 9 characters
// country:'IN','US'
// }

const schema1 = zod.object({
  email: zod.string(),
  password: zod.string(),
  country: zod.literal("IN").or(zod.literal("US")),
});

//  validate the array of number with atleast 1 input
function validateInput(arr) {
  const schema = zod.array(zod.number());
  const response = schema.safeParse(arr);
  console.log(response);
}
validateInput(["p", 1, 2, 2]);
function validateInputs(arr) {
  console.log(arr);
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
  });
  const response = schema.safeParse(arr);
  console.log(response);
  return response;
}
// validateInputs({
//   email: "kirat@gmail.com",
//   password: "228888888888",
// });

app.post("/login", function (req, res) {
  console.log(req.body);
  const response = validateInputs(req.body);
  console.log(response);
  if (!response.success) {
    res.send({
      msg: "your inputs are invalid",
    });
    return;
  } else {
    res.send({ msg: response });
  }
});
app.listen(3000);
