const { ffmpegVariation } = require("./ffmpegVariations");
const _ = require('lodash');
const vars = require('../log/log.json');
//const I = 18978
//ffmpegVariation(_.compact(vars[I]), './exports/' + I + '.png');
const MAX = 37662;
const a = [Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX), Math.floor(Math.random() * MAX)]
for (var i in a) {
    ffmpegVariation(_.compact(vars[a[i]]), './exports/' + a[i] + '.png');
}
