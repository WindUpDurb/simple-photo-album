"use strict";

var app = angular.module("photoAlbum", ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url: "/",
            views: {
                "body": {
                    templateUrl: "/html/home.body.html"
                }
            }
        })
        .state("userProfile", {
            url: "/userProfile",
            views: {
                "body": {
                    templateUrl: "/html/userProfile.body.html"
                }
            }
        })
        .state("allImages", {
            url: "/allImages",
            views: {
                "directoryContents": {
                    templateUrl: "/html/photoList.html",
                    controller: "photoListController"
                }
            }
        })
        .state("detailedImage", {
            url: "/allImages/:photoId",
            views: {
                "directoryContents": {
                    templateUrl: "/html/photoList.html",
                    controller: "photoListController"
                },
                "body": {
                    templateUrl: "/html/photoList.detailed.html",
                    controller: "photoListController"
                }
            }
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
"use strict";

var app = angular.module("photoAlbum");

app.controller("mainController", function () {
    console.log("Main Controller");
});

app.controller("albumContentsController", function ($scope, $state, AlbumServices, ImageServices, $stateParams) {
    console.log("Album Contents Controller");
    AlbumServices.retrieveAlbum($stateParams.albumId)
        .then(function (response) {
           $scope.currentAlbum = response.data;
            console.log($scope.currentAlbum)
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });

    $scope.deleteAlbum = function () {
        var toDelete = {
            _id: $stateParams.albumId
        };

        AlbumServices.deleteAlbum(toDelete)
            .then(function (response) {
                $state.go("albumList");
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };

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
                $state.go("albumList");
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

app.controller("albumsDirectoryController", function ($scope, $state, AlbumServices) {
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
                $state.go("albumList");
                $scope.newAlbum = null;
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


"use strict";

var app = angular.module("photoAlbum");

app.service("AlbumServices", function ($http) {

    this.deleteAlbum = function (albumId) {
        return $http.put("/api/albums/deleteAlbum", albumId);
    };

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

    this.retrieveAllPhotos = function () {
        return $http.get("/api/images/");
    }

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


