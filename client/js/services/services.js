"use strict";

var app = angular.module("photoAlbum");

app.service("AlbumServices", function ($http) {

    this.getAlbumList = function () {
        return $http.get("/api/albums/")
    };

    this.createNewAlbum = function (newAlbumData) {
        return $http.post("/api/albums/", newAlbumData)
    };
    
    this.retrieveAlbum = function (albumId) {
        return $http.get(`/api/albums/${albumId}`);
    };

    this.addImageToAlbum = function (albumData) {
        return $http.put("/api/albums/addImage", albumData);
    }

});

app.service("ImageServices", function ($http) {

    this.uploadNewImage = function (imageToUpload) {
        return $http.post("/api/images/", imageToUpload);
    };
    
    this.retrievePhotoData = function (photoId) {
        return $http.get(`/api/images/${photoId}`);
    };
    
    this.submitPhotoUpdates = function (updatedData) {
        return $http.put("/api/images/updateImage", updatedData);
    };
    
    this.deletePhoto = function (imageToDelete) {
        return $http.delete("/api/images/deleteImage", imageToDelete);
    }

});


