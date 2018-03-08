var Imagen = require('../models/imagenes')

module.export = function (image,req,res) {
  //true = tienes permiso
  //false = no tienes permiso
  if(req.method === 'GET' && req.path.indexOf('edit') < 0){
    //ver la imagen
    return true
  }
  if(typeof image.creator == 'undefined') return false
  if(image.creator-_id.toString() == res.locals.user._id){
    //esta imagen yo la subi
    return true
  }
  return false
}
