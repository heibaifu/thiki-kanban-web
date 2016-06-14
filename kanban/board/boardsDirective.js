/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('boardBanner', function () {
    return {
        restrict: 'E',
        templateUrl: 'board/partials/board-banner.html',
        replace: false,
        controller: ['$scope', '$routeParams', '$location', 'boardsService', function ($scope, $routeParams, $location, boardsService) {
            var boardLink = $routeParams.boardLink;

            var boardPromise = boardsService.loadBoardByLink(boardLink);
            boardPromise.then(function (_board) {
                $scope.board = _board;
            });
            $scope.toBoards = function () {
                $location.path('/boards');
            };
        }]
    };
});
