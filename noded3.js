var express = require('express');
var d3=require('d3');
var fs=require('fs');
var app=express();
const PORT = process.env.PORT || 5000
app.use(express.static(__dirname + ''));
var data;
fs.readFile("finalClean.csv", "utf8", function(error, csv) {
	console.log("read Start");
	data = d3.csvParse(csv);
	console.log("read Complete");
});

app.get('/',function(req,resp){
	resp.sendFile('index.html',{root: path.join(__dirname, '')});
})

app.get('/weaponVsSex',function(req,res){
	//res.end("true");
	//console.log(data[0]);
	var weapon = d3.nest()
	  .key(function(d) { return d.Weapon; })
	  .key(function(d) { return d.OffSex; })
	  .rollup(function(v) { return v.length })
	  .object(data);
	res.end(JSON.stringify(weapon));
});

app.get('/yearVsCasesSolved',function(req,res){
	var start=req.query.start;
	var end=req.query.end;
	console.log(start+" "+end);
	var tempd3=data.filter(function(d) { return d.Year>=start&&d.Year<=end; });
	var solved = d3.nest()
	  .key(function(d) { return d.Year; })
	  .key(function(d) { return d.Solved; })
	  .rollup(function(v) { return v.length })
	  .object(tempd3);
	res.end(JSON.stringify(solved));
});

app.get('/monthVsCases',function(req,res){
	var start=req.query.start;
	var end=req.query.end;
	console.log(start+" "+end);
	var tempd3=data.filter(function(d) { return d.Year>=start&&d.Year<=end; });
	var solved = d3.nest()
	  .key(function(d) { return d.Month; })
	  .key(function(d) { return d.Solved; })
	  .rollup(function(v) { return v.length })
	  .object(tempd3);
	res.end(JSON.stringify(solved));
});

app.get('/victimVsRelation',function(req,res){
	var relArr=req.query.attr;
	var start=req.query.start;
	var end=req.query.end;
	var type=req.query.type;
	console.log(type);
	console.log(relArr);
	if(type=="V"){
		var tempd3=data.filter(function(d) { return relArr.includes(d.Relationship)&&Number(d.VicAge)>=Number(start)&&Number(d.VicAge)<=Number(end);});
		var solved = d3.nest()
		  .key(function(d) { return d.Relationship; })
		  .key(function(d) { return d.VicAge; })
		  //.key(function(d){ return d.OffAge; })
		  .rollup(function(v) { return v.length })
		  .object(tempd3);
		res.end(JSON.stringify(solved));
	}
	else if(type=="O"){
		var tempd3=data.filter(function(d) { return relArr.includes(d.Relationship)&&Number(d.OffAge)>=Number(start)&&Number(d.OffAge)<=Number(end);});
		var solved = d3.nest()
		  .key(function(d) { return d.Relationship; })
		  .key(function(d) { return d.OffAge; })
		  //.key(function(d){ return d.OffAge; })
		  .rollup(function(v) { return v.length })
		  .object(tempd3);
		res.end(JSON.stringify(solved));
	}
	else{
		res.end("false");
	}
});


app.get('/weaponvsRelation',function(req,res){
	var relArr=req.query.attr;
	var start=req.query.start;
	var end=req.query.end;
	var type=req.query.type;
	console.log(type);
	console.log(relArr);
	if(type=="V"){
		var tempd3=data.filter(function(d) { return relArr.includes(d.Relationship)&&Number(d.VicAge)>=Number(start)&&Number(d.VicAge)<=Number(end);});
		var solved = d3.nest()
		  .key(function(d) { return d.Relationship; })
		  .key(function(d) { return d.Weapon; })
		  //.key(function(d){ return d.OffAge; })
		  .rollup(function(v) { return v.length })
		  .object(tempd3);
		res.end(JSON.stringify(solved));
	}
	else if(type=="O"){
		var tempd3=data.filter(function(d) { return relArr.includes(d.Relationship)&&Number(d.OffAge)>=Number(start)&&Number(d.OffAge)<=Number(end);});
		var solved = d3.nest()
		  .key(function(d) { return d.Relationship; })
		  .key(function(d) { return d.Weapon; })
		  //.key(function(d){ return d.OffAge; })
		  .rollup(function(v) { return v.length })
		  .object(tempd3);
		res.end(JSON.stringify(solved));
	}
	else{
		res.end("false");
	}
});

app.get('/getRelationshipAttr',function(req,res){
	var solved=d3.nest()
	.key(function(d) {return d.Relationship;})
	.rollup(function(v) {return v.length;})
	.object(data);
	res.end(JSON.stringify(solved));
});

app.get('/getWeaponAttr',function(req,res){
	var solved=d3.nest()
	.key(function(d) {return d.Weapon;})
	.rollup(function(v) {return true;})
	.object(data);
	res.end(JSON.stringify(solved));
});

app.listen(PORT,function(){
	console.log('listening');

});
