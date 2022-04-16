/*
 * @licstart
 *                    X.O.W.S - XMPP Over WebSocket
 *                        v0.9.0 - (Jan. 2021)
 *                          ____       ____
 *                          \   \     /   /
 *                           \    \_/    /
 *                      .   .-           -.   .
 *                     /|  /   -.     .-   \  |\
 *                    | \_/  |___\   /___|  \_/ |
 *                    .                         .
 *                     \.__       ___       __./
 *                         /     /   \     \ 
 *                        /_____/     \_____\
 *         
 *                 Copyright (c) 2020 - 2021 Eric M.
 * 
 *     This file is part of X.O.W.S (XMPP Over WebSocket Library).
 * 
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 * 
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source
 * 
 * @licend
 */
 
"use strict";

/* ------------------------------------------------------------------
 * 
 *                            Base API
 * 
 * ------------------------------------------------------------------ */

/* --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  
 *       Applications constants and common utilities fonctions 
 * --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  -- */
 
/**
 * Global application (client) constants
 */
const XOWS_APP_NAME = "Xows";
const XOWS_APP_VERS = "0.9.0";
const XOWS_APP_NODE = "https://github.com/sedenion/xows";

/**
 * Xows Logo SVG path
 */
const XOWS_LOGO_SVG = new Path2D("M8.282 6.527l2.514 3.942c-2.33 1.463-3.431 3.529-4.134 5.785-2.326.221-1.5-4.322-1.659-5.373 0 0-2.945 5.92-.822 7.584 1.518 1.19 4.09 1.651 4.09 1.651l-3.268 4.146c2.224.748 7.17.825 7.17.825l2.837-4.416h2.054l2.837 4.417s4.946-.078 7.17-.826l-3.268-4.146s2.558-.477 4.09-1.651c1.964-1.506-.822-7.584-.822-7.584-.159 1.051.667 5.594-1.66 5.373-.701-2.257-1.803-4.322-4.134-5.785l2.514-3.942c-.98-1.003-2.247-1.753-3.34-1.576l-3.786 4.692h-1.257L11.622 4.95c-1.091-.177-2.358.573-3.34 1.576zm4.104 6.495c.63 1.175 1.797 3.073 1.797 3.073s-1.005.029-1.95.029c-.944 0-1.598-.05-1.598-.754s.322-2.348 1.75-2.348zm7.264 0c1.449 0 1.75 1.644 1.75 2.348 0 .705-.596.754-1.598.754a74.34 74.34 0 01-1.95-.029S19 14.197 19.65 13.022z");

/**
 * Check whether the the given value matches the specified bitmask.
 *  
 * @param   {number}  value   Value to check bits.
 * @param   {number}  mask    Mask to test bits in value.
 * 
 * @return  {boolean} true if mask matches value, false otherwise
 */
function xows_has_bits(value, mask)
{
  return ((value & mask) === mask);
}
 
/**
 * Check whether an object is a valid JavaScript function.
 *  
 * @param   {object}  obj     Object or variable to check.
 * 
 * @return  {boolean} True if object is a function, false otherwise.
 */
function xows_is_func(obj) {
  return (obj && obj.constructor && obj.call && obj.apply);
}

/**
 * Pseudo-random, seed based, number generation using the
 * Mulberry32 PRNG algorithm.
 * 
 * @param   {number}  seed   Seed to generate number.
 * 
 * @return  {number}  Pseudo-random number between 0.0 and 1.0
 */
