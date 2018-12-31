<!-- markdownlint-disable MD024 -->

# The Jingtum Base JavaScript Library

![npm](https://img.shields.io/npm/v/jcc_jingtum_base_lib.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc_jingtum_base_lib.svg?branch=master)](https://travis-ci.com/JCCDex/jcc_jingtum_base_lib)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc_jingtum_base_lib/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc_jingtum_base_lib?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/jcc_jingtum_base_lib.svg)](http://npm-stat.com/charts.html?package=jcc_jingtum_base_lib)

## Preface
原始代码来自[jingtum-base-lib](https://www.npmjs.com/package/jingtum-base-lib)，在此基础上[JCCDex团队](https://github.com/JCCDex)做以下增强

The team [JCCDex](https://github.com/JCCDex) made the following enhancements to the code from jingtum
* 支持浏览器 Support running in browsers 
* 支持所有的井通联盟链 Support all jingtum alliance chains

井畅应用交流群: 557524730

JCCDex Tech support QQ group ID: 557524730

## Installtion

```shell
npm install jcc_jingtum_base_lib
```

## API Of Wallet

### Usage

```javascript
const Wallet = require('jcc_jingtum_base_lib').Wallet
// import { Wallet } from 'jcc_jingtum_base_lib'
```

### Constructor

```javascript
let inst = new Wallet(secret, token)
```

Parameters

`secret`- `string`

`token`- `string`

- `swt（jingtum chain）`- `default`

- `bwt（bizain chain）`

bwt是商链的原生币，也是燃料币，商链是井通链的联盟链，如果添加新的联盟链，需要在 src/wallet_config.js 添加新的联盟链定义即可，如果需要我们增加请联系我们。

BWT is the native token and gas token of BIZAIN. BIZAIN is the alliance chain of jingtum. If you add a new alliance chain, you need to add a new definition of the alliance chain in src/wallet_config.js. 

If you need to add it in this package, please contact us.

### generate

generate one wallet

```javascript
Wallet.generate(token)
```

Parameters

`token`- `string`

- `swt（jingtum chain）`- `default`

- `bwt（bizain chain）`

Return

{ secret: '', address: '' }

### fromSecret

generate one wallet from secret

```javascript
Wallet.fromSecret(secret, token)
```

Parameters

`secret`- `string`

`token`- `string`

- `swt（jingtum chain）`- `default`

- `bwt（bizain chain）`

Return

return { secret: '', address: '' } if the given secret is valid, otherwise return null.

### isValidAddress

```javascript
Wallet.isValidAddress(address, token)
```

Parameters

`address`- `string`

`token`- `string`

- `swt（jingtum chain）`- `default`

- `bwt（bizain chain）`

Return

return true if the given address is valid, otherwise return false.

### isValidSecret

```javascript
Wallet.isValidSecret(secret, token)
```

Parameters

`secret`- `string`

`token`- `string`

- `swt（jingtum chain）`- `default`

- `bwt（bizain chain）`

Return

return true if the given secret is valid, otherwise return false.

### getPublicKey

get the public key from keypair, used for local opearation of signing.

```javascript
inst.getPublicKey()
```

Return

return public key if successfully, otherwise return null.

### signTx

sign message with wallet private key.

```javascript
inst.signTx(message)
```

Parameters

`message`- `string`

Return

return encoded signature data if successfully, otherwise return null.

### verifyTx

verify signature data with wallet public key.

```javascript
inst.verifyTx(message, signature)
```

Parameters

`message`- `string`

`signature`- `string`

Return

return boolean if successfully, otherwise return null.

## API Of Keypair

### Usage

```javascript
const KeyPair = require('jcc_jingtum_base_lib').KeyPair
// import { KeyPair } from 'jcc_jingtum_base_lib'
```

### Constructor

```javascript
let inst = new KeyPair(token)
```

Parameters

`token`- `string`

- `swt（jingtum chain）`- `default`

- `bwt（bizain chain）`

### convertAddressToBytes

convert the given address to byte array

```javascript
inst.convertAddressToBytes(address)
```

Parameters

`address`- `string`

Return

return byte array if successfully, otherwise throw error.

### convertBytesToAddress

convert the byte array to wallet address

```javascript
inst.convertBytesToAddress(buffer)
```

Parameters

`buffer`- `Buffer`

Return

return address if successfully, otherwise throw error.
