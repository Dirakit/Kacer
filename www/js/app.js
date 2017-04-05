// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('kacer', ['ionic', 'ionic-material', 'controllers', 'services',
          'angular-svg-round-progressbar', 'ngMQTT']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
})

app.config(function(MQTTProvider){
  var options = {
      protocol : "wss",
      host     : "      .messaging.internetofthings.ibmcloud.com",
      port     : "8883",
      username : " ",
      password : " ",
      clientId : " ",
      clean    : false
  };

  MQTTProvider.setOptions(options);
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'pages/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.power', {
      url: '/power',
      views: {
        'tab-power': {
          templateUrl: 'pages/tab-power.html',
          controller: 'PowerCtrl'
        }
      }
    })

    .state('tab.light', {
      url: '/light',
      views: {
        'tab-light': {
          templateUrl: 'pages/tab-light.html',
          controller: 'LightCtrl'
        }
      }
    })

    .state('tab.temp', {
        url: '/temp',
        views: {
          'tab-temp': {
            templateUrl: 'pages/tab-temp.html',
            controller: 'TempCtrl'
          }
        }
      })

      .state('tab.feeder', {
        url: '/feeder',
        views: {
          'tab-feeder': {
            templateUrl: 'pages/tab-feeder.html',
            controller: 'FeederCtrl'
          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/power');
});
