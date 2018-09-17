var Wallet = require('../src/wallet');
var expect = require('chai').expect;

var VALID_SECRET = 'ssySqG4BhxpngV2FjAe1SJYFD4dcm';
var INVALID_SECRET1 = null;
var INVALID_SECRET2 = undefined;
var INVALID_SECRET3 = '';
var INVALID_SECRET4 = 'xxxx';
var INVALID_SECRET5 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var INVALID_SECRET6 = 'ssySqG4BhxpngV2FjAe1SJYFD4dcmxx';
var INVALID_SECRET7 = 'zWqvtbDzzMQEVWqGDSA5DbMYDBN';
var INVALID_SECRET8 = 'ssySqG4BhxpngV2FjAe1SJYFD4dcmssySqG4BhxpngV2FjAe1SJYFD4dcm';

var VALID_ADDRESS = 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q';
var INVALID_ADDRESS1 = null;
var INVALID_ADDRESS2 = undefined;
var INVALID_ADDRESS3 = '';
var INVALID_ADDRESS4 = 'xxxx';
var INVALID_ADDRESS5 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var INVALID_ADDRESS6 = 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Qxxx';
var INVALID_ADDRESS7 = 'ahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV';
var INVALID_ADDRESS8 = 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16QbMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q';

var MESSAGE1 = "hello";
var SIGNATURE1 = "3045022100C016C3D333287F86C1FC1488A0177D2F58DC979507EAFE03D852415F17584BA7022042D3D55270BB74B012B7CE2DC0E2EC8B755F9547BA0901BB2FED6AC4A75523DA";
var MESSAGE2 = null;
var MESSAGE3 = undefined;
var MESSAGE4 = '';
var MESSAGE5 = '';
for (var i = 0; i < 1000; ++i) {
	MESSAGE5 = MESSAGE5 + 'x';
}
var SIGNATURE5 = '304402203994192A21C9B78952F3F0CF27BA4428844B0052917304BA64F755E46F03E3ED022041FFA4132274F6F584C6484C5EEAEB9A7447AC4A1B96360CF5592766AE9F60CD';