function xows_random(seed) 
{
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

/**
 * Global signal or log level
 */
const XOWS_SIG_ERR = 0;
const XOWS_SIG_WRN = 1;
const XOWS_SIG_LOG = 2;

/**
 * Output formated log string to javascript console.
 *  
 * @param   {number}  level       Verbose level.
 * @param   {string}  scope       Message origin, scope or context.
 * @param   {string}  message     Main content or title.
 * @param   {string}  [details]   Additional details.
 * @param   {string}  [color]     Color to apply to content.
 */
function xows_log(level, scope, message, details, color)
{
  if(level <= xows_options.verbose) {
    
    let style, body = "";
    
    if(level > 1 && color) { 
      body += "%c";
      style = "color:"+color;
    }
    
    body += message;
    if(details) body += ": " + details;
    
    const output = scope + ": " + body;
    
    // Output log to console
    switch(level)  {
    case 0: 
      console.warn(output); 
      break;
    case 1: 
      console.warn(output); 
      break;
    default: 
      if(style) {
        console.log(output, style); 
      } else {
        console.log(output); 
      }
      break;
    }
  }
}

/* --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  
 *          low-level strings and bytes conversion functions
 * --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  -- */

/**
 * Character map for bytes to hexadecimal string conversions.
 */
const XOWS_CMAP_HEX = "0123456789abcdef";

/**
 * Character map for bytes to Base-64 conversions.
 */
const XOWS_CMAP_B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Get numerical UTF-8 equivalent of the given UTF-16 DOMString. 
 * 
 * The resulting DOMstring is not printable as unicode (since DOMString 
 * is anyway parsed as UTF-16) but is numerically valid and can be 
 * safely transposed char by char into an Uint8Array.
 * 
 * @param   {string}  str     DOMString (UTF-16) to encode.
 * 
 * @return  {string}  New DOMString with UTF-8 values as characters.
 */
function xows_str_to_utf8(str)
{
  let c, u, utf8 = "";
  for(let i = 0, n = str.length; i < n; ++i) {
    c = str.charCodeAt(i);
    if(c < 0x80) {
      utf8 += str.charAt(i);
    } else if(c < 0x800) {
      utf8 += String.fromCharCode(0xC0|(c>> 6), 
                                  0x80|(c&0x3F));                  
    } else if(c < 0xD800 || c >= 0xE000) {
      utf8 += String.fromCharCode(0xE0|(c>>12), 
                                  0x80|((c>>6)&0x3F), 
                                  0x80|(c&0x3F));                  
    } else { // surrogate pair
      ++i; u = str.charCodeAt(i); //< step and get the next char
      c = 0x10000 + (((c & 0x3FF) << 10) | (u & 0x3FF));
      utf8 += String.fromCharCode(0xF0|(c>>18), 
                                  0x80|((c>>12)&0x3F), 
                                  0x80|((c>>6)&0x3F), 
                                  0x80|(c&0x3F));
    }
  }
  return utf8;
}

/**
 * Get the length in bytes of the given UTF-16 DOMstring as encoded 
 * to its UTF-8 equivalent.
 * 
 * @param   {string}  str     DOMString (UTF-16) to compute length.
 * 
 * @return  {string}  Encoded UTF-8 equivalent length in bytes.
 */
function xows_str_bytes_len(str)
{
  let c, len = 0;
  for(let i = 0, n = str.length; i < n; ++i) {
    c = str.charCodeAt(i);
    if(c < 0x80) { len++; } 
    else if(c < 0x800) { len += 2; } 
    else if(c < 0xD800 || c >= 0xE000) { len += 3; } 
    else { ++i; len += 4; }
  }
  return len;
}

/**
 * Get the UTF-8 encoded equivalent of UTF-16 DOMString as Uint8Array.
 * 
 * If len parameter is defined, the function returns an Uint8Array of 
 * the specified length instead of the required to store data.
 * 
 * @param   {string}  str     Input string to encode.
 * @param   {number}  len     Optional length of the returned Uint8Array.
 * 
 * @return  {Uint8Array} UTF-8 encoded string as Uint8Array
 */
function xows_str_to_bytes(str, len)
{ 
  let c, u;
  const uint8 = new Uint8Array(len ? len : xows_str_bytes_len(str));
  for(let i = 0, p = 0, n = str.length; i < n; ++i) {
    c = str.charCodeAt(i); 
    if(c < 0x80) {
      uint8[p++] = c;
    } else if(c < 0x800) {
      uint8[p++] = 0xC0|(c>>6); 
      uint8[p++] = 0x80|(c&0x3F);
    } else if(c < 0xD800 || c >= 0xE000) {
      uint8[p++] = 0xE0|(c>>12); 
      uint8[p++] = 0x80|((c>>6)&0x3F);
      uint8[p++] = 0x80|(c&0x3F);
    } else { // surrogate pair
      ++i; u = str.charCodeAt(i); //< step and get the next char
      c = 0x10000+(((c&0x3FF)<<10)|(u&0x3FF));
      uint8[p++] = 0xF0|(c>>18); 
      uint8[p++] = 0x80|((c>>12)&0x3F);
      uint8[p++] = 0x80|((c>> 6)&0x3F); 
      uint8[p++] = 0x80|(c&0x3F);
    }
  }
  return uint8;
}

/**
 * Convert bytes values to a string of the same length
 * with same values but as ASCII characters.
 * 
 * @param   {Uint8Array}  uint8   Input bytes data.
 * 
 * @return  {string} Resulting DOMString object.
 */
function xows_bytes_to_str(uint8) 
{
  // This is way faster, but does'nt work with large buffers due to
  // max argument count implementation limit. If needed use the 
  // alternate implementation commented below
  return String.fromCharCode.apply(null, uint8);
  /*
  let str = "";
  for(let i = 0, n = uint8.length; i < n; ++i) 
    str += String.fromCharCode(uint8[i]);
  return str;
  */
}

/**
 * Encodes bytes data to base64.
 * 
 * @param   {Uint8Array}  uint8   Input bytes data.
 * 
 * @return  {string} Resulting base64 string.
 */
function xows_bytes_to_b64(uint8) 
{
  const len = uint8.length, rem = len % 3;  //< remaining bytes after per-triplet division
  let p, n, t, b64 = "";
  // main block, per triplets
  for(p = 0, n = len - rem; p < n; ) {  
    t = (uint8[p++] << 16) | (uint8[p++] << 8) | uint8[p++];
    b64 += XOWS_CMAP_B64[0x3F & (t >> 18)];
    b64 += XOWS_CMAP_B64[0x3F & (t >> 12)];
    b64 += XOWS_CMAP_B64[0x3F & (t >>  6)];
    b64 += XOWS_CMAP_B64[0x3F & (t)];
  }
  // remaining bytes + padding
  if(rem !== 0) {
    t = (uint8[p++] << 16);
    if(rem > 1) t |= (uint8[p] << 8);
    b64 += XOWS_CMAP_B64[0x3F & (t >> 18)];
    b64 += XOWS_CMAP_B64[0x3F & (t >> 12)];
    b64 += (rem > 1) ? XOWS_CMAP_B64[0x3F & (t >>  6)] : "=";
    b64 += "=";
  }
  return b64;
}

/**
 * Get the hexadecimal representation of the given bytes data.
 * 
 * @param   {Uint8Array}  uint8  Input bytes data.
 * 
 * @return  {string} Hexadecimal representation string.
 */
function xows_bytes_to_hex(uint8) 
{
  let c, hex = "";
  for(let i = 0, n = uint8.length; i < n; ++i) {
    c = uint8[i];
    hex += XOWS_CMAP_HEX.charAt((c >>> 4) & 0x0F) +
           XOWS_CMAP_HEX.charAt((c)       & 0x0F);
  }
  return hex;
}

/* --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  
 *                hash and crypto utilities functions
 * --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  -- */
 
 /**
 * Generate a Version 4 UUID string
 * 
 * @return  {string} Randomly generated version 4 UUID
 */
function xows_gen_uuid() 
{
  const r = new Uint8Array(16);
  window.crypto.getRandomValues(r);
  // UUID : xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  r[6] = r[6] & 0x0F | 0x40;
  r[8] = r[8] & 0x3F | 0x80;
  let uuid = "";
  for(let c = 0, b = 0; b < 16; ++b) {
    if(c === 8 || c === 13 || c === 18 || c === 23) {
      uuid += "-"; c++;
    }
    uuid += XOWS_CMAP_HEX.charAt((r[b] >>> 4) & 0x0F) +
            XOWS_CMAP_HEX.charAt((r[b])       & 0x0F);
    c += 2;
  }
  return uuid;
}

/**
 * Get hexadecimal representation of a randomly 
 * generated number bytes sequence.
 *  
 * @param   {number}  len   Bytes sequence length in bytes.
 * 
 * @return  {string} Hexadecimal representation string.
 */
function xows_gen_nonce_hex(len) 
{
  // get random value using modern crypto object
  const r = new Uint8Array(len);
  window.crypto.getRandomValues(r);

  let nonce = "";
  for(let i = 0; i < len; ++i) {
    nonce += XOWS_CMAP_HEX.charAt((r[i] >>> 4) & 0x0F) +
             XOWS_CMAP_HEX.charAt((r[i])       & 0x0F);
  }

  return nonce;
}

/**
 * Generates random alphanumerical ASCII string of the 
 * specified length.
 *  
 * @param   {number}  len   Length of the string to generate.
 * 
 * @return  {string}  Randomly generated alphanumeric string.
 */
function xows_gen_nonce_asc(len) 
{
  // get random value using modern crypto object
  const r = new Uint8Array(len);
  window.crypto.getRandomValues(r);

  let nonce = "";
  for(let i = 0; i < len; ++i) nonce += XOWS_CMAP_B64[r[i] % 62];
  return nonce;
}

/**
 * Generate MD5 Hash of a given string or bytes array.
 * 
 * @param   {(string|Uint8Array)}   input  Input data to compute hash.
 *               
 * @return  {Uint8Array}  16 bytes MD5 hash
 */
function xows_hash_md5(input)
{
  // unique temporary variable
  let tmp;
  
  // Declare internal MD5 sub-routines
  function P1(a,b,c,d,x,s,t) {
    tmp = a + ((d ^ (b & (c ^ d))) + x + t);
    return (((tmp << s) | (tmp >>> (32 - s))) + b); 
  }
  function P2(a,b,c,d,x,s,t) {
    tmp = a + ((c ^ (d & (b ^ c))) + x + t);
    return (((tmp << s) | (tmp >>> (32 - s))) + b); 
  }
  function P3(a,b,c,d,x,s,t) {
    tmp = a + ((b ^ c ^ d) + x + t);
    return (((tmp << s) | (tmp >>> (32 - s))) + b); 
  }
  function P4(a,b,c,d,x,s,t) {
    tmp = a + ((c ^ (b | ~d)) + x + t);
    return (((tmp << s) | (tmp >>> (32 - s))) + b); 
  }
  
  // Hash takes data as 64 bytes blocks, we create a new buffer of 
  // the proper size which can contains input data, the additional 0x80  
  // padding and the final 8-bytes "data-length" value
  let ilen, blen, data, i = 0;
  if(typeof input === "string") {
    ilen = xows_str_bytes_len(input); blen = ilen * 8;
    data = xows_str_to_bytes(input, ((blen+64) >> 9 << 6) + 64);
  } else {
    ilen = input.length; blen = ilen * 8;
    data = new Uint8Array(((blen+64) >> 9 << 6) + 64);
    for( ; i < ilen; ++i) data[i] = input[i];
  }
  
  // Append the 0x80 final padding to input data
  data[ilen] |= 0x80;

  // Adds the input data total size (in bits) at the very end of the 
  // last block. The value is a 8-bytes integer stored in little-endian 
  // meaning the lo-word is before the hi-word. 
  // Here we store only the lo-word into the before-last 4-bytes of data
  let p = data.length - 8; //< Position of the before-last 4-bytes of data
  data[p  ] = (blen      ) & 0xff;
  data[p+1] = (blen >>  8) & 0xff;
  data[p+2] = (blen >> 16) & 0xff;
  data[p+3] = (blen >> 24) & 0xff;
  
  // We work with 32 bits unsigned integers
  const X = new Uint32Array(16);
  const state = new Uint32Array(4);
  state[0] = 0x67452301; state[1] = 0xEFCDAB89; state[2] = 0x98BADCFE;
  state[3] = 0x10325476; 
  
  let A, B, C, D;
  
  p = 0;
  while(p < data.length) {

    // Put 64 bytes from data to 16 Uint32 block in little-endian
    for(i = 0; i < 16; ++i) {
      X[i] =  (data[p++])
            | (data[p++] <<  8)
            | (data[p++] << 16)
            | (data[p++] << 24);
    }
    
    A = state[0]; B = state[1]; C = state[2]; D = state[3];

    A=P1(A,B,C,D,X[ 0], 7,0xD76AA478); D=P1(D,A,B,C,X[ 1],12,0xE8C7B756);
    C=P1(C,D,A,B,X[ 2],17,0x242070DB); B=P1(B,C,D,A,X[ 3],22,0xC1BDCEEE);
    A=P1(A,B,C,D,X[ 4], 7,0xF57C0FAF); D=P1(D,A,B,C,X[ 5],12,0x4787C62A);
    C=P1(C,D,A,B,X[ 6],17,0xA8304613); B=P1(B,C,D,A,X[ 7],22,0xFD469501);
    A=P1(A,B,C,D,X[ 8], 7,0x698098D8); D=P1(D,A,B,C,X[ 9],12,0x8B44F7AF);
    C=P1(C,D,A,B,X[10],17,0xFFFF5BB1); B=P1(B,C,D,A,X[11],22,0x895CD7BE); 
    A=P1(A,B,C,D,X[12], 7,0x6B901122); D=P1(D,A,B,C,X[13],12,0xFD987193);
    C=P1(C,D,A,B,X[14],17,0xA679438E); B=P1(B,C,D,A,X[15],22,0x49B40821);

    A=P2(A,B,C,D,X[ 1], 5,0xF61E2562); D=P2(D,A,B,C,X[ 6], 9,0xC040B340);
    C=P2(C,D,A,B,X[11],14,0x265E5A51); B=P2(B,C,D,A,X[ 0],20,0xE9B6C7AA);
    A=P2(A,B,C,D,X[ 5], 5,0xD62F105D); D=P2(D,A,B,C,X[10], 9,0x02441453);
    C=P2(C,D,A,B,X[15],14,0xD8A1E681); B=P2(B,C,D,A,X[ 4],20,0xE7D3FBC8);
    A=P2(A,B,C,D,X[ 9], 5,0x21E1CDE6); D=P2(D,A,B,C,X[14], 9,0xC33707D6);
    C=P2(C,D,A,B,X[ 3],14,0xF4D50D87); B=P2(B,C,D,A,X[ 8],20,0x455A14ED);
    A=P2(A,B,C,D,X[13], 5,0xA9E3E905); D=P2(D,A,B,C,X[ 2], 9,0xFCEFA3F8);
    C=P2(C,D,A,B,X[ 7],14,0x676F02D9); B=P2(B,C,D,A,X[12],20,0x8D2A4C8A);
    
    A=P3(A,B,C,D,X[ 5], 4,0xFFFA3942); D=P3(D,A,B,C,X[ 8],11,0x8771F681);
    C=P3(C,D,A,B,X[11],16,0x6D9D6122); B=P3(B,C,D,A,X[14],23,0xFDE5380C);
    A=P3(A,B,C,D,X[ 1], 4,0xA4BEEA44); D=P3(D,A,B,C,X[ 4],11,0x4BDECFA9);
    C=P3(C,D,A,B,X[ 7],16,0xF6BB4B60); B=P3(B,C,D,A,X[10],23,0xBEBFBC70);
    A=P3(A,B,C,D,X[13], 4,0x289B7EC6); D=P3(D,A,B,C,X[ 0],11,0xEAA127FA);
    C=P3(C,D,A,B,X[ 3],16,0xD4EF3085); B=P3(B,C,D,A,X[ 6],23,0x04881D05);
    A=P3(A,B,C,D,X[ 9], 4,0xD9D4D039); D=P3(D,A,B,C,X[12],11,0xE6DB99E5);
    C=P3(C,D,A,B,X[15],16,0x1FA27CF8); B=P3(B,C,D,A,X[ 2],23,0xC4AC5665);

    A=P4(A,B,C,D,X[ 0], 6,0xF4292244); D=P4(D,A,B,C,X[ 7],10,0x432AFF97);
    C=P4(C,D,A,B,X[14],15,0xAB9423A7); B=P4(B,C,D,A,X[ 5],21,0xFC93A039);
    A=P4(A,B,C,D,X[12], 6,0x655B59C3); D=P4(D,A,B,C,X[ 3],10,0x8F0CCC92);
    C=P4(C,D,A,B,X[10],15,0xFFEFF47D); B=P4(B,C,D,A,X[ 1],21,0x85845DD1);
    A=P4(A,B,C,D,X[ 8], 6,0x6FA87E4F); D=P4(D,A,B,C,X[15],10,0xFE2CE6E0);
    C=P4(C,D,A,B,X[ 6],15,0xA3014314); B=P4(B,C,D,A,X[13],21,0x4E0811A1);
    A=P4(A,B,C,D,X[ 4], 6,0xF7537E82); D=P4(D,A,B,C,X[11],10,0xBD3AF235);
    C=P4(C,D,A,B,X[ 2],15,0x2AD7D2BB); B=P4(B,C,D,A,X[ 9],21,0xEB86D391);
    
    // Add state for this block
    state[0] += A; state[1] += B; state[2] += C; state[3] += D;
  }
  
  // Convert the five little-endian Uint32 result into 20 bytes array 
  const hash = new Uint8Array(16);
  for(i = 0, p = 0; i < 4; ++i) {
    hash[p++] = (state[i]      ) & 0xff;
    hash[p++] = (state[i] >>  8) & 0xff;
    hash[p++] = (state[i] >> 16) & 0xff;
    hash[p++] = (state[i] >> 24) & 0xff;
  }

  return hash;
}

/**
 * Generate SHA-1 Hash of a given string or bytes array.
 * 
 * @param   {(string|Uint8Array)}   input  Input data to compute hash.
 *               
 * @return  {Uint8Array}  20 bytes SHA-1 hash
 */
function xows_hash_sha1(input) 
{
  // Hash takes data as 64 bytes blocks, we create a new buffer of 
  // the proper size which can contains input data, the additional 0x80  
  // padding and the final 8-bytes "data-length" value
  let ilen, blen, data, i = 0;
  if(typeof input === "string") {
    ilen = xows_str_bytes_len(input); blen = ilen * 8;
    data = xows_str_to_bytes(input, ((blen+64) >> 9 << 6) + 64);
  } else {
    ilen = input.length; blen = ilen * 8;
    data = new Uint8Array(((blen+64) >> 9 << 6) + 64);
    for( ; i < ilen; ++i) data[i] = input[i];
  }
  
  // Append the 0x80 final padding to input data
  data[ilen] |= 0x80; 
  // Adds the input data total size (in bits) at the very end of the 
  // last block. The value is a 8-bytes integer stored in big-endian 
  // meaning the hi-word is before the lo-word. 
  // Here we store only the lo-word into the very last 4-bytes of data
  let p = data.length - 4; //< Position of the last 4-bytes of data
  data[p  ] = (blen >> 24) & 0xff;
  data[p+1] = (blen >> 16) & 0xff;
  data[p+2] = (blen >>  8) & 0xff;
  data[p+3] = (blen      ) & 0xff;
  
  // We work with 32 bits unsigned integers 
  const W = new Uint32Array(16);
  const state = new Uint32Array(5);
  state[0] = 0x67452301; state[1] = 0xEFCDAB89; state[2] = 0x98BADCFE;
  state[3] = 0x10325476; state[4] = 0xC3D2E1F0;

  let A, B, C, D, E, K, F, tmp;
  
  p = 0;
  while(p < data.length) {
    
    // Put 64 bytes from data to 16 Uint32 block in big-endian 
    for(i = 0; i < 16; ++i) {
      W[i] =  (data[p++] << 24) 
            | (data[p++] << 16) 
            | (data[p++] <<  8)
            | (data[p++]);
    }

    A = state[0]; B = state[1]; C = state[2]; 
    D = state[3]; E = state[4];
    
    // Process SHA-1 hash for this 64 bytes block
    for(i = 0; i < 80; ++i) {

      if(i > 15) {
        tmp =  W[(i-3)&0x0F] ^ W[(i-8)&0x0F] ^ W[(i-14)&0x0F] ^ W[i&0x0F];
        W[i&0x0F] = (tmp<<1|tmp>>>31);
      }
      
      if(i < 20) { 
        K = 0x5A827999; F = D ^ (B & (C ^ D)); 
      } else if(i < 40) { 
        K = 0x6ED9EBA1; F = B ^ C ^ D;  
      } else if(i < 60) { 
        K = 0x8F1BBCDC; F = B & C | B & D | C & D;  
      } else { 
        K = 0xCA62C1D6; F = B ^ C ^ D; 
      }
      
      tmp = (((A<<5|A>>>27) + F) + ((E + W[i&0x0F]) + K));
      E = D; D = C; C = (B<<30|B>>>2); B = A; A = tmp;
    }
    
    // Add state for this block
    state[0] += A; state[1] += B; state[2] += C; 
    state[3] += D; state[4] += E;
  }

  // Convert the five big-endian Uint32 result into 20 bytes array 
  const hash = new Uint8Array(20);
  for(i = 0, p = 0; i < 5; ++i) {
    hash[p++] = (state[i] >> 24) & 0xff;
    hash[p++] = (state[i] >> 16) & 0xff;
    hash[p++] = (state[i] >>  8) & 0xff;
    hash[p++] =  state[i]        & 0xff;
  }

  return hash;
}

/**
 * Calculate the HMAC-SHA1 using the given key and data.
 * 
 * @param   {(string|Uint8Array)}   key  Key to calculate HMAC.
 * @param   {(string|Uint8Array)}   data Data to calculate HMAC.
 *               
 * @return  {Uint8Array}  20 bytes of the HMAC-SHA1 result.
 */
function xows_hmac_sha1(key, data) 
{
  if(typeof key === "string")
    key = xows_str_to_bytes(key);
  
  if(key.length > 64) 
    key = xows_hash_sha1(key);
  
  const ipad = new Uint8Array(64 + data.length);
  const opad = new Uint8Array(84); // 64 + 20

  let i, p, n;
  
  for(p = 0, n = key.length; p < n; ++p) {
    ipad[p] = key[p] ^ 0x36; 
    opad[p] = key[p] ^ 0x5C;
  }
  for( ; p < 64; ++p) {
    ipad[p] = 0x36; 
    opad[p] = 0x5C; 
  }
  
  if(typeof data === "string") 
    data = xows_str_to_bytes(data);
  
  for(i = 0, n = data.length; i < n; ++i) ipad[p++] = data[i];
  const hash = xows_hash_sha1(ipad);
  for(i = 0, p = 64; i < 20; ++i) opad[p++] = hash[i];
  return xows_hash_sha1(opad);
}

/**
 * Generate SHA-256 Hash of a given string or bytes array.
 * 
 * @param   {(string|Uint8Array)}   input  Input data to compute hash.
 *               
 * @return  {Uint8Array}  32 bytes SHA-256 hash
 */
function xows_hash_sha256(input) 
{
  const K = new Uint32Array([
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2]);

  // Hash takes data as 64 bytes blocks, we create a new buffer of 
  // the proper size which can contains input data, the additional 0x80  
  // padding and the final 8-bytes "data-length" value
  let ilen, blen, data, i = 0;
  if(typeof input === "string") {
    ilen = xows_str_bytes_len(input); blen = ilen * 8;
    data = xows_str_to_bytes(input, ((blen+64) >> 9 << 6) + 64);
  } else {
    ilen = input.length; blen = ilen * 8;
    data = new Uint8Array(((blen+64) >> 9 << 6) + 64);
    for( ; i < ilen; ++i) data[i] = input[i];
  }

  // Append the 0x80 final padding to input data
  data[ilen] |= 0x80; 
  // Adds the input data total size (in bits) at the very end of the 
  // last block. The value is a 8-bytes integer stored in big-endian 
  // meaning the hi-word is before the lo-word. 
  // Here we store only the lo-word into the very last 4-bytes of data
  let p = data.length - 4; //< Position of the last 4-bytes of data
  data[p  ] = (blen >> 24) & 0xff;
  data[p+1] = (blen >> 16) & 0xff;
  data[p+2] = (blen >>  8) & 0xff;
  data[p+3] = (blen      ) & 0xff;
  
  // We work with 32 bits unsigned integers 
  const W = new Uint32Array(64);
  const state = new Uint32Array(8);
  state[0] = 0x6A09E667; state[1] = 0xBB67AE85; state[2] = 0x3C6EF372;
  state[3] = 0xA54FF53A; state[4] = 0x510E527F; state[5] = 0x9B05688C;
  state[6] = 0x1F83D9AB; state[7] = 0x5BE0CD19;

  let A, B, C, D, E, F, G, H, S, T;
  
  p = 0;
  while(p < data.length) {
    
    // Put 64 bytes from data to 16 Uint32 block in big-endian 
    for(i = 0; i < 16; ++i) {
      W[i] =  (data[p++] << 24) 
            | (data[p++] << 16) 
            | (data[p++] <<  8)
            | (data[p++]);
    }
    
    A = state[0]; B = state[1]; C = state[2]; D = state[3]; 
    E = state[4]; F = state[5]; G = state[6]; H = state[7]; 
    
    for(i = 0; i < 64; i++) {
      
      if(i > 15) {
        T = W[i -  2];  
        S = ((T>>>17)|(T<<15))^((T>>>19)|(T<<13))^(T>>>10);   
        W[i] = S + W[i -  7];
        T = W[i - 15];
        S = ((T>>> 7)|(T<<25))^((T>>>18)|(T<<14))^(T>>> 3);
        W[i] += S + W[i - 16];
      }

      S = ((E>>> 6)|(E<<26))^((E>>>11)|(E<<21))^((E>>>25)|(E<< 7)); 
      T = H + S + (G ^ (E & (F ^ G))) + K[i] + W[i];
      D += T;
      S = ((A>>> 2)|(A<<30))^((A>>>13)|(A<<19))^((A>>>22)|(A<<10)); 
      T += (S + ((A & B) | (C & (A | B))));
      H = G; G = F; F = E; E = D; D = C; C = B; B = A; A = T;
    }

    // Add state for this block
    state[0] += A; state[1] += B; state[2] += C; state[3] += D; 
    state[4] += E; state[5] += F; state[6] += G; state[7] += H;
  }

  // Convert the five big-endian Uint32 result into 32 bytes array 
  const hash = new Uint8Array(32);
  for(i = 0, p = 0; i < 8; ++i) {
    hash[p++] = (state[i] >> 24) & 0xff;
    hash[p++] = (state[i] >> 16) & 0xff;
    hash[p++] = (state[i] >>  8) & 0xff;
    hash[p++] =  state[i]        & 0xff;
  }

  return hash;
}

/* --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  
 *          common string validation and parsing functions
 * --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  -- */

/**
 * Regex object to test and validate JID format
 */
const XOWS_REG_TEST_JID = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Check whether given string is a valid JID
 * 
 * @param   {string}  str  String to check.
 * 
 * @return  {boolean}  True if supplied string is a valid 
 *                     JID, false otherwise
 */
function xows_is_jid(str)
{
  return XOWS_REG_TEST_JID.test(str);
}

/**
 * Get bare JID from full JID
 * 
 * 'user@sever/resource' => 'user@sever'
 * 
 * @param   {string}  jid  JID to get the bare part.
 * 
 * @return  {string}  Extracted bare JID
 */
function xows_jid_to_bare(jid)
{
  const p = jid.indexOf("/");
  return (p !== -1) ? jid.substring(0, p) : jid;
}

/**
 * Get Username from JID
 * 
 * 'user@sever/resource' => 'user'
 * 
 * @param   {string}  jid  JID to get the bare part.
 * 
 * @return  {string}  Extracted bare JID
 */
function xows_jid_to_user(jid)
{
  const p = jid.indexOf("@");
  return (p !== -1) ? jid.substring(0, p) : jid;
}

/**
 * Get nickname or ressource from full JID
 * 
 * * 'user@sever/resource' => 'resource'
 * 
 * @param   {string}  jid  JID to get the nick or resource part.
 * 
 * @return  {string}  Extracted nick, resource or null if unavailable.
 */
function xows_jid_to_nick(jid)
{
  const p = jid.indexOf("/");
  return (p !== -1) ? jid.substring(p+1) : null;
}

/**
 * Get the data part of the given Data-URL string.
 * 
 * @param   {string}  url    Data-URL to parse.
 * 
 * @return  {string}  Parsed data or null.
 */
function xows_url_to_data(url)
{
  if(url.indexOf("data:") === 0) {
    return url.substring(url.indexOf(",")+1);
  }
  return null;
}

/**
 * Get the decoded data from the given Data-URL string, 
 * assuming data is base64 encoded.
 * 
 * @param   {string}  url    Data-URL to parse.
 * 
 * @return  {string}  Decoded data as bytes sting or null.
 */
function xows_url_to_bytes(url)
{
  if(url.indexOf("data:") === 0) {
    return atob(url.substring(url.indexOf(",")+1));
  }
  return null;
}

/**
 * Get the MIME type part of the given Data-URL string.
 * 
 * @param   {string}  url    Data-URL to parse.
 * 
 * @return  {string}  Parsed MIME type or null.
 */
function xows_url_to_type(url)
{
  if(url.indexOf("data:") === 0) {
    return url.substring(5,url.indexOf(";"));
  }
  return null;
}

/**
 * Correspondence map to escape HTML reserved or special characters.
 */
const XOWS_HTML_ESCAP_MAP = {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&apos;","\"":"&quot;","\n":"<br>"};

/**
 * Remplacement function for HTML string escape.
 */
function xows_html_escap_fnc(m) {return XOWS_HTML_ESCAP_MAP[m];}

/**
 * Rewrites the given string with HTML escapes for reserved or special 
 * characters.
 * 
 * @param   {string}  str   String to be escaped.
 * 
 * @return  {string}  Escaped string.
 */
function xows_html_escape(str) 
{
  return str.replace(/[\&<>'"\n]/g, xows_html_escap_fnc);
}

/* --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  
 *            DOM elements and tree manipulation functions
 * --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  -- */
 
/**
 * Remove empty or useless text nodes such as CR/LF 
 * from DOM tree.
 * 
 * @param   {object}  node    Root node of DOM tree to clean.
 * 
 * @return  {object}  DOM node passed as parameter.
 */
function xows_clean_dom(node)
{
  let child, i = node.childNodes.length;
  while(i--) {
    child = node.childNodes[i];
    if(child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
      node.removeChild(child);
    } else if(child.nodeType === 1) {
      xows_clean_dom(child);
    }
  }
  
  return node;
}

/* --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  
 *             graphics and picture manipulation functions
 * --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  --  -- */
 
/**
 *  Draw an icon with the specified paramers
 * 
 * @param   {number}  size     Icon size in pixels
 * @param   {Image}   image    Optional background image
 * @param   {string}  name     Optional name to generate background and Letter
 * @param   {string}  font     Optional font for center letter
 *  
 * @return  {string}  Resulting icon as Data-URL string.
 */
function xows_gen_avatar(size, image, name, font)
{
  // Create offscreen canvas
  const cv = document.createElement("canvas");
  const ct = cv.getContext("2d");

  const half = (size * 0.5);
  
  if(image) {
    
    // Resized image data
    let dst;
    
    // Source image width and height
    const sw = image.naturalWidth; 
    const sh = image.naturalHeight;

    // Downsample the image if required
    if(sw > size || sh > size) {

      // Set square frame dimensions in source image
      let max, sx, sy;
      if(sw > sh) {
        max = sh; sx = (sw - max) * 0.5; sy = 0;
      } else {
        max = sw; sx = 0; sy = (sh - max) * 0.5;
      }
      
      // Resize canvas to get full image
      cv.width = sw; cv.height = sh;
      // Draw source image on temp canvas
      ct.drawImage(image, 0, 0);
      
      // Get source image required portion
      const src = ct.getImageData(sx, sy, max, max);
      const src_data = new Int32Array(src.data.buffer);
      // Create new image data for resized image
      dst = new ImageData(size, size);
      const dst_data = new Int32Array(dst.data.buffer);
      
      // Downsample image algorithm inspired from :
      // https://github.com/ytiurin/downscale/blob/master/src/downsample.js
      const u = 1.0 / (size / max); //< dst to src scale factor
      const box = Math.round(u); // src box size (to get pixels in)
      const v = 1.0 / (box * box); // factor to average dst pixel

      let i, j, x, y, c, r, g, b, a, p;

      for(i = 0; i < size; ++i) { // Destination col
        for(j = 0; j < size; ++j) { // Destination row
          c = (Math.round(j*u)*max) + Math.round(i*u);
          r = 0; g = 0; b = 0; a = 0;
          for(y = 0; y < box; ++y) { // Box row
            for(x = 0; x < box; ++x) { // Box col 
              p = src_data[c+((y*max)+x)];
              a += (p >> 24) & 0xff; b += (p >> 16) & 0xff;
              g += (p >>  8) & 0xff; r +=  p        & 0xff;
            }
          }
          r = Math.round(r*v); g = Math.round(g*v);
          b = Math.round(b*v); a = Math.round(a*v);
          dst_data[(j*size)+i] = (a << 24)|(b << 16)|(g << 8)|r;
        }
      }
      // Define final canvas size
      cv.width = cv.height = size;
      ct.putImageData(dst, 0, 0);
    } else {
      // Define final canvas size
      cv.width = cv.height = size;
      ct.drawImage(image, 0, 0, size, size);
    }
    
  } else {
    
    // Define final canvas size
    cv.width = cv.height = size;
    
    if(name) {
      // Generate pseudo-random hue from name
      let s = 0, i = name.length;
      while(i--) s += name.charCodeAt(i);
      const h = (xows_random(s)*2)*180;
      
      // Fill background with color
      ct.fillStyle = "hsl("+h+",85%,45%)";
      //ct.arc(half, half, half, 0, 2*Math.PI);
      ct.rect(0, 0, size, size);
      ct.fill();
      
      // Set foreground Color
      ct.fillStyle = "#FFF";
    
      // Draw the logo from SVG path
      const scale = size/32;
      ct.scale(scale, scale);
      ct.fill(XOWS_LOGO_SVG);
    }
  }
  
  return cv.toDataURL("image/png");
}