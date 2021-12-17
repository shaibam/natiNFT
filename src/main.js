//const tree = require('./tree.json')
const tree = require('./miniTree.json')
const fs = require('fs');
//const _ = require('lodash');
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
        if (!_tree[0].mandatory)
            nextV.push(null);
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

const ffmpegVariation = (variation) => {
    //ffmpeg -i B.png -i A.png -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay" out.png
    let command = ffmpeg();
    for (var i in variations) {
        command.input(variations[i])
    }
    command.complexFilter([
        '[1]scale=iw/2:-1[b]',
        '[0:v][b] overlay'
    ]).output('./out.png');
}
const variations = createVariations(tree);

ffmpegVariation([0]);

console.log({ variationsL: variations.length });
