const tree = require('./tree.json')
//const tree = require('./miniTree.json')
const fs = require('fs');
const _ = require('lodash');

const { createVariations } = require('./createVariations');
const { trimVariations } = require('./trimVariations');
const { ffmpegVariation } = require('./ffmpegVariations');

const variations = createVariations(tree);
console.log('Maximum unique variations :', variations.length)

const { trimVs, treeKeys } = trimVariations(variations, tree);
console.log('Trimmed unique variations:', trimVs.length);

const st = JSON.stringify(trimVs);

fs.writeFile(`./log/log.json`, st, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log(`The log.json was saved!`);
});

fs.writeFile(`./log/treeKeys.json`, st, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log(`The treeKeys.json was saved!`);
});

const countUnique = _.countBy(_.flatten(trimVs));
fs.writeFile("./log/countUnique.json", JSON.stringify(countUnique), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The countUnique.json was saved!");
});

//for (var i = 0; i < trimVs.length; i++) {
//    ffmpegVariation(_.compact(trimVs[i]), './exports/' + i + '.png');
//}

ffmpegVariation(_.compact(trimVs[23152]), './exports/' + 23152 + '.png');

//const ITERATIONS = 100;
//const CHUNK_SIZE = Math.ceil(trimVs.length / ITERATIONS);
//for (let i = 0; i < ITERATIONS; i++) {
//    const st = JSON.stringify(trimVs.slice(i * CHUNK_SIZE, (i * CHUNK_SIZE) + CHUNK_SIZE));
//    fs.writeFile(`./log/log${i * CHUNK_SIZE}.json`, st, function (err) {
//        if (err) {
//            return console.log(err);
//        }
//        console.log(`The log${i * CHUNK_SIZE}.json was saved!`);
//    });
//}

//var j = Math.floor(Math.random() * trimVs.length);
//for (var i = 0; i < 10; i++) {
//    ffmpegVariation(_.compact(trimVs[j]), './exports/' + j + '.png');
//    j = Math.floor(Math.random() * trimVs.length)
//}
