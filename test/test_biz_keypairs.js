const Keypairs = require('../src/keypairs');
const expect = require('chai').expect;

let VALID_ADDRESS = 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q';

describe('test keypairs', function () {

    describe('convertAddressToBytes and convertBytesToAddress', function () {
        it('convert address to bytes successfully', function () {
            let inst = new Keypairs('bwt');
            let bytes = inst.convertAddressToBytes(VALID_ADDRESS);
            let address = inst.convertBytesToAddress(Buffer.from(bytes));
            expect(address).to.equal(VALID_ADDRESS)
        })

        it('convertAddressToBytes in error', function () {
            let inst = new Keypairs('bwt');
            expect(() => inst.convertAddressToBytes(undefined)).throw('convert address to bytes in error')
        })

        it('convertBytesToAddress in error', function () {
            let inst = new Keypairs('bwt');
            expect(() => inst.convertBytesToAddress('')).throw('convert bytes to address in error')
        })
    })
})