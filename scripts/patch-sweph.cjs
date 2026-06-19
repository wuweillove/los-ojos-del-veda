const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'node_modules/sweph/index.js');
const patchContent = `/// <reference path="index.d.ts"/>
"use strict";

let s;
try {
    s = require("node-gyp-build")(__dirname);
} catch (e) {
    const path = require("path");
    const binaryPath = path.join(__dirname, "prebuilds", "linux-x64", "sweph.node");
    try {
        s = require(binaryPath);
    } catch (e2) {
        console.error("Failed to load sweph native binary from:", binaryPath);
        throw e2;
    }
}

const c = require("./constants.js");

const sweph = {
    ...s,
    constants: c,
    sweph: s,
    default: s
}

module.exports = sweph;`;

if (fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, patchContent);
    console.log('Successfully patched sweph/index.js');
} else {
    console.error('sweph/index.js not found at:', indexPath);
    process.exit(1);
}
