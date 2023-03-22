// ==UserScript==
// @name         sb.ltn.fi Time Saved Column
// @namespace    http://tampermonkey
// @version      1.1
// @description  Adds a "Time Saved" column to the video table on LTN site and populates it with the product of "Views" and "Length" columns for each row.
// @author       ChatGPT, NoMoreAngel
// @match        https://sb.ltn.fi/video/*
// @match        https://sb.ltn.fi/username/*
// ==/UserScript==

(function() {
    'use strict';

    // Find the table element
    var table = document.querySelector('.table-hover');

    // Find the header row and append a new cell with the "Time Saved" header
    var headerRow = table.querySelector('thead tr');
    var timeSavedHeader = document.createElement('th');
    timeSavedHeader.textContent = 'Time Saved';
    headerRow.appendChild(timeSavedHeader);

    // Find all the data rows and append a new cell with the product of "Views" and "Length"
    var dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach(function(row) {
        var views;
        var duration;
        var pathname = new URL(document.URL).pathname
         if (pathname.includes("/username/")) {
             views = parseInt(row.querySelector('td:nth-child(7)').textContent);
             duration = row.querySelector('td:nth-child(5)').textContent;
         } else {
             views = parseInt(row.querySelector('td:nth-child(6)').textContent);
             duration = row.querySelector('td:nth-child(4)').textContent;
         }
        var durationInSeconds = duration.split(':')
            .map(function(time) { return parseFloat(time); })
            .reduce(function(total, time) { return total * 60 + time; });
        var timeSaved = views * durationInSeconds;
        var timeSavedCell = document.createElement('td');
        timeSavedCell.textContent = formatTime(timeSaved);
        row.appendChild(timeSavedCell);
    });
    // Format the time in DD:HH:MM:SS format
    function formatTime(timeInSeconds) {
        const days = Math.floor(timeInSeconds / (24 * 60 * 60));
        const hours = Math.floor(timeInSeconds / (60 * 60)) % 24;
        const minutes = Math.floor(timeInSeconds / 60) % 60;
        const seconds = timeInSeconds % 60;
        const secondsrounded = Math.round(seconds * 1000) / 1000;

        let formattedTime = "";

        if (days > 0) {
            formattedTime += days + "d ";
        }

        if (hours > 0) {
            formattedTime += hours + "h ";
        }

        if (minutes > 0) {
            formattedTime += minutes + "m ";
        }

        formattedTime += secondsrounded + "s";

        return formattedTime;
    }
})();