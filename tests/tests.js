(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	// The `iso885916` object to test
	var iso885916 = root.iso885916 || (root.iso885916 = (
		iso885916 = load('../iso885916.js') || root.iso885916,
		iso885916 = iso885916.iso885916 || iso885916
	));

	/*--------------------------------------------------------------------------*/

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment
	QUnit.module('iso885916');

	test('iso885916.encode', function() {
		equal(
			iso885916.encode('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'U+0000 to U+007F remain unchanged'
		);
		equal(
			iso885916.encode('\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0104\u0105\u0141\u20AC\u201E\u0160\xA7\u0161\xA9\u0218\xAB\u0179\xAD\u017A\u017B\xB0\xB1\u010C\u0142\u017D\u201D\xB6\xB7\u017E\u010D\u0219\xBB\u0152\u0153\u0178\u017C\xC0\xC1\xC2\u0102\xC4\u0106\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u0110\u0143\xD2\xD3\xD4\u0150\xD6\u015A\u0170\xD9\xDA\xDB\xDC\u0118\u021A\xDF\xE0\xE1\xE2\u0103\xE4\u0107\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u0111\u0144\xF2\xF3\xF4\u0151\xF6\u015B\u0171\xF9\xFA\xFB\xFC\u0119\u021B\xFF'),
			'\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF',
			'Encoding all other symbols in the character set'
		);
		raises(
			function() {
				iso885916.encode('\uFFFF');
			},
			Error,
			'Encoding a code point that is invalid for this encoding throws an error in `fatal` mode, which is the implied default for `encode()`'
		);
		raises(
			function() {
				iso885916.encode('\uFFFF', { 'mode': 'fatal' });
			},
			Error,
			'Encoding a code point that is invalid for this encoding throws an error in `fatal` mode'
		);
		raises(
			function() {
				iso885916.encode('\uFFFF', { 'mode': 'FATAL' });
			},
			Error,
			'Mode names are case-insensitive'
		);
		raises(
			function() {
				iso885916.encode('\uFFFF', { 'mode': 'fAtAl' });
			},
			Error,
			'Mode names are case-insensitive'
		);
		equal(
			iso885916.encode('\uFFFF', { 'mode': 'html' }),
			'&#65535;',
			'Encoding a code point that is invalid for this encoding returns an HTML entity in `html` mode'
		);
		equal(
			iso885916.encode('\uFFFF', { 'mode': 'HTML' }),
			'&#65535;',
			'Mode names are case-insensitive'
		);
		equal(
			iso885916.encode('\uFFFF', { 'mode': 'hTmL' }),
			'&#65535;',
			'Mode names are case-insensitive'
		);
	});

	test('iso885916.decode', function() {
		equal(
			iso885916.decode('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'),
			'\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F',
			'U+0000 to U+007F remain unchanged'
		);
		equal(
			iso885916.decode('\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF'),
			'\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0104\u0105\u0141\u20AC\u201E\u0160\xA7\u0161\xA9\u0218\xAB\u0179\xAD\u017A\u017B\xB0\xB1\u010C\u0142\u017D\u201D\xB6\xB7\u017E\u010D\u0219\xBB\u0152\u0153\u0178\u017C\xC0\xC1\xC2\u0102\xC4\u0106\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u0110\u0143\xD2\xD3\xD4\u0150\xD6\u015A\u0170\xD9\xDA\xDB\xDC\u0118\u021A\xDF\xE0\xE1\xE2\u0103\xE4\u0107\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u0111\u0144\xF2\xF3\xF4\u0151\xF6\u015B\u0171\xF9\xFA\xFB\xFC\u0119\u021B\xFF',
			'Decoding all other symbols in the character set'
		);
		equal(
			iso885916.decode('\uFFFF'),
			'\uFFFD',
			'Decoding a byte that is invalid for this encoding returns U+FFFD in `replacement` mode, which is the implied default for `decode()`'
		);
		equal(
			iso885916.decode('\uFFFF', { 'mode': 'replacement' }),
			'\uFFFD',
			'Decoding a byte that is invalid for this encoding returns U+FFFD in `replacement` mode'
		);
		equal(
			iso885916.decode('\uFFFF', { 'mode': 'REPLACEMENT' }),
			'\uFFFD',
			'Mode names are case-insensitive'
		);
		equal(
			iso885916.decode('\uFFFF', { 'mode': 'rEpLaCeMeNt' }),
			'\uFFFD',
			'Mode names are case-insensitive'
		);
		raises(
			function() {
				iso885916.decode('\uFFFF', { 'mode': 'fatal' });
			},
			Error,
			'Decoding a byte that is invalid for this encoding throws an error in `fatal` mode'
		);
		raises(
			function() {
				iso885916.decode('\uFFFF', { 'mode': 'FATAL' });
			},
			Error,
			'Decoding a byte that is invalid for this encoding throws an error in `fatal` mode'
		);
		raises(
			function() {
				iso885916.decode('\uFFFF', { 'mode': 'fAtAl' });
			},
			Error,
			'Mode names are case-insensitive'
		);
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
