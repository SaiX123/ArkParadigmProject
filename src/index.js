const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(404).json({error: {msg: e.message, stack: e.stack}});
    }
});

app.get('/:param', (req, res) => {
	fs.readFile('./src/db/data.txt', function(err, data) {
		let textDoc = data.toString();
		let url = req.originalUrl.replace('/', '');
		let obj = JSON.parse(textDoc);
		if (obj[url] !== undefined) {
			res.status(200);
			res.send(obj[url]);
			res.end();
		} else {
			res.status(400);
			res.send(`key "${req.originalUrl.replace('/', '')}" cannot be found.`);
			res.end();
		}
	});
});

app.post("/update", (req, res) => {
	
	fs.readFile('./src/db/data.txt', function(err, data) {
		let textDoc = data.toString();
		let obj2 = req.body;
		let obj1 = JSON.parse(textDoc);
		var result = {};
		//value from the payload will be placed into result first, thus updating txt file 
		Object.keys(obj1).forEach(key => result[key] = obj1[key]);
		Object.keys(obj2).forEach(key => result[key] = obj2[key]);
		fs.writeFile('./src/db/data.txt', JSON.stringify(result), function (err) {
			if (err) {
				res.status(500);
				res.send('(⌣́_⌣̀) file was not updated (⌣́_⌣̀)')
				res.end();
				throw err;
			} else {
				io.emit('UPDATE', JSON.stringify(result));
				res.status(200);
				res.send('( ͡° ͜ʖ ͡°) file has been updated ( ͡° ͜ʖ ͡°)')
				res.end();
			}
		})
	});
})

app.all('*', function(req, res) {
    throw new Error("Bad request")
})


io.on('connection', (socket) => { 

	socket.on('msg', function (name, msg) {
		console.log(name, 'says', msg);
	});

 });

server.listen(3000);

export default app;
