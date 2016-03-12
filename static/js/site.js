// This file should contain the minimum amount of code necessary to make the site work.
// It should not require ES6 support.

"use strict";

var navLinks = document.querySelectorAll("li > a");

function parseFragment(url) {
    if (!url) {
        return null;
    }

    var i = url.lastIndexOf("#");
    if (i < 0) {
        return null;
    }

    return url.substring(i + 1);
}

function showPage(id) {
    id = parseFragment(id);
    if (!id) {
        throw "no page ID";
    }

    var nodeList = document.querySelectorAll("li > a");
    for (var i = 0; i < nodeList.length; i++) {
        var link = nodeList.item(i);
        var linkFragment = parseFragment(link.href);
        link.classList.toggle("selected", linkFragment === id);
    }

    nodeList = document.querySelectorAll(".page");
    var selectedPage = null;
    for (var i = 0; i < nodeList.length; i++) {
        var page = nodeList.item(i);
        if (page.id === id) {
            selectedPage = page;
            page.classList.toggle("hidden-when-wide", false);
        } else {
            page.classList.toggle("hidden-when-wide", true);
        }
    }

    if (!selectedPage) {
        // No page found with id.
        showPage(navLinks[0].href);
    } else if (!(id === parseFragment(window.location.hash))) {
        // A new page was selected, update the address bar.
        window.location.hash = id;
    }

}

function init() {
    window.addEventListener("hashchange", function (e) {
        showPage(window.location.hash);
    });

    if (window.location.hash) {
        showPage(window.location.hash);
    } else if (navLinks.length > 0) {
        var firstPage = navLinks[0].href;

        // Hide pages until the "redirect" takes effect.
        showPage(firstPage);

        // Select the first navlink by default.
        window.location.href = firstPage;
    }
}
init();


