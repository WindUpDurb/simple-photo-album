"use strict";

var app = angular.module("photoAlbum", ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url : "/"
        });


    $urlRouterProvider.otherwise("/");
});