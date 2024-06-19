function requestLogging( request, response, next ) {
    console.log(`[${request.method}] ${request.path} at ${new Date().toLocaleTimeString()} from ${request.ip}`);
    next();
}

module.exports.requestLogging = requestLogging;
