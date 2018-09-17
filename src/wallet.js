'use strict';

var KeyPairs = require('./keypairs');
var elliptic = require('elliptic');
var ec = elliptic.ec('secp256k1');
var hexToBytes = require('./utils').hexToBytes;
var bytesToHex = require('./utils').bytesToHex;
var hashjs = require('hash.js');

var Wallet = function (secret, currency) {
	this._currency = currency || 'SWT';
	this._kp = new KeyPairs(this._currency);
	try {
		this._keypairs = this._kp.deriveKeyPair(secret);
		this._secret = secret;
	} catch (err) {
		this._keypairs = null;
		this._secret = null;
	}
};

/**
 * static funcion
 * generate one wallet
 * @returns {{secret: string, address: string}}
 */
Wallet.generate = function (currency) {
	var _currency = currency || 'SWT';
	var kp = new KeyPairs(_currency);
	var secret = kp.generateSeed();
	var keypair = kp.deriveKeyPair(secret);
	var address = kp.deriveAddress(keypair.publicKey);
	return {
		secret: secret,
		address: address
	};
};

/**
 * static function
 * generate one wallet from secret
 * @param secret
 * @returns {*}
 */
Wallet.fromSecret = function (secret, currency) {
	var _currency = currency || 'SWT';
	var kp = new KeyPairs(_currency);
	try {
		var keypair = kp.deriveKeyPair(secret);
		var address = kp.deriveAddress(keypair.publicKey);
		return {
			secret: secret,
			address: address
		};
	} catch (err) {
		return null;
	}
};

/**
 * static function
 * check if address is valid
 * @param address
 * @returns {boolean}
 */
Wallet.isValidAddress = function (address, currency) {
	var _currency = currency || 'SWT';
	var kp = new KeyPairs(_currency);
	return kp.checkAddress(address);
};

/**
 * static function
 * check if secret is valid
 * @param secret
 * @returns {boolean}
 */
Wallet.isValidSecret = function (secret, currency) {
	var _currency = currency || 'SWT';
	var kp = new KeyPairs(_currency);
	try {
		kp.deriveKeyPair(secret);
		return true;
	} catch (err) {
		return false;
	}
};

function hash(message) {
	return hashjs.sha512().update(message).digest().slice(0, 32);
}

/**
 * sign message with wallet privatekey
 * @param message
 * @returns {*}
 */
Wallet.prototype.sign = function (message) {
	if (!message || message.length === 0) return null;
	if (!this._keypairs) return null;
	var privateKey = this._keypairs.privateKey;

	// Export DER encoded signature in Array
	return bytesToHex(ec.sign(hash(message), hexToBytes(privateKey), {
		canonical: true
	}).toDER());
};

/**
 * verify signature with wallet publickey
 * @param message
 * @param signature
 * @returns {*}
 */
Wallet.prototype.verify = function (message, signature) {
	if (!this._keypairs) return null;
	var publicKey = this._keypairs.publicKey;
	return ec.verify(hash(message), signature, hexToBytes(publicKey));
};

/**
 * get wallet address
 * @returns {*}
 */
Wallet.prototype.address = function () {
	if (!this._keypairs) return null;
	var address = this._kp.deriveAddress(this._keypairs.publicKey);
	return address;
};

/**
 * get wallet secret
 * @returns {*}
 */
Wallet.prototype.secret = function () {
	if (!this._keypairs) return null;
	return this._secret;
};

Wallet.prototype.toJson = function () {
	if (!this._keypairs) return null;
	return {
		secret: secret(),
		address: address()
	};
};

/*
 * Get the public key from key pair
 * used for local signing operation.
 */
Wallet.prototype.getPublicKey = function () {
	if (!this._keypairs) return null;
	return this._keypairs.publicKey;
};

/**
 * sign message with wallet privatekey
 * Export DER encoded signature in Array
 * Used for 
 * @param message
 * @returns {*}
 */
Wallet.prototype.signTx = function (message) {
	if (!message || message.length === 0) return null;
	if (!this._keypairs) return null;
	var privateKey = this._keypairs.privateKey;

	// Export DER encoded signature in Array
	return bytesToHex(ec.sign(message, hexToBytes(privateKey), {
		canonical: true
	}).toDER());
};

/**
 * verify signature with wallet publickey
 * @param message
 * @param signature
 * @returns {*}
 */
Wallet.prototype.verifyTx = function (message, signature) {
	if (!this._keypairs) return null;
	var publicKey = this._keypairs.publicKey;
	return ec.verify(message, signature, hexToBytes(publicKey));
};
module.exports = Wallet;