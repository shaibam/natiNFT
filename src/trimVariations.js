const DEFAULT_RISK = 0.5;
const _ = require('lodash');

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
            if (Math.random() < (treeKeys[key].risk || DEFAULT_RISK)) {
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

module.exports = { trimVariations }