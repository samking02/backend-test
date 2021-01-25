const asyncWrapper = function(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}

module.exports = asyncWrapper;