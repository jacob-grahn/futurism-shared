var mongoose = require('mongoose');
var futures = require('../futures');
var _ = require('lodash');


var StatsSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    elo: {
        type: Number,
        min: 0,
        max: 9999,
        default: 150
    },
    fame: {
        type: Number,
        min: 0,
        default: 0
    },
    fractures: {
        type: Number,
        min: 0,
        default: 5
    },
    futures: {
        type: Array,
        default: []
    },
    updated: {
        type: Date,
        default: Date.now
    }
});


StatsSchema.pre('save', function (next) {
    if(!_.isArray(this.futures)) {
        this.futures = [];
    }
    this.futures = _.filter(this.futures, isValidFuture);
    this.futures = _.unique(this.futures);
    next();
});

var isValidFuture = function(futureId) {
    var arr = _.toArray(futures);
    var isValid = arr.indexOf(futureId) !== -1;
    return isValid;
};


var Stats = mongoose.model('Stats', StatsSchema);


module.exports = Stats;