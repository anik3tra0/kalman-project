var KalmanFilter = require('kalmanjs').default;
var fs = require('fs');
var csv = require('fast-csv');
var csvWriter = require('csv-write-stream');
var path = require('path');
var writer = csvWriter({ separator: ',', newline: '\n' });
var fileName = path.basename(process.argv[2]);

// console.log(fileName);

var DataConstant = []

fs.createReadStream(process.argv[2])
	.pipe(csv())
	.on('data', function(data){
		DataConstant.push(+data[0]);
	})
	.on('end', function(data){
		// console.log('finished');
		// console.log(DataConstant);
		filterData(DataConstant);
	});

function filterData(data) {
	// console.log('This is Noisy Data Constant: ', data);
	var kalmanFilter = new KalmanFilter({ R: 0, Q: 3 });
	var dataConstantKalman = data.map(function(v) {
	  return kalmanFilter.filter(v);
	});

	dataConstantKalman.shift();

	writer.pipe(fs.createWriteStream('new-'+fileName));
	dataConstantKalman.map(function(v) {
		writer.write({ data1: v })
	});
	writer.end()

	// console.log('This is Kalman Data Constant, It now has ' + dataConstantKalman.length + ' elements', dataConstantKalman);
}
