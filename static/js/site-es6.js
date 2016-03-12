// ES6-specific code that can be ignored on unsupported browsers.
// The site will still work, but with limited functionality.

"use strict";

class Project {
    // Returns an array of Projects.
    static findAll() {
        var projectElems = document.querySelectorAll(".project");
        var projects = [];
        for (var i = 0; i < projectElems.length; i++) {
            projects.push(new Project(projectElems.item(i)));
        }
        return projects;
    }

    constructor(elem) {
        this.elem = elem;
        this.url = elem.querySelector(".project > a");
    }

    refreshUpdatedTime() {
        this.fetchUpdatedTime().then(updatedAt => {
            var timeElem = this.elem.querySelector("time");
            if (timeElem) {
                timeElem.innerText = `updated on ${updatedAt.toLocaleDateString()}`;
                timeElem.setAttribute("datetime", updatedAt.toISOString());
            }
        }).catch(e => console.log("error refreshing repo update time:", e));
    }

    // Returns a Promise of Date.
    fetchUpdatedTime() {
        if (!(this.url.hostname === "github.com")) {
            return Promise.reject(`unrecognized repo type: ${this.url}`);
        }

        var repoPath = this.url.pathname;
        var repoUrl = `https://api.github.com/repos${repoPath}`;
        console.log(`fetching repo details from: ${repoUrl}`);
        return fetch(repoUrl).then(resp => {
            if (!resp.ok) {
                throw resp;
            }
            return resp.json();
        }).then(info => {
            if (info.updated_at) {
                return new Date(info.updated_at);
            }
            throw ["invalid JSON response", info];
        });
    }
}


for (var p of Project.findAll()) {
    p.refreshUpdatedTime();
}
