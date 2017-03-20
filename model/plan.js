var moogoose = require('mongoose');
var Schema = moogoose.Schema;

var planSchema = new Schema({
    id: {type: Schema.Types.ObjectId, ref: 'User'},
    dayGoal: {type: Number},
    plan: {type: Array}
}, {versionKey: false});

module.exports = moogoose.model('plan', planSchema);