'use strict';

/* App Module */

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'entriesControllers',
    'entriesServices',
    'ui.sortable'
]);

kanbanApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/entries', {
            templateUrl: 'partials/entries.html',
            controller: 'EntriesCtrl'
        }).when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TasksCtrl'
        }).otherwise({
            templateUrl: 'partials/entries.html',
            controller: 'EntriesCtrl'
        });
    }]);
