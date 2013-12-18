
/*
*	A simple concurrent HTTP web server to demonstrate power of Node.js non-blocking IO.
*/

var http = require('http'),
	fs = require('fs');

//process request
function process(command, resource, response){

	//all web files in a sub-directory called www/
	var fileName = "./www" + resource
	
	//output response resource name
	console.log(fileName);
	
	if (command != "GET"){
		
		//send 501 methods not implmeneted
		response.writeHead("501", "Not Implemented", {
								'Server' : 'Robert Server',
		  						'Content-Type': 'text/plain' });
	}else{
		
		fs.exists(fileName, function (exists){
	
			//check if filse exists
			if (exists){
			
				fs.readFile(fileName,'utf-8',function(err, data){
					if (!err){
						
						//send 200 file found
						response.writeHead("200", "OK", {
											'Server' : 'Robert Server',
					  						'Content-Type': 'text/plain' });
						response.end(data);
					}
				});
				
			}else{
				//send 404
				response.writeHead("404", "File Not Found", {
									'Server' : 'Robert Server',
			  						'Content-Type': 'text/plain' });
			}
		});
	}
};

//create server
var server = http.createServer(function (request, response) {
	
	var method = request.method, 
		resource = request.url,
		version = request.httpVersion;
		
	//process http request
	process(method, resource, response);
	
});

//await connection
server.listen(8000);

//demonstrate non-blocking IO 
console.log("Starting http server at", server.address().address, " on port ", server.address().port);
