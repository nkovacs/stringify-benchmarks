var Benchmark = require('benchmark');
var fast = require('fast-stable-stringify');
var stable = require('json-stable-stringify');

// benchmark is buggy.
if (typeof window !== 'undefined') {
	window.Benchmark = Benchmark;
}

var numberFormatter = function(number) {
	return number;
}
numberFormatter.runtimeKey = "Dummy numberFormatter";

var args = [ "month", {
	form: "long",
	numberFormatter: numberFormatter
} ];

var replacer = function( key, value ) {
	if ( typeof value === "function" ) {
		return value.runtimeKey; // if undefined, the value will be filtered out.
	}
	return value;
};

var result = 0;

(new Benchmark.Suite('fastest', {
	onCycle: function(e) {
		console.log('Finished benchmarking: '+ e.target + ' (cumulative string length: ' + result + ")");
		result = 0;
	},
	onComplete: function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	}
}))
.add('JSON.stringify', function() {
	result += JSON.stringify(args, replacer).length;
})
.add('nickyout/fast-stable-stringify', function() {
	try {
		result += fast(args).length;
	} catch (err) {
		console.log('fast', err);
	}
})
.add('substack/json-stable-stringify', function() {
	try {
		result += stable(args, replacer).length;
	} catch (err) {
		console.log('stable', err);
	}
})
.run({ 'async': true })
;
