//const tree = require('./tree.json')
const tree = require('./miniTree.json')
const fs = require('fs');
const _ = require('lodash');
//require('deepdash')(_);
var ffmpeg = require('fluent-ffmpeg');

const createVariations = (_tree) => {
    const v = [];
    //console.log(_tree[0])
    var files = fs.readdirSync(_tree[0].folders[0]);
    const slice = _tree.slice(1);

    let nextV = [];
    if (slice.length) {
        nextV = createVariations(slice);
        //if (!_tree[0].mandatory) {
        //    console.log(nextV);
        //    nextV.push(null);
        //}
    }

    //console.log({ slice, files })
    for (var i in files) {
        if (!nextV.length) {
            //stuck with 3d glasses
            console.log({ n: files[i] })
            v.push([_tree[0].folders[0] + '/' + files[i]]);
        } else
            for (var j in nextV) {
                const r = Math.random();
                //console.log({ r, n: files[i] })
                if (_tree[0].mandatory || r < .1) {
                    v.push([_tree[0].folders[0] + '/' + files[i]]);
                    v[v.length - 1] = v[v.length - 1].concat(nextV[j])
                } else {
                    v.push([null]);
                    v[v.length - 1] = v[v.length - 1].concat(nextV[j])
                }
            }
    }
    return v
}

const variations = createVariations(tree);
console.log({ variationsL: variations.length });
const nv = _.values(_.keyBy(_.map(variations, _.compact)));
console.log()
console.log({ nvL: nv.length });

fs.writeFile("./log/log.json", JSON.stringify(nv), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});


const ffmpegVariation = (variation, outputFile) => {
    //ffmpeg -i B.png -i A.png -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay" out.png
    let command = ffmpeg();
    variation.forEach((fileName) => command.mergeAdd(fileName));
    const complexFilter = _.map(variation.slice(0, variation.length - 1), (a, i) => (`[${i}]overlay${i < variation.length - 2 ? `[${i + 1}]` : ''}`))

    command
        .complexFilter(complexFilter)
        .output(outputFile)
        .save('./exports/out.png')
        .on('error', function (err, stdout, stderr) {
            console.log(`cannot process the video ${err.message}`);
        });
}

var j = Math.floor(Math.random() * variations.length);
for (var i = 0; i < 10; i++) {
    //let output = variations[i].join('__').replace(/\.\/media\//g, '').replace(/\//g, '_').replace(/\.png/g, '').replace(/\.jpg/g, '');
    ffmpegVariation(_.compact(variations[j]), './exports/' + j + '.png');
    j = Math.floor(Math.random() * variations.length)
}

