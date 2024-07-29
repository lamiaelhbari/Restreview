/* Restreview is an application that publicly compiles reviews on selected restaurants.
- For this project, we’ll focus on implementing best practices and adding layers of 
  security to protect the app from DOM-Based, Reflected, and Stored XSS Attacks.
- We’ll make use of helmet and express-validator as well as explore how to use alternative
  methods from the document object in order to prevent any potential attacks on the 
   application.
 */ 

const express = require("express");
const session = require("express-session");
// Require new packages below
const helmet = require("helmet");
// Add the 'check' function below:
const { validationResult, check } = require("express-validator");

const PORT = process.env.PORT || 4001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set('trust proxy', 1)
// Add helmet below
app.use(helmet());

app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 300000000, 
      sameSite: 'none',
      // Add the appropiate properties below:
      httpOnly: true,
		 secure: true  

    },
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

// Endpoint in development
app.post(
  "/review",
  [
    // Add the middleware to validate email and restaurant info below: 
     check('email').isEmail().notEmpty().blacklist('< ', '>').isNumeric(),
    
  ],
  (req, res) => {
    var errors = validationResult(req).array();
    console.log(`Errors found: ${JSON.stringify(errors)}`);
    if (errors.length >= 1) {
      res.redirect("/error");
    } else {
      console.log("Data was valid!");
      res.redirect("/success");
    }
  }
);

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(PORT, () =>
  console.log(`The server is listening at port: http://localhost:${PORT}`)
);
