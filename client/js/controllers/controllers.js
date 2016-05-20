"use strict";

var app = angular.module("photoAlbum");

app.controller("mainController", function () {
    console.log("Main Controller");
});

app.controller("albumContentsController", function ($scope, AlbumServices, ImageServices, $stateParams) {
    console.log("Album Contents Controller");
    AlbumServices.retrieveAlbum($stateParams.albumId)
        .then(function (response) {
           $scope.currentAlbum = response.data;
            console.log($scope.currentAlbum)
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });

    $scope.uploadImageToAlbum = function () {
        var imageToUpload = angular.copy($scope.uploadPhoto);
        ImageServices.uploadNewImage(imageToUpload)
            .then(function (response) {
                var newlyUploadedPhoto = response.data;
                var toSend = {};
                toSend.imageId = newlyUploadedPhoto._id;
                toSend.albumToAddId = $stateParams.albumId;
                return AlbumServices.addImageToAlbum(toSend);
            })
            .then(function (response) {
                console.log("Added: ", response.data)
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };
});

app.controller("detailedPhotoController", function ($scope, $state, $stateParams, ImageServices) {
    console.log("Detailed Photo Controller");
    
    ImageServices.retrievePhotoData($stateParams.photoId)
        .then(function (response) {
            $scope.currentImage = response.data;
        })
        .catch(function (error) {
            console.log("Error: ", error);
        })

    $scope.submitPhotoEdits = function () {
        var toUpdateWith = $scope.updatedData;
        console.log("To update: ", toUpdateWith)
        toUpdateWith._id = $stateParams.photoId;

        ImageServices.submitPhotoUpdates(toUpdateWith)
            .then(function (response) {
                $scope.currentImage.photoTitle = response.data.photoTitle;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };
    
    $scope.deletePhoto = function () {
        var imageData = {
            _id: $stateParams.photoId,
            albumIn: $stateParams.albumId
        };

        ImageServices.deletePhoto(imageData)
            .then(function (response) {
                $state.go("albumContents", { albumId: $stateParams.albumId});
            })
            .catch(function (error) {
                if (error) console.log(error);
            })


    }

});

app.controller("albumsDirectoryController", function ($scope, AlbumServices) {
    console.log("Album Directory Controller");

    AlbumServices.getAlbumList()
        .then(function (response) {
            $scope.albumList = response.data;
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });

    $scope.createNewAlbum = function () {
        AlbumServices.createNewAlbum($scope.newAlbum)
            .then(function (response) {
                $scope.albumList.push(response.data);
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };
});

app.controller("photoListController", function ($scope, $stateParams, ImageServices) {
    console.log("Photo List Controller");
    
    ImageServices.retrieveAllPhotos()
        .then(function (response) {
            $scope.photoList = response.data;
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });

    if ($stateParams.photoId) {
        ImageServices.retrievePhotoData($stateParams.photoId)
            .then(function (response) {
                $scope.currentImage = response.data;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    }


});

