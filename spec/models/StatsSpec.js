'use strict';

var mongoose = require('mongoose');
var Stats = require('../../models/Stats');
var futures = require('../../futures');

mongoose.connect('mongodb://localhost/test');


describe('model/Stats', function() {
    
    var stats;
    
    beforeEach(function() {
        stats = new Stats();
        stats._id = mongoose.Types.ObjectId();
    });
    
    afterEach(function(done) {
        Stats.collection.remove({}, done);
    });
    
    
    describe('futures', function() {
        
        
        it('should default to ["norm"]', function(done) {
            stats.save(function(err) {
                expect(err).toBe(null);
                expect(stats.toObject().futures).toEqual(['norm']);
                done();
            });
        });
        
        it('should become an empty array if set to an invalid value', function(done) {
            stats.futures = {1: 'lala'};
            stats.save(function(err) {
                expect(err).toBe(null);
                expect(stats.toObject().futures).toEqual([]);
                done();
            });
        });
        
        it('should filter out invalid futures from the array', function(done) {
            stats.futures = ['not', 'a', 'future', '', 1, 0, -1, {}];
            stats.save(function(err) {
                expect(err).toBe(null);
                expect(stats.toObject().futures).toEqual([]);
                done();
            });
        });
        
        it('should remove duplicates', function(done) {
            stats.futures = [futures.THUNDERDOME, futures.THUNDERDOME];
            stats.save(function(err) {
                expect(err).toBe(null);
                expect(stats.toObject().futures).toEqual([futures.THUNDERDOME]);
                done();
            });
        });
        
        it('should accept valid futures', function(done) {
            stats.futures = [futures.THUNDERDOME, futures.EDEN];
            stats.save(function(err) {
                expect(err).toBe(null);
                expect(stats.toObject().futures).toEqual([futures.THUNDERDOME, futures.EDEN]);
                done();
            });
        });
    });
});