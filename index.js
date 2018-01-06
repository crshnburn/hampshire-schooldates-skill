/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const ical = require('ical');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const icalUrl = 'https://www.hants.gov.uk/api/sitecore/SchoolDates/DownloadIcsFile?id=%7B9133CB3C-33A7-485D-92A0-63D6EC5DFEDF%7D';

const APP_ID = 'amzn1.ask.skill.d1a41c0a-31eb-44f6-9fae-ec07946a1ee4';

const handlers = {
    'StartTerm': function () {
        let self = this;
        ical.fromURL(icalUrl, {}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let now = Date.now();
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        let event = data[k];
                        if (event.summary.endsWith('term')) {
                            if (now > Date.parse(event.start) && now < Date.parse(event.end)) {
                                const speechOutput = 'Currently in ' + event.summary + ' that started on ' + event.start.getDate() + ' ' + months[event.start.getMonth()];
                                self.emit(':tell', speechOutput);
                                break;
                            } else if (now < Date.parse(event.start)) {
                                const speechOutput = 'Next term is ' + event.summary + ' that starts on ' + event.start.getDate() + ' ' + months[event.start.getMonth()];
                                self.emit(':tell', speechOutput);
                                break;
                            }
                        }
                    }
                }
            }
        });
    },
    'EndTerm': function () {
        let self = this;
        ical.fromURL(icalUrl, {}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let now = Date.now();
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        let event = data[k];
                        if(event.summary.endsWith('term')) {
                            if (now < Date.parse(event.end)) {
                                const speechOutput = event.summary + ' ends on ' + event.end.getDate() + ' ' + months[event.end.getMonth()];
                                self.emit(':tell', speechOutput);
                                break;
                            }
                        }
                    }
                }
            }
        });
    },
    'HalfTerm': function () {
        let self = this;
        ical.fromURL(icalUrl, {}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let now = Date.now();
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        let event = data[k];
                        if(event.summary.indexOf('half-term') != -1) {
                            if (now < Date.parse(event.start)) {
                                const speechOutput = event.summary + ' starts on ' + event.start.getDate() + ' ' + months[event.start.getMonth()];
                                self.emit(':tell', speechOutput);
                                break;
                            }
                        }
                    }
                }
            }
        });
    },
    'EasterHols': function () {
        let self = this;
        ical.fromURL(icalUrl, {}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        let event = data[k];
                        if(event.summary.indexOf('Easter') != -1) {
                            const speechOutput = 'The Easter holidays start on ' + event.start.getDate() + ' ' + months[event.start.getMonth()] + ' until ' + event.end.getDate() + ' ' + months[event.end.getMonth()];
                            self.emit(':tell', speechOutput);
                            break;
                        }
                    }
                }
            }
        });
    },
    'AMAZON.HelpIntent': function () {
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};