'use strict';

var mongoose = require('mongoose');
var Progress = require('../../models/Progress');
var futures = require('../../futures');

mongoose.connect('mongodb://localhost/test');


describe('model/Progress', function() {
    
    var progress;
    
    beforeEach(function() {
        progress = new Progress();
        progress._id = mongoose.Types.ObjectId();
    });
    
    afterEach(function(done) {
        Progress.collection.remove({}, done);
    });
    
    
    
    describe('futures', function() {
        
        
        it('should default to ["norm"]', function(done) {
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().futures).toEqual(['norm']);
                done();
            });
        });
        
        it('should become an empty array if set to an invalid value', function(done) {
            progress.futures = {1: 'lala'};
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().futures).toEqual([]);
                done();
            });
        });
        
        it('should filter out invalid futures from the array', function(done) {
            progress.futures = ['not', 'a', 'future', '', 1, 0, -1, {}];
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().futures).toEqual([]);
                done();
            });
        });
        
        it('should remove duplicates', function(done) {
            progress.futures = [futures.THUNDERDOME, futures.THUNDERDOME];
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().futures).toEqual([futures.THUNDERDOME]);
                done();
            });
        });
        
        it('should accept valid futures', function(done) {
            progress.futures = [futures.THUNDERDOME, futures.EDEN];
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().futures).toEqual([futures.THUNDERDOME, futures.EDEN]);
                done();
            });
        });
    });
    
    
    describe('loyalty', function() {
        
        it('should default to undefined', function(done) {
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().loyalty).toEqual(undefined);
                done();
            });
        });
        
        it('should accept string number pairs', function(done) {
            progress.loyalty = {'bob': 1, 'sally': 2};
            progress.save(function(err) {
                expect(err).toBe(null);
                expect(progress.toObject().loyalty).toEqual({'bob': 1, 'sally': 2});
                done();
            });
        });
        
        it('should reject non-numeric values', function(done) {
            progress.loyalty = {'bob': 1, 'sally': 2, 'phill': [1,2,3]};
            progress.save(function(err) {
                expect(err).toBeTruthy();
                done();
            });
        });
        
        it('should reject values greater than 5', function(done) {
            progress.loyalty = {'bob': 6};
            progress.save(function(err) {
                expect(err).toBeTruthy();
                done();
            });
        });
        
        it('should reject values less than or equal to 0', function(done) {
            progress.loyalty = {'bob': 0};
            progress.save(function(err) {
                expect(err).toBeTruthy();
                done();
            });
        });
    });
});