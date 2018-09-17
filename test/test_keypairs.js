const Keypairs = require('../src/keypairs');
const expect = require('chai').expect;

let VALID_ADDRESS = 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV';

describe('test keypairs', function () {

    describe('create instance', function () {
        it('throw error if the config of given token is empty', function () {
            try {
                new Keypairs('moac')
            } catch (error) {
                expect(error.message).to.equal('config of moac is empty')
            }
        })
    })

    describe('convertAddressToBytes and convertBytesToAddress', function () {
        it('convert address to bytes successfully', function () {
            let inst = new Keypairs();
            let bytes = inst.convertAddressToBytes(VALID_ADDRESS);
            let address = inst.convertBytesToAddress(Buffer.from(bytes));
            expect(address).to.equal(VALID_ADDRESS)
        })

        it('convertAddressToBytes in error', function () {
            let inst = new Keypairs();
            try {
                inst.convertAddressToBytes(undefined);
            } catch (error) {
                expect(error.message).to.equal('convert address to bytes in error')
            }
        })

        it('convertBytesToAddress in error', function () {
            let inst = new Keypairs();
            try {
                inst.convertBytesToAddress('');
            } catch (error) {
                expect(error.message).to.equal('convert bytes to address in error')
            }
        })
    })
})