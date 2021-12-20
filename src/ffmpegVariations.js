const ffmpeg = require('fluent-ffmpeg');
const _ = require('lodash');


const ffmpegVariation = (variation, outputFile) => {
    //ffmpeg -i B.png -i A.png -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay" out.png
    let command = ffmpeg();
    variation.forEach((fileName) => command.mergeAdd(fileName));
    const complexFilter = _.map(variation.slice(0, variation.length - 1), (a, i) => (`[${i}]overlay${i < variation.length - 2 ? `[${i + 1}]` : ''}`))

    if (complexFilter.length > 0) {
        command
            .complexFilter(complexFilter)
            .output(outputFile)
            .save('./exports/out.png')
            .on('error', function (err, stdout, stderr) {
                console.log(`cannot process the video ${err.message}`);
            });
    } else {
        command
            .output(outputFile)
            .save('./exports/out.png')
            .on('error', function (err, stdout, stderr) {
                console.log(`cannot process the video ${err.message}`);
            });
    }
}

module.exports = { ffmpegVariation }