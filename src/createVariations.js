const fs = require('fs');

const createVariations = (_tree) => {
    const v = [];

    var files = fs.readdirSync(_tree[0].folders[0]);
    const slice = _tree.slice(1);

    let nextV = [];
    if (slice.length) {
        nextV = createVariations(slice);
    }

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
module.exports = { createVariations }