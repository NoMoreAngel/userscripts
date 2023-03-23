// ==UserScript==
// @name         sb.ltn.fi Time Saved Column
// @namespace    NMA
// @version      1.2
// @description  Adds a "Time Saved" column to the video table on LTN site and populates it with the product of "Views" and "Length" columns for each row.
// @author       ChatGPT, NoMoreAngel
// @match        https://sb.ltn.fi/*
// @updateURL    https://github.com/NoMoreAngel/userscripts/raw/main/sbltnfi/sbltnfi-time-saved-column.user.js
// @downloadURL  https://github.com/NoMoreAngel/userscripts/raw/main/sbltnfi/sbltnfi-time-saved-column.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the table element
    const table = document.querySelector('.table-hover');

    // Find the header row and append a new cell with the "Time Saved" header
    const timeSavedHeader = document.createElement('th');
    timeSavedHeader.textContent = 'Time Saved';
    const headers = [...document.querySelectorAll("thead th")]
    const headerNames = headers.map(item => item.textContent.trim());
    const lengthIndex = headerNames.indexOf("Length")
    const viewsIndex = headerNames.indexOf("Views")
    headers[viewsIndex].after(timeSavedHeader);
    function addColumn() {
        // Find all the data rows and append a new cell with the product of "Views" and "Length"
        table.querySelectorAll('tbody tr').forEach(row => {
            if (row.querySelector('td.time-saved')) return
            const views = parseInt(row.children[viewsIndex].textContent);
            const duration = row.children[lengthIndex].textContent
                .split(':')
                .map(time => parseFloat(time))
                .reduce((total, time) => total * 60 + time );
            const timeSaved = views * duration;
            const timeSavedCell = document.createElement('td');
            timeSavedCell.classList.add("time-saved")
            timeSavedCell.textContent = formatTime(timeSaved);
            row.children[viewsIndex].after(timeSavedCell);
        });
    }
    addColumn()
    document.addEventListener("newSegments", (e) => addColumn());

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