describe('Wallet', function () {

	describe('generate', function () {
		it('should generate one wallet', function () {
			var wallet = Wallet.generate('bwt');
			console.log(wallet)
			expect(wallet.address).to.not.be.null;
			expect(wallet.secret).to.not.be.null;
		});
	});

	describe('fromSecret', function () {
		it('should generate one from secret', function () {
			var wallet = Wallet.fromSecret(VALID_SECRET, 'bwt');
			expect(wallet).to.not.be.null;
		});

		it('should fail when null secret', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET1, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when undefined secret', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET2, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when empty secret', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET3, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when too short secret', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET4, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when too long secret', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET5, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when tail string', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET6, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when not start with s', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET7, 'bwt');
			expect(wallet).to.be.null;
		});

		it('should fail when double secret', function () {
			var wallet = Wallet.fromSecret(INVALID_SECRET8, 'bwt');
			expect(wallet).to.be.null;
		});
	});

	describe('isValidSecret', function () {
		it('should generate one from secret', function () {
			var ret = Wallet.isValidSecret(VALID_SECRET, 'bwt');
			expect(ret).to.be.equal.true;
		});

		it('should fail when null secret', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET1, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when undefined secret', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET2, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when empty secret', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET3, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when too short secret', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET4, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when too long secret', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET5, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when tail string', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET6, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when not start with s', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET7, 'bwt');
			expect(ret).to.be.equal.false;
		});

		it('should fail when double secret', function () {
			var ret = Wallet.isValidSecret(INVALID_SECRET8, 'bwt');
			expect(ret).to.be.equal.false;
		});
	});

	describe('isValidAddress', function () {
		it('should success when valid address', function () {
			var ret = Wallet.isValidAddress(VALID_ADDRESS, 'bwt');
			expect(ret).to.be.true;
		});

		it('should fail when null address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS1, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when undefined address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS2, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when empty address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS3, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when too short address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS4, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when too long address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS5, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when tail string address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS6, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when not start with j', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS7, 'bwt');
			expect(ret).to.be.false;
		});

		it('should fail when double address', function () {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS8, 'bwt');
			expect(ret).to.be.false;
		});
	});

	describe('init', function () {
		it('init with valid secret', function () {
			var wallet = new Wallet(VALID_SECRET, 'bwt');
			expect(wallet.secret()).to.be.equal(VALID_SECRET);
		});
		it('init with null secret', function () {
			var wallet = new Wallet(INVALID_SECRET1, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with undefined secret', function () {
			var wallet = new Wallet(INVALID_SECRET2, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with empty secret', function () {
			var wallet = new Wallet(INVALID_SECRET3, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with too short secret', function () {
			var wallet = new Wallet(INVALID_SECRET4, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with too long secret', function () {
			var wallet = new Wallet(INVALID_SECRET5, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with tail string secret', function () {
			var wallet = new Wallet(INVALID_SECRET6, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with secret without start s', function () {
			var wallet = new Wallet(INVALID_SECRET7, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with double secret', function () {
			var wallet = new Wallet(INVALID_SECRET8, 'bwt');
			expect(wallet.secret()).to.be.equal(null);
		});
	});

	describe('sign', function () {
		it('sign with normal message', function () {
			var wallet = new Wallet(VALID_SECRET, 'bwt');
			expect(wallet.sign(MESSAGE1)).to.be.equal(SIGNATURE1);
		});
		it('sign with null', function () {
			var wallet = new Wallet(VALID_SECRET, 'bwt');
			expect(wallet.sign(MESSAGE2)).to.be.equal(null);
		});
		it('sign with undefined', function () {
			var wallet = new Wallet(VALID_SECRET, 'bwt');
			expect(wallet.sign(MESSAGE3)).to.be.equal(null);
		});
		it('sign with empty message', function () {
			var wallet = new Wallet(VALID_SECRET, 'bwt');
			expect(wallet.sign(MESSAGE4)).to.be.equal(null);
		});
		it('sign with long message', function () {
			var wallet = new Wallet(VALID_SECRET, 'bwt');
			expect(wallet.sign(MESSAGE5)).to.be.equal(SIGNATURE5);
		});

		it('sign with invalid secret', function () {
			var wallet = new Wallet(INVALID_SECRET1, 'bwt');
			expect(wallet.sign(MESSAGE5)).to.be.equal(null);
		})
	});

	describe('verifyTx and signTx', function () {
		it('verify the signature successfully', function () {
			let sdata = "F95EFF5A4127E68D2D86F9847D9B6DE5C679EE7D9F3241EC8EC67F99C4CDA923";
			let wt = new Wallet(VALID_SECRET, 'bwt');
			let sign = wt.signTx(sdata);
			let verified = wt.verifyTx(sdata, sign)
			expect(verified).to.equal(true);
		})

		it('verify with invalid secret', function () {
			let sdata = "F95EFF5A4127E68D2D86F9847D9B6DE5C679EE7D9F3241EC8EC67F99C4CDA923";
			let wt = new Wallet(INVALID_SECRET1, 'bwt');
			let sign = '';
			let verified = wt.verifyTx(sdata, sign)
			expect(verified).to.equal(null);
		})

		it('sign with invalid secret', function () {
			let sdata = "F95EFF5A4127E68D2D86F9847D9B6DE5C679EE7D9F3241EC8EC67F99C4CDA923";
			let wt = new Wallet(INVALID_SECRET1, 'bwt');
			let sign = wt.signTx(sdata);
			expect(sign).to.equal(null);
		})

		it('sign with invalid message', function () {
			let sdata = "";
			let wt = new Wallet(VALID_SECRET, 'bwt');
			let sign = wt.signTx(sdata);
			expect(sign).to.equal(null);
		})
	})

	describe('toJson', function () {
		it('return address and secret successfully', function () {
			let wt = new Wallet(VALID_SECRET, 'bwt');
			expect(wt.toJson()).to.deep.equal({
				address: VALID_ADDRESS,
				secret: VALID_SECRET
			})
		})

		it('return null if the secret is invalid', function () {
			let wt = new Wallet(INVALID_SECRET1, 'bwt');
			expect(wt.toJson()).to.equal(null)
		})
	})

	describe('address', function () {

		it('return null if the secret is invalid', function () {
			let wt = new Wallet(INVALID_SECRET1, 'bwt');
			expect(wt.address()).to.equal(null)
		})
	})

	describe('getPublicKey', function () {
		it('return null if the secret is invalid', function () {
			let wt = new Wallet(INVALID_SECRET1, 'bwt');
			expect(wt.getPublicKey()).to.equal(null)
		})
	})
});