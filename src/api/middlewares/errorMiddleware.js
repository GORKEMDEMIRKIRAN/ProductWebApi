

const errorMiddleware=(err,req,res,next)=>{
    console.error(err.stack);

    // Default error status and message
    let statusCode=500;
    let message='Interval Server Error';

    // Custom error handling based on error type
    if(err.name==='ValidationError'){
        statusCode=400;
        message=err.message;
    }else if(err.message==='User not found' || err.message==='Product not found'){
        statusCode=404;
        message=err.message;
    }else if(err.message==='User with this email already exists'){
        statusCode=409;
        message=err.message;
    }

    res.status(statusCode).json(
        {
            success:false,
            message,
            stack:process.env.NODE_ENV==='development'?err.stack:undefined
        }
    );
}
module.exports=errorMiddleware;