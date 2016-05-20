"use strict";

var app = angular.module("photoAlbum", ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url : "/"
        });


    $urlRouterProvider.otherwise("/");
});
"use strict";

var app = angular.module("photoAlbum");

app.controller("mainController", function () {
    console.log("Main Controller");
});
"use strict";

var app = angular.module("photoAlbum");

app.service("someService", function () {

});
