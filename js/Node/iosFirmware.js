var util = require('util'),
    fs   = require('fs'),
    url  = require('url'),
    http = require('http');

// Config

var API_URL = 'http://api.ios.icj.me/firmwares.json';
var DOWNLOAD_PATH = 'C:\\iFirmwares\\'


// Do Stuff

// May the CodeGod have mercy on my puny soul.
    function parseAPIData( rawData ) {
        var raw = JSON.parse( rawData ),
            devices = raw[0].devices,
            latestFirms = [];
        
        for( var device in devices ) {
            var firmwares = devices[device].firmwares;
            latestFirms.push( firmwares[ firmwares.length - 1 ] );
        }
        
        return latestFirms;
    };
    function getFirmwares(callback) {
        var parsedUrl = url.parse(API_URL),
            options = {
                host: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.path
            };
    
        // Gets the JSON from the API.
        http.get(options, function(res) {
            res.setEncoding('utf8');
    
            var rawData = '';
    
            res.on('data', function(chunk) {
                rawData += chunk;
            });
    
            res.on('end', function(chunk) {
                var firmwares = null;
    
                // Get just the firmwares section of the JSON.
                try{
                    firmwares = parseAPIData( rawData ) ; //parseBadJSON(rawData);
                } catch(e) {
                    console.log("Failed to parse the JSON from the API: " + e.message);
                    process.exit(1);
                }
    
                callback(firmwares);
            });
        }).on('error', function(e) {
            console.log("Failed to get the last firmware: " + e.message);
            process.exit(1);
        });
    }

    function downloadFirmware(firmware, callback) {
        var filepath = DOWNLOAD_PATH + firmware.filename;
        var parsedFirmwareUrl = url.parse(firmware.url);
    
        var options = {
            host: parsedFirmwareUrl.hostname,
            port: parsedFirmwareUrl.port,
            path: parsedFirmwareUrl.path
        };
    
        // Makes the request to download the file.
        http.get(options, function(res) {
    
            var fileWriteStream = fs.createWriteStream(filepath);
    
            // Pumps the bytes from the internet into the file. (the internet is a series of tubes!)
            util.pump(res, fileWriteStream, function(e) {
                if (e) {
                    console.log('Failed to download firmware "' + firmware.filename + 
                        '": ' + e.message);
                    process.exit(1);
                }
            });
    
            res.on('end', function() {
                fileWriteStream.end();
                callback();
            });
        }).on('error', function(e) {
            console.log('Failed to download firmware: "' + firmware.filename +
                '": ' + e.message);
            process.exit(1);
        });
    }

    function downloadAllFirmwares(firmwares, callback) {
        var i = 0;
    
        var next = function() {
            var firmware = firmwares[i];
    
            console.log((i + 1) + '/' + firmwares.length + ' Downloading ' + firmware.filename + 
                ' (' + firmware.size +  ')...');
    
            downloadFirmware(firmware, next);
            i++;
        };
        next();
    }

console.log('Checking latest firmwares from the internet...');

    function checkLocalFirmwares( firmwares ) {
        if (DOWNLOAD_PATH[DOWNLOAD_PATH.length - 1] != '\\')
            DOWNLOAD_PATH += '\\';
    
        console.log('Checking local firmware files...');
    
        var firmwaresToDownload = [];
        // Quick hack to calculate total size.
        var totalMBSize = 0;
    
        for(var i = 0; i < firmwares.length; i++) {
            var firmware = firmwares[i];
            var filepath = DOWNLOAD_PATH + firmware.filename;
    
            try {
                var stats = fs.statSync(filepath)
            } catch(e) {
                // Firmware file doesn't exists locally. Add it to the list.
                firmwaresToDownload.push(firmware);
                totalMBSize += parseInt(firmware.size);
            }
        }
    
        // We now have a list of firmwares to download that don't exist locally. Yay!
        // Better check if the list actually CONTAINS something. :3
    
        if (firmwaresToDownload.length == 0) {
            // It doesn't. :(
            console.log('No need to do anything. Lastest firmwares already downloaded.');
            process.exit(0);
        }
    
        // We have some firmwares to download, let's go!
        console.log(firmwaresToDownload.length + ' firmwares to download, totalling ' + totalMBSize + ' MB.');
    
        downloadAllFirmwares(firmwaresToDownload, function() {
            console.log('Lastest firmwares downloaded.');
            process.exit(0);
        });
    }; 
getFirmwares( checkLocalFirmwares );