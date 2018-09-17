'use strict';

const brorand = require('brorand');
const hashjs = require('hash.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const secp256k1 = require('./secp256k1');
const hexToBytes = require('./utils').hexToBytes;
const bytesToHex = require('./utils').bytesToHex;
const binary = require('bops');
const walletConfig = require('./wallet_config');
const baseX = require('base-x');

const sha256 = (bytes) => {
	return hashjs.sha256().update(bytes).digest();
}

/**
 * concat an item and a buffer
 * @param {integer} item1, should be an integer
 * @param {buffer} buf2, a buffer
 * @returns {buffer} new Buffer
 */
const _bufCat0 = (item1, buf2) => {
	let buf = binary.create(1 + buf2.length);
	buf[0] = item1;
	binary.copy(buf2, buf, 1, 0, buf2.length);
	return buf;
};

/**
 * concat one buffer and another
 * @param {buffer} buf1, a buffer
 * @param {buffer} buf2, a buffer
 * @returns {buffer} new Buffer
 */
const _bufCat1 = (buf1, buf2) => {
	let buf = binary.create(buf1.length + buf2.length);
	binary.copy(buf1, buf);
	binary.copy(buf2, buf, buf1.length, 0, buf2.length);
	return buf;
};

/**
 * generate privatekey from input seed
 * one seed can generate many keypairs,
 * here just use the first one
 * @param {buffer} seed
 * @returns {buffer}
 */
const derivePrivateKey = (seed) => {
	let order = ec.curve.n;
	let privateGen = secp256k1.ScalarMultiple(seed);
	let publicGen = ec.g.mul(privateGen);
	return secp256k1.ScalarMultiple(publicGen.encodeCompressed(), 0).add(privateGen).mod(order);
};

/**
 * account stub for subscribe accounts transaction event
 * can be used for many accounts
 * @param {string} token
 * @constructor
 */
class KeyPairs {
	constructor(token = 'swt') {
		let config = walletConfig.find(config => {
			return config.currency.toLowerCase() === token.toLowerCase()
		})
		if (!config) {
			throw new Error(`config of ${token} is empty`);
		}
		this._SEED_PREFIX = config.SEED_PREFIX;
		this._ACCOUNT_PREFIX = config.ACCOUNT_PREFIX;
		this._base58 = baseX(config.ACCOUNT_ALPHABET);
	}

	/**
	 * encode use jingtum base58 encoding
	 * including version + data + checksum
	 * @param {integer} version
	 * @param {buffer} bytes
	 * @returns {string}
	 * @private
	 */
	_encode(version, bytes) {
		let buffer = _bufCat0(version, bytes);
		let checksum = Buffer.from(sha256(sha256(buffer)).slice(0, 4));
		let ret = _bufCat1(buffer, checksum);
		return this._base58.encode(ret);
	};

	/**
	 * decode encoded input
	 * 	too small or invalid checksum will throw exception
	 * @param {integer} version
	 * @param {string} input
	 * @returns {buffer}
	 * @private
	 */
	_decode(version, input) {
		let bytes = this._base58.decode(input);
		if (!bytes || bytes[0] !== version || bytes.length < 5) {
			throw new Error('invalid input size');
		}
		let computed = sha256(sha256(bytes.slice(0, -4))).slice(0, 4);
		let checksum = bytes.slice(-4);
		for (let i = 0; i !== 4; i += 1) {
			if (computed[i] !== checksum[i]) throw new Error('invalid checksum');
		}
		return bytes.slice(1, -4);
	};

	/**
	 * generate random bytes and encode it to secret
	 * @returns {string}
	 */
	generateSeed() {
		let randBytes = brorand(16);
		return this._encode(this._SEED_PREFIX, randBytes);
	};

	/**
	 * derive keypair from secret
	 * @param {string} secret
	 * @returns {{privateKey: string, publicKey: *}}
	 */
	deriveKeyPair(secret) {
		let prefix = '00';
		let entropy = this._decode(this._SEED_PREFIX, secret);
		let privateKey = prefix + derivePrivateKey(entropy).toString(16, 64).toUpperCase();
		let publicKey = bytesToHex(ec.keyFromPrivate(privateKey.slice(2)).getPublic().encodeCompressed());
		return {
			privateKey: privateKey,
			publicKey: publicKey
		};
	};

	/**
	 * derive wallet address from publickey
	 * @param {string} publicKey
	 * @returns {string}
	 */
	deriveAddress(publicKey) {
		let bytes = hexToBytes(publicKey);
		let hash256 = sha256(bytes);
		let input = Buffer.from(hashjs.ripemd160().update(hash256).digest());
		return this._encode(this._ACCOUNT_PREFIX, input);
	};

	/**
	 * check is address is valid
	 * @param address
	 * @returns {boolean}
	 */
	checkAddress(address) {
		try {
			this._decode(this._ACCOUNT_PREFIX, address);
			return true;
		} catch (err) {
			return false;
		}
	};

	/**
	 * convert the input address to byte array
	 * @param address
	 * @returns byte array
	 */
	convertAddressToBytes(address) {
		try {
			return this._decode(this._ACCOUNT_PREFIX, address);
		} catch (err) {
			throw new Error('convert address to bytes in error');
		}
	};

	/*
	 * Convert a byte array to a wallet address string
	 */
	convertBytesToAddress(bytes) {
		try {
			return this._encode(this._ACCOUNT_PREFIX, bytes);
		} catch (err) {
			throw new Error('convert bytes to address in error');
		}
	};

	// /**
	//  * devive keypair from privatekey
	//  */
	// deriveKeyPairWithKey(key) {
	// 	var privateKey = key;
	// 	var publicKey = bytesToHex(ec.keyFromPrivate(key).getPublic().encodeCompressed());
	// 	return {
	// 		privateKey: privateKey,
	// 		publicKey: publicKey
	// 	};
	// };
}

module.exports = KeyPairs;