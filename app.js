var express = require('express')
var bodyParser = require('body-parser')
var User = require('./models/user').User
const crypto = require('crypto');
//var session = require('express-session')
var cookieSession = require('cookie-session')
var router_app = require('./routes_app')
var session_middleware=require('./middlewares/session')
var methodOverride = require('method-override')
var upload_image = require('express-form-data')
var http = require('http')

var app = express()
var server = http.Server(app)

app.use('/public', express.static('public'))
app.use(bodyParser.json()) //para peticiones application json
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
//app.use(session({
	//secret:'1225sdffgfcvbffsd',
	//resave: false,
	//saveUninitialized: false
//}))

app.use(cookieSession({
	name: 'session',
	keys: ['llave-1','llave-2']
}))
app.use(upload_image.parse({keepExtensions:true}))
app.set('view engine', 'jade')
app.get('/', function(req, res){
	res.render('index')
})
app.get('/signup', function(req, res){
	User.find(function(err, doc){
		res.render('signup')
	})
})
app.get('/login', function(req, res){
	res.render('login')
	})


app.post('/users', function(req, res){

const secret1 = req.body.password;
const hash1 = crypto.createHmac('sha256', secret1)
                   .update('I love cookies')
                   .digest('hex');
const secret2 = req.body.password_confirmation;
const hash2 = crypto.createHmac('sha256', secret2)
                   .update('I love cookies')
                   .digest('hex');
	var user=new User({email: req.body.email,
					    password: hash1,
						password_confirmation: hash2,
						username: req.body.Username
						})
user.save().then(function(us){
	res.render('login')
	},function(err){
	console.log(String(err))
	res.send('Hubo un error al guardar el usuario')
	})
})
app.post('/sessions', function(req, res){
	const secret1 = req.body.password;
const hash1 = crypto.createHmac('sha256', secret1)
                   .update('I love cookies')
				   .digest('hex');
	
		User.findOne({email:req.body.email,password:hash1},
		function(err,user){
			
			req.session.user_id=user._id
			res.redirect('/app')
		})
})
app.use('/app', session_middleware)
app.use('/app', router_app)
server.listen(3000)
console.log("conectado en puerto http://localhost:3000")
