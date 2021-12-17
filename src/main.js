const tree = require('./tree.json')
const fs = require('fs');

const createVariations = (_tree) => {
    const v = [];
    //console.log(_tree[0])
    var files = fs.readdirSync(_tree[0].folders[0]);
    const slice = _tree.slice(1)
    //console.log({ slice, files })
    for (var i in files) {
        v.push([_tree[0].folders[0] + '/' + files[i]]);
        if (slice.length)
            v[v.length - 1] = v[v.length - 1].concat(createVariations(slice));
    }
    return v
}

const variations = createVariations(tree);

console.log({ variations })