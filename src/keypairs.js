'use strict';
var brorand   = require('brorand');
var hashjs    = require('hash.js');
var EC        = require('elliptic').ec;
var ec        = new EC('secp256k1');
var secp256k1 = require('./secp256k1');
var assert    = require('assert');
var hexToBytes = require('./utils').hexToBytes;
var bytesToHex = require('./utils').bytesToHex;
var binary = require('bops');
var walletConfig = require('./wallet_config');

// var SEED_PREFIX = 33;
// var ACCOUNT_PREFIX = 0;
// var alphabet = 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz';
// var base58 = require('base-x')(alphabet)
// you know it
function sha256(bytes) {
	return hashjs.sha256().update(bytes).digest();
}

/**
 * account stub for subscribe accounts transaction event
 * can be used for many accounts
 * @param remote
 * @constructor
 */
function KeyPairs(currency) {
	this._currency = (typeof arguments[0] !== 'undefined') ? arguments[0] : 'SWT';
	this._SEED_PREFIX = 33;
	this._ACCOUNT_PREFIX = 0;
	this._alphabet = 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz';
	for(var i=0; i< walletConfig.length; i++) {
		if(walletConfig[i].currency === this._currency) {
			this._SEED_PREFIX = walletConfig[i].SEED_PREFIX;
			this._ACCOUNT_PREFIX = walletConfig[i].ACCOUNT_PREFIX;
			this._alphabet = walletConfig[i].ACCOUNT_ALPHABET;
			break;
		}
	}
	this._base58 = require('base-x')(this._alphabet);
}

/**
 * concat an item and a buffer
 * @param {integer} item1, should be an integer
 * @param {buffer} buf2, a buffer
 * @returns {buffer} new Buffer
 */
KeyPairs.prototype.__bufCat0 = function (item1, buf2) {
	/*
	var buf = new Buffer(1 + buf2.length);
	buf[0] = item1;
	buf2.copy(buf, 1);
	return buf;
	*/

	// xdjiang 修改于2017-09-29 改用bops进行buffer管理 
	var buf = binary.create(1 + buf2.length);
	buf[0] = item1;
	binary.copy(buf2, buf, 1, 0, buf2.length);
	return buf;
};
/**
 * concat one buffer and another
 * @param {buffer} item1, should be an integer
 * @param {buffer} buf2, a buffer
 * @returns {buffer} new Buffer
 */
KeyPairs.prototype.__bufCat1 = function (buf1, buf2) {
	/*
	var buf = new Buffer(buf1.length + buf2.length);
	buf1.copy(buf);
	buf2.copy(buf, buf1.length);
	return buf;
	*/
	// xdjiang 修改于2017-09-29 改用bops进行buffer管理
	var buf = binary.create(buf1.length + buf2.length);
	binary.copy(buf1, buf);
	binary.copy(buf2, buf, buf1.length, 0, buf2.length);
	return buf;
};

/**
 * encode use jingtum base58 encoding
 * including version + data + checksum
 * @param {integer} version
 * @param {buffer} bytes
 * @returns {string}
 * @private
 */
KeyPairs.prototype.__encode = function (version, bytes) {
	var buffer = this.__bufCat0(version, bytes);
	var checksum = new Buffer(sha256(sha256(buffer)).slice(0, 4));
	var ret = this.__bufCat1(buffer, checksum);
	return this._base58.encode(ret);
};
/**
 * decode encoded input,
 * 	too small or invalid checksum will throw exception
 * @param {integer} version
 * @param {string} input
 * @returns {buffer}
 * @private
 */
KeyPairs.prototype.__decode = function (version, input) {
	var bytes = this._base58.decode(input);
	if (!bytes || bytes[0] !== version || bytes.length < 5) {
		throw new Error('invalid input size');
	}
	var computed = sha256(sha256(bytes.slice(0, -4))).slice(0, 4);
	var checksum = bytes.slice(-4);
	for (var i = 0; i !== 4; i += 1) {
		if (computed[i] !== checksum[i])
			throw new Error('invalid checksum');
	}
	return bytes.slice(1, -4);
};

/**
 * generate random bytes and encode it to secret
 * @returns {string}
 */
KeyPairs.prototype.generateSeed = function() {
	var randBytes = brorand(16);
	return this.__encode(this._SEED_PREFIX, randBytes);
};

/**
 * generate privatekey from input seed
 * one seed can generate many keypairs,
 * here just use the first one
 * @param {buffer} seed
 * @returns {buffer}
 */
KeyPairs.prototype.__derivePrivateKey = function (seed) {
  var order = ec.curve.n;
  var privateGen = secp256k1.ScalarMultiple(seed);
  var publicGen = ec.g.mul(privateGen);
  return secp256k1.ScalarMultiple(publicGen.encodeCompressed(), 0).add(privateGen).mod(order);
};

/**
 * derive keypair from secret
 * @param {string} secret
 * @returns {{privateKey: string, publicKey: *}}
 */
KeyPairs.prototype.deriveKeyPair = function(secret) {
	var prefix = '00';
	var entropy = this.__decode(this._SEED_PREFIX, secret);
	var entropy = this._base58.decode(secret).slice(1, -4);
	var privateKey = prefix + this.__derivePrivateKey(entropy).toString(16, 64).toUpperCase();
	var publicKey = bytesToHex(ec.keyFromPrivate(privateKey.slice(2)).getPublic().encodeCompressed());
	return { privateKey: privateKey, publicKey: publicKey };
};

/**
 * devive keypair from privatekey
 */
KeyPairs.prototype.deriveKeyPairWithKey = function(key) {
	var privateKey = key;
	var publicKey = bytesToHex(ec.keyFromPrivate(key).getPublic().encodeCompressed());
	return { privateKey: privateKey, publicKey: publicKey };
};


/**
 * derive wallet address from publickey
 * @param {string} publicKey
 * @returns {string}
 */
KeyPairs.prototype.deriveAddress = function(publicKey) {
	var bytes = hexToBytes(publicKey);
	var hash256 = sha256(bytes);
	var input = new Buffer(hashjs.ripemd160().update(hash256).digest());
	return this.__encode(this._ACCOUNT_PREFIX, input);
};

/**
 * check is address is valid
 * @param address
 * @returns {boolean}
 */
KeyPairs.prototype.checkAddress = function(address) {
	try {
		this.__decode(this._ACCOUNT_PREFIX, address);
		return true;
	} catch (err) {
		return false;
	}
};

module.exports = KeyPairs;
