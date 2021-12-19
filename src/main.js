const tree = require('./tree.json')
//const tree = require('./miniTree.json')
const fs = require('fs');
const _ = require('lodash');
//require('deepdash')(_);
var ffmpeg = require('fluent-ffmpeg');

const DEFAULT_RISK = 0.5;

const createVariations = (_tree) => {
    const v = [];
    //console.log(_tree[0])
    var files = fs.readdirSync(_tree[0].folders[0]);
    const slice = _tree.slice(1);

    let nextV = [];
    if (slice.length) {
        nextV = createVariations(slice);
        //if (!_tree[0].mandatory)
        //    nextV.push(null);
    }

    //console.log({ slice, files })
    for (var i in files) {
        if (!nextV.length)
            v.push([_tree[0].folders[0] + '/' + files[i]]);
        else
            for (var j in nextV) {
                v.push([_tree[0].folders[0] + '/' + files[i]]);
                v[v.length - 1] = v[v.length - 1].concat(nextV[j])
            }
    }
    return v
}

const variations = createVariations(tree);
console.log({ variationsL: variations.length })

const trimVariations = (variations, tree) => {
    const treeKeys = _.keyBy(tree, (d) => d.folders[0]);
    const result = [];
    for (var i in variations) {
        const iv = _.compact(variations[i])
        const innerResult = [];
        for (j in iv) {
            const lastI = iv[j].lastIndexOf('/');
            const key = iv[j].slice(0, lastI);
            if (!treeKeys[key].occurrences) treeKeys[key].occurrences = 0;
            if (treeKeys[key]?.mandatory) {
                innerResult.push(iv[j])
                treeKeys[key].occurrences++;
            } else if (Math.random() < (treeKeys[key].risk || DEFAULT_RISK)) {
                if (treeKeys[key].occurrences < (treeKeys[key].maxOccurrences || Infinity)) {
                    innerResult.push(iv[j]);
                    treeKeys[key].occurrences++;
                }
            }
        }
        result.push(innerResult)
    }
    return { trimVs: _.values(_.keyBy(result)), treeKeys };
}

const { trimVs, treeKeys } = trimVariations(variations, tree);

console.log({ trimVsL: trimVs.length });
const ITERATIONS = 100;
const CHUNK_SIZE = Math.ceil(trimVs.length / ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
    const st = JSON.stringify(trimVs.slice(i * CHUNK_SIZE, (i * CHUNK_SIZE) + CHUNK_SIZE));
    fs.writeFile(`./log/log${i * CHUNK_SIZE}.json`, st, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`The log${i * CHUNK_SIZE}.json was saved!`);
    });
}

fs.writeFile("./log/treeKeys.json", JSON.stringify(treeKeys), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The treeKeys.json was saved!");
});


const ffmpegVariation = (variation, outputFile) => {
    //ffmpeg -i B.png -i A.png -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay" out.png
    let command = ffmpeg();
    variation.forEach((fileName) => command.mergeAdd(fileName));
    const complexFilter = _.map(variation.slice(0, variation.length - 1), (a, i) => (`[${i}]overlay${i < variation.length - 2 ? `[${i + 1}]` : ''}`))

    console.log(complexFilter)
    command
        .complexFilter(complexFilter)
        .output(outputFile)
        .save('./exports/out.png')
        .on('error', function (err, stdout, stderr) {
            console.log(`cannot process the video ${err.message}`);
        });
}
    ;

//var j = Math.floor(Math.random() * variations.length);
//for (var i = 0; i < 10; i++) {
//    //let output = variations[i].join('__').replace(/\.\/media\//g, '').replace(/\//g, '_').replace(/\.png/g, '').replace(/\.jpg/g, '');
//    ffmpegVariation(_.compact(variations[j]), './exports/' + j + '.png');
//    j = Math.floor(Math.random() * variations.length)
//}


