var Benchmark = require('benchmark');
var fast = require('fast-stable-stringify');
var faster = require('faster-stable-stringify');
var faster2 = require('faster-stable-stringify-2');
var stableStringify = require('json-stable-stringify');

var stable = function(data, replacer) {
	return stableStringify(data, {
		replacer: replacer
	});
}

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

		console.log('JSON.stringify:');
		console.log(JSON.stringify(args, replacer));
		console.log('');
		console.log('nickyout/fast-stable-stringify:')
		console.log(fast(args, replacer));
		console.log('');
		console.log('ppaskaris/faster-stable-stringify:')
		console.log(faster(args, replacer));
		console.log('');
		console.log('nkovacs/faster-stable-stringify-2:')
		console.log(faster2(args, replacer));
		console.log('');
		console.log('substack/json-stable-stringify:')
		console.log(stable(args, replacer));
		console.log('');

	}
}))
.add('JSON.stringify', function() {
	result += JSON.stringify(args, replacer).length;
})
.add('nickyout/fast-stable-stringify', function() {
	try {
		result += fast(args, replacer).length;
	} catch (err) {
		console.log('fast', err);
	}
})
.add('ppaskaris/faster-stable-stringify', function() {
	try {
		result += faster(args, replacer).length;
	} catch (err) {
		console.log('faster', err);
	}
})
.add('nkovacs/faster-stable-stringify-2', function() {
	try {
		result += faster2(args, replacer).length;
	} catch (err) {
		console.log('faster2', err);
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
