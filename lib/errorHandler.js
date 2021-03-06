'use strict'
var express = require('express');
/*
var accepts = require('accepts');
var escapeHtml = require('escape-html');
var fs = require('fs');
var util = require('aws-sdk/lib/util.js');
var config = require('../../../config');

var doubleSpaceGlobalRegExp = /  /g
var inspect = util.inspect;
var newLineGlobalRegExp = /\n/g
var toString = Object.prototype.toString

/* istanbul ignore next * /
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

var dsErrorHandler = function(options){
    // get environment
  var env = process.env.NODE_ENV || 'development';

  // get options
  var opts = options || {}

  // get log option
  var log = opts.log === undefined
    ? env !== 'test'
    : opts.log

  if (typeof log !== 'function' && typeof log !== 'boolean') {
    throw new TypeError('option log must be function or boolean')
  }

  // default logging using console.error
  if (log === true) {
    log = logerror
  }

  return function errorHandler(err, req, res, next){
    // respect err.statusCode
    if (err.statusCode) {
      res.statusCode = err.statusCode
    }

    // respect err.status
    if (err.status) {
      res.statusCode = err.status
    }

    if(config.system.sendError === true){
        var email 	= require("emailjs/email.js");
        var server 	= email.server.connect(config.email.server);

        server.send({
            text:    err.stack,
            from:    config.email.from,
            to:      config.system.developers.join(','),
            cc:      '',
            subject: 'TAPLY: ' + err.message
         }, function(err, message) { });
     }

    // default status code to 500
    if (res.statusCode < 400) {
      res.statusCode = 500
    }

    // log the error
    var str = stringify(err)
    if (log) {
      defer(log, err, str, req, res)
    }

    // cannot actually respond
    if (res._header) {
      return req.socket.destroy()
    }

    if(config.system.useJsonOutput === true){
        var error = { message: err.message, stack: err.stack };
        for (var prop in err) error[prop] = err[prop];
        var json = JSON.stringify({ error: error });
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(json);
    }else{
        // negotiate
        var accept = accepts(req)
        var type = accept.type('html', 'json', 'text')

        // Security header for content sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff')

        // html
        if (type === 'html') {
            fs.readFile(__dirname + '/public/style.css', 'utf8', function(e, style){
                if (e) return next(e);
                fs.readFile(__dirname + '/public/error.html', 'utf8', function(e, html){
                    if (e) return next(e);
                    var isInspect = !err.stack && String(err) === toString.call(err)
                    var errorHtml = !isInspect
                      ? escapeHtmlBlock(str.split('\n', 1)[0] || 'Error')
                      : 'Error'
                    var stack = !isInspect
                      ? String(str).split('\n').slice(1)
                      : [str]
                    var stackHtml = stack
                      .map(function (v) { return '<li>' + escapeHtmlBlock(v) + '</li>' })
                      .join('')
                    var body = html
                      .replace('{style}', style)
                      .replace('{stack}', stackHtml)
                      .replace('{title}', escapeHtml(exports.title))
                      .replace('{statusCode}', res.statusCode)
                      .replace(/\{error\}/g, errorHtml)
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    res.end(body)
                });
            });
        // json
        } else if (type === 'json') {
            var error = { message: err.message, stack: err.stack };
            for (var prop in err) error[prop] = err[prop];
            var json = JSON.stringify({ error: error });
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(json);
        // plain text
        } else {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end(str)
        }
    };
  };
};
dsErrorHandler.prototype = new express.errorHandler();


function logerror(err, str) {
    console.error(str)
}

function escapeHtmlBlock(str) {
  return escapeHtml(str)
  .replace(doubleSpaceGlobalRegExp, ' &nbsp;')
  .replace(newLineGlobalRegExp, '<br>')
}

/**
 * Stringify a value.
 * @api private
 * /

function stringify(val) {
  var stack = val.stack

  if (stack) {
    return String(stack)
  }

  var str = String(val)

  return str === toString.call(val)
    ? inspect(val)
    : str
}
*/

module.exports = express.errorHandler;

