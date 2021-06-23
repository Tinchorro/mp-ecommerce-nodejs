var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();


// SDK de Mercado Pago
const mercadopago = require ('mercadopago');
// Agrega credenciales
mercadopago.configure({
  access_token: 'PROD_ACCESS_TOKEN'
});

const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService");
const PaymentInstance = new PaymentController(new PaymentService());

 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get("/success", (req, res) => {
  res.render("success", req.query);
});

app.get("/error", (req, res) => {
  res.render("falure");
});

app.get("/pending", (req, res) => {
  res.render("pending");
});

app.post("/payment/new", (req, res) =>
  PaymentInstance.getMercadoPagoLink(req, res)
);

app.post("/webhook", (req, res) => 
PaymentInstance.webhook(req, res));


app.listen(port);