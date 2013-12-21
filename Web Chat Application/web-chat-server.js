/*
 * A simple Chat server.
 * @author Robert Northard
 */
var net = require('net');

var clients = [];

function Client(stream) {
    this.name = null;
    this.stream = stream;

    Client.prototype.setName = function (name) {
        this.name = name;
    };

    Client.prototype.getName = function () {
        return this.name;
    };

    Client.prototype.getInfo = function () {
        return this.stream.remoteAddress + ":" + this.stream.remotePort;
    };

    Client.prototype.write = function (message) {
        this.stream.write(message);
    }
};

function broadcast(message, sender) {
    clients.forEach(function (client) {

        if (client === sender) return;
        client.write(sender.getName() + ":" + message);
    })
}

//Return date in 'ddd:MM:yyy hh:mm:ss'
function getDateTime() {

    var date = new Date();

    return getAsString(date.getDate()) + ":" + getAsString(date.getMonth() + 1) + ":" +
        getAsString(date.getFullYear()) + ":" + getAsString(date.getHours()) + ":" + getAsString(date.getMinutes()) + ":" + getAsString(date.getSeconds());
}

function getAsString(data) {
    return (data < 10 ? "0" : "") + data;
}

var server = net.createServer(function (socket) {
    var client = new Client(socket);
    clients.push(new Client(socket));

    console.log("Client connected: " + client.getInfo() + " " + getDateTime());
    socket.write("Welcome " + client.getInfo() + "\n");
    broadcast(client.getInfo() + " has joined the chat!\n", client);

    //client on connect
    socket.on('connect', function () {
        socket.write("Please enter your name:");
    });

    //client receives data
    socket.on("data", function (data) {
        if (client.name == null)
        //remove \r\n
            client.setName(data.toString().substr(0, data.length - 1));
        else
            broadcast(data, client);
    });

    //client disconnects
    socket.on('end', function () {
        //remove client from list
        var index = clients.indexOf(client);
        clients = clients.splice(index, 1);
        socket.end();
    });

    socket.on('error', function (err) {
        //console.log(err);
    });

}).listen(9000);

console.log("############ Chat Server Started on 127.0.0.1:9000 ############");
