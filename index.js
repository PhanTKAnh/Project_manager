const express = require('express');
var path = require('path');
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const session = require("express-session")
var flash = require('express-flash')
var moment= require('moment')
require('dotenv').config()
const database =require("./config/database");
database.connect();


const sytemConfig = require("./config/system")


const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")


const app = express()
const port = process.env.PORT;

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// console.log(__dirname);


app.use(express.static(`${__dirname}/public`));

app.set('views',`${__dirname}/views`);
app.set('view engine', 'pug');

// flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//end flash

// tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End tinymce


// App Locals Variable
app.locals.prefixAdmin = sytemConfig.prefixAdmin;
app.locals.moment = moment;

// Route
routeAdmin(app);
route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})