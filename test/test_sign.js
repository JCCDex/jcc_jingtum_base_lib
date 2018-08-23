var Wallet = require('../src/wallet');

  var wt = new Wallet('saai2npGJD7GKh9xLxARfZXkkc8Bf');
  var pubkey = wt.getPublicKey();


  // Sign message can be an array or a hex string
  var sdata = "F95EFF5A4127E68D2D86F9847D9B6DE5C679EE7D9F3241EC8EC67F99C4CDA923";

  var sign =wt.signTx(sdata);

  // Signature MUST be either:
  // 1) hex-string of DER-encoded signature; or
  // 2) DER-encoded signature as buffer; or
  // 3) object with two hex-string properties (r and s)
  // Verify the signature 
  if ( wt.verifyTx(sdata, sign) == true)
  {
    console.log("Verify sjcl signature successfully!");
  }else
    console.log("Cannot verify sjcl sig");