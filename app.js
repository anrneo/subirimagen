var express = require('express')
var bodyParser = require('body-parser')
var User = require('./models/user').User
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
	console.log(req.session.user_id)
	res.render('index')
})
app.get('/signup', function(req, res){
	User.find(function(err, doc){
		console.log(doc)
		res.render('signup')
	})
})
app.get('/login', function(req, res){
	res.render('login')
	})


app.post('/users', function(req, res){
	var user=new User({email: req.body.email,
					    password: req.body.password,
						password_confirmation: req.body.password_confirmation,
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
		User.findOne({email:req.body.email,password:req.body.password},
		function(err,user){
			req.session.user_id=user._id
			res.redirect('/app')
		})
})
app.use('/app', session_middleware)
app.use('/app', router_app)
server.listen(3000)
console.log("conectado en puerto 3000")
