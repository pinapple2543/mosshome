// set up server
var config = require('./config/config.js'), // import config variables
  port = config.port,                       // set the port
  express = require('express'),             // use express as the framwork
  app = express(),                          // create the server using express
  path = require('path');                   // utility module

var bodyParser = require("body-parser");
var MasterPaperlist = [];
var PaperListofchange = [];
var MozzListofchange = [];
var globalid = 0;
var Timestamp = Date.now();
var Listofcheese = [];

app.use(express.static(path.join(__dirname, 'public'))); // this middleware serves static files, such as .js, .img, .css files

// Initialize server
var server = app.listen(port, function () {
  console.log('Listening on port %d', server.address().port);
});

// Use '/' to go to index.html via static middleware

// Use '/test' to send "test" as a response.
app.get('/test', function (req, res) {
  res.send('tested');
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


app.post('/SaveComputerInfo', function(req,res){
	var params = req.params;
	//var input = JSON.parse(JSON.stringify(req.body));
	console.log("url params: ");
	console.log(params);
	console.log("input body: ");
	console.log(req.body);
	
	res.send({
		result: 'success',
		err: ''
	});

	res.send('{ result: "error", err: "couldn\'t find an item by that barcode"}');
	
});


// Add an endpoint to save a data structure as JSON to a file


app.get('/mossGame', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../Front End/Mozzarella.html'));
});




app.get('/mozzimage/:filename', function(req,res) {
	var filename = req.params.filename;
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/mozz_images/'+filename));
});




//app.use(myParser.urlencoded({extended : true}));
app.use(bodyParser.json());



//Mossta
app.get('/mozz/gridrecive/:Gridlist', function(req,res) {
	
	var parsedGridlist = req.params.Gridlist;
	
	if(parsedGridlist == 3){
		MozzListofchange = [];
		Listofcheese = [];
		globalid = 0;
	}
	if(parsedGridlist == 5){

	res.send({
			
			'Listofchange':MozzListofchange,
			'Cheeselist':Listofcheese
	});
	}

});
app.post('/mozz/gridsend', function(req,res) {

	var data = req.body;
	var inlist = false;
	var cheeseImglist = ["http://104.236.169.62:8000/mozzimage/CheeseMoving.gif","http://104.236.169.62:8000/mozzimage/CheeseCurd.gif"];
        if(data.Timestamp - Timestamp > 30000){
          MozzListofchange = [];
		Listofcheese = [];
          globalid = 0;

        }
        Timestamp = Date.now();
        if(data.timeoffset == 0){
           data.timeoffset = Timestamp-data.TimeStamp;

        }
	for(var i = 0; Listofcheese.length < 100; i++){
		var RandomX = Math.floor((Math.random() * 2000)) - 1000
		var RandomY = Math.floor((Math.random() * 2000)) - 1000
		var randomcheese = Math.floor((Math.random() * cheeseImglist.length));
	   	var cheeseobj = {
			'Id':globalid,
			'X':RandomX,
			'Y':RandomY,
			'gif':cheeseImglist[randomcheese]
		};
		globalid++;
		Listofcheese.push(cheeseobj);
	}
	   
	var clientLeft = data.X - data.Size/2;
	var clientTop = data.Y - data.Size/2;
	for(var i = 0; i < Listofcheese.length; i++){
		
		if((Listofcheese[i].X >= clientLeft && (Listofcheese[i].X <= (clientLeft + data.Size))) && (Listofcheese[i].Y >= clientTop && Listofcheese[i].Y <= (clientTop + data.Size))){
		   	Listofcheese.splice(i,1);
			data.Size += 3;
		   }
		
	}
	//console.log("Mozz list of change:");
	//console.log(MozzListofchange);
	for(var i = 0; i < MozzListofchange.length; i++){
                 Timestamp = Date.now();
		if(MozzListofchange[i].Id != data.Id){
			var charLeft = MozzListofchange[i].X - MozzListofchange[i].Size/2;
			var charTop = MozzListofchange[i].Y - MozzListofchange[i].Size/2;
		if((charLeft >= clientLeft && (charLeft + MozzListofchange[i].Size) <= (clientLeft + data.Size)) && ((charTop >= clientTop) && (charTop + MozzListofchange[i].Size) <= (clientTop + data.Size))){
		   	console.log("Eating other character");
			data.Size += MozzListofchange[i].Size;
			MozzListofchange.splice(i,1);
			continue;
		   }
	}
		 if(MozzListofchange[i].Id == data.Id){
		   	MozzListofchange[i] = data;
			inlist = true;
		   }
		 if((Timestamp - MozzListofchange[i].TimeStamp) - MozzListofchange[i].timeoffset > 2000){
			console.log(Timestamp - MozzListofchange[i].TimeStamp);
		 	MozzListofchange.splice(i,1);
			
		  }else	if(MozzListofchange[i].Isdead){
		  	MozzListofchange.splice(i,1);
			inlist = true;
		   }

	}

	if(!inlist){
		data.Id = globalid;
		globalid++;
	   	MozzListofchange.push(data);
	   }
	
	res.send({"result":"hi"});
});

//Mossta

//Paper
app.get('/Potition/gridrecive/:Gridlist', function(req,res) {
	var parsedGridlist = req.params.Gridlist;
	
	
	if(MasterPaperlist.length == 0){


			
				    for (var i = 0; i < 200; i++) {
					var rowlist = [];
					for (var j = 0; j < 200; j++) {
					    var pixel = new createpixelclass(j, i);
					    rowlist.push(pixel);
					}
					MasterPaperlist.push(rowlist);
					
				    }

		
	}
	
	if(parsedGridlist == 2){
	
		MasterPaperlist = []; // I changed this from (it used to start with var) - Soderquist
                Listofchange = []; // I changed this from (it used to start with var) - Soderquist
	   
	   
	   }			
	if(parsedGridlist == 3){
		console.log("option 3");
		console.log(Listofchange);
		//console.log(MasterPaperlist);
	   		res.send({
			//'MasterPaperlist':[{val:'I'},{val:'hope'},{val:'this'},{val:'works'}]
			'MasterPaperlist':MasterPaperlist
		
		});
	   
	   }


	var ListofColor = [];
	
	if(parsedGridlist == 5){
		console.log(PaperListofchange);
		res.send({
			'Listofchange':PaperListofchange
		});
		
	}


});
function createpixelclass(j, i) {

this.X = j;
this.Y = i;
this.div;
this.color = 'white';
this.player;
this.motion;

   
}
//app.use(myParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/Potition/gridsend', function(req,res) {
	//console.log(req.body);
	var data = req.body;
	var inlist = false;
	
	for(var i = 0; i < PaperListofchange.length; i++){
		  if(Date.now-data.TimeStamp > 10){
		   	PaperListofchange.splice(i,1);
			  inlist = true;
		for(var i = 0; i < 200; i++){
			for(var j = 0; j < 200; j++){
				if(MasterPaperlist[i][j].color == Mycolor){
					MasterPaperlist[i][j].color = 'white';
					MasterPaperlist[i][j].motion = false;
					MasterPaperlist[i][j].player = false;

				}
			}
			}
		   }else if(PaperListofchange[i].Isdead){
		   PaperListofchange.splice(i,1);
			inlist = true;
		   }else if(PaperListofchange[i].color == data.color){
		   PaperListofchange[i] = data;
			inlist = true;
		   }
	}

	if(!inlist){
	   	Listofchange.push(data);
	   }

	res.send({"result":"hi"});
	
	   
});
//Paper
