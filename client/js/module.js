"use strict";

var app = angular.module("photoAlbum", ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url: "/"
        })
        .state("albumList", {
            url: "/albums",
            views : {
                "directoryContents": {
                    templateUrl: "/html/albumList.html",
                    controller: "albumsDirectoryController"

                },
                "body": {
                    templateUrl: "/html/albumList.body.html",
                    controller: "albumsDirectoryController"
                }
            }
        })
        .state("albumContents", {
            url: "/albums/:albumId",
            views: {
                "directoryContents": {
                    templateUrl: "/html/albumContents.collection.html",
                    controller: "albumContentsController"
                },
                "body": {
                    templateUrl: "/html/albumContents.body.html",
                    controller: "albumContentsController"
                }
            }
        })
        .state("photoInAlbum", {
            url: "/albums/:albumId/:photoId",
            views: {
                "directoryContents": {
                    templateUrl: "/html/albumContents.collection.html",
                    controller: "albumContentsController"
                },
                "body": {
                    templateUrl: "/html/albumContents.photo.html",
                    controller: "detailedPhotoController"
                }
            }
        })


    $urlRouterProvider.otherwise("/");
});