module.exports = fn => function(req,res,next){
    fn(req,res,next).catch(next);
}