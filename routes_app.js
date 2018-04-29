var express = require('express')
var Imagen = require('./models/imagenes')
var router = express.Router()
var fs = require('fs')

var image_finder_middleware = require('./middlewares/find_image')

router.get('/',function(req,res){
  Imagen.find({})
    .populate('creator')
    .exec(function(err,imagenes){
      if(err) console.log(err);
      res.render('app/home',{imagenes:imagenes})
    })
})
/* REST */
/* CRUD*/
router.get('/imagenes/new', function(req,res){
  res.render('app/imagenes/new')
})
router.all('/imagenes/:id*', image_finder_middleware)
router.get('/imagenes/:id/edit', function(req,res){
      res.render('app/imagenes/edit')
})

router.route('/imagenes/:id')
  .get(function(req,res){
        res.render('app/imagenes/show')
    })

  .put(function(req,res){
      res.locals.imagen.title=req.body.title
      res.locals.imagen.save(function(err){
        if(!err){
          res.render('app/imagenes/show')
        }else{
          res.render('app/imagenes/'+req.params.id+'/edit')
        }
      })
   })

  .delete(function(req,res){
    Imagen.findOneAndRemove({_id: req.params.id},function(err){
      if(!err){
        res.redirect('/app/imagenes')
      }else{
        console.log(err)
      }
    })
  })
  router.route('/imagenes')
    .get(function(req,res){
      Imagen.find({creator: res.locals.user._id},function(err,imagenes){
        if(err){res.rendirect('/app');return;}
        res.render('app/imagenes/index',{imagenes: imagenes})
      })
    })
    .post(function(req,res){
      var extension=req.files.archivo.name.split('.').pop()
      var imagen = new Imagen({
        title: req.body.title,
        creator: res.locals.user._id,
        extension: extension
      });
      imagen.save().then(function(ok){
          fs.rename(req.files.archivo.path, 'public/imagenes/'+imagen._id+'.'+extension)
          res.redirect('/app/imagenes/'+imagen._id)
      })
    })

module.exports=router
