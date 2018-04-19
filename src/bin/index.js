#!/usr/bin/env node

const request = require('request');
const debug   = require('debug')('chicago-nodejs-meetup');
const pkg     = require('../../package.json');
const log     = console.log.bind(console);
const indent  = (num) => {
    return (new Array(num)).join(' ');
}

const program = require('commander')
    .name('chicago-nodejs-meetup')
    .version(pkg.version)
    .description(pkg.description)
    .option('-n, --next [n]',
        'View next <n> upcoming meetups for Chicago Node.js',
        parseFloat, 1)
    .parse(process.argv);

const url = 'https://api.meetup.com/chicago-nodejs/events?&sign=true&photo-host=public&page=' + program.next;
debug('Calling meetup API: %s', url);
request(url, (err, resp, rawBody) => {
    if (err) {
        debug('Error thrown in response: %s', err);
        return process.exit(1); // exit with error code
    }
    if (resp.statusCode !== 200) {
        debug('Error response code: %s', resp.statusCode);
        debug('Response body:', rawBody);
        return process.exit(1); // exit with error code
    }
    debug('Successful API response');
    const body = JSON.parse(rawBody);
    log(`Next ${body.length} events for Chicago Node.js meetup:`);
    log();
    body.map(event => {
        log(indent(2), event.name);
        log(indent(4), event.local_date, event.local_time);
        log(indent(4), '@', event.venue.name + ',', event.venue.address_1 + ',', event.venue.city);
        log(indent(4), event.link);
        log();
    });
    log('Hope to see you there!');
    log();
});
