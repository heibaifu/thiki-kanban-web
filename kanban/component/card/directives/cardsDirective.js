/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cards', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/cards.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'cardsServices', 'localStorageService', 'assignmentServices', 'timerMessageService', 'advancedFilterFactory', '$filter', function ($scope, $routeParams, cardsServices, localStorageService, assignmentServices, timerMessageService, advancedFilterFactory, $filter) {
            $scope.loadCards = function () {
                var stage = $scope.stage;
                $scope.cards = stage.cardsNode === undefined ? [] : stage.cardsNode.cards;
                $scope.cards = $filter('orderBy')($scope.cards, 'sortNumber');
                $scope.disableSortable = false;
                $scope.sortableOptions = {
                    connectWith: ".cards-sortable",
                    opacity: 0.5,
                    placeholder: "card-drag-placeholder",
                    update: function (e, ui) {
                        if (ui.item.sortable.received) {
                            return;
                        }
                        var targetStage = JSON.parse(ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("stageClone"));

                        var droptargetModelCards = ui.item.sortable.droptargetModel;
                        var sourceStage = ui.item.sortable.model.stage;
                        if (targetStage !== null && sourceStage.id !== targetStage.id && targetStage.wipLimit === droptargetModelCards.length) {
                            timerMessageService.confirmMessage("目标环节在制品已经满额，不再接受卡片。", 'warning');
                            ui.item.sortable.cancel();
                        }
                        var movedCard = ui.item.sortable.sourceModel[ui.item.sortable.index];
                        //Moving to inProcess stage
                        if (targetStage !== null && targetStage.inProcess && movedCard.deadline === undefined) {
                            timerMessageService.confirmMessage("卡片未设置截止日期，不允许进入处理环节。", 'warning');
                            ui.item.sortable.cancel();
                            return;
                        }
                        if (targetStage !== null && targetStage.inDoneStatus && (movedCard.acceptanceCriteriasNode === undefined || movedCard.acceptanceCriteriasNode.acceptanceCriterias.length === 0)) {
                            timerMessageService.confirmMessage("卡片尚未设置验收标准，不允许进入完成环节。", 'warning');
                            ui.item.sortable.cancel();
                            return;
                        }
                        //Moving to doneStage
                        if (targetStage !== null && targetStage.inDoneStatus) {
                            if (movedCard.acceptanceCriteriasNode !== undefined) {
                                for (var index in movedCard.acceptanceCriteriasNode.acceptanceCriterias) {
                                    if (!movedCard.acceptanceCriteriasNode.acceptanceCriterias[index].finished) {
                                        timerMessageService.confirmMessage("当前卡片有验收标准尚未完成，不允许进入完成环节。", 'warning');
                                        ui.item.sortable.cancel();
                                        return;
                                    }
                                    if (movedCard.acceptanceCriteriasNode.acceptanceCriterias[index].isPassed === 0) {
                                        timerMessageService.confirmMessage("当前卡片尚有验收标准未验收，不允许进入完成环节。", 'warning');
                                        ui.item.sortable.cancel();
                                        return;
                                    }
                                    if (movedCard.acceptanceCriteriasNode.acceptanceCriterias[index].isPassed === -1) {
                                        timerMessageService.confirmMessage("当前卡片尚有验收标准未通过验收，不允许进入完成环节。", 'warning');
                                        ui.item.sortable.cancel();
                                        return;
                                    }
                                }
                            }
                        }
                    },
                    stop: function (e, ui) {
                        $('.cards-sortable').sortable('refresh');
                        var droptarget = ui.item.sortable.droptarget;
                        if (droptarget !== undefined && !ui.item.sortable.isMoveToParent) {
                            var sourceModelCards = ui.item.sortable.sourceModel;
                            var droptargetModelCards = ui.item.sortable.droptargetModel;
                            var sourceStageId = ui.item.sortable.source.parent().parent().attr("stageId");
                            var targetStageId = ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("stageId");
                            for (var index in sourceModelCards) {
                                sourceModelCards[index].sortNumber = index;
                            }
                            if (sourceStageId !== targetStageId) {
                                for (var cardIndex in droptargetModelCards) {
                                    droptargetModelCards[cardIndex].sortNumber = cardIndex;
                                    droptargetModelCards[cardIndex].stageId = targetStageId;
                                }
                            }
                            var cards = sourceModelCards;
                            cards = cards.concat(droptargetModelCards);
                            var movementLink = JSON.parse(ui.item.sortable.droptarget.parent().parent().attr("stageClone")).cardsNode._links.movement.href;
                            var loadingInstance = timerMessageService.loading();
                            cardsServices.move(cards, movementLink).then(function () {
                            }).finally(function () {
                                timerMessageService.close(loadingInstance);
                            });
                        }
                    },
                    cancel: ".not-sortable"
                };
            };

            $scope.commentCount = 0;
            $scope.loadCards();
            $scope.closeLoading = function () {
                timerMessageService.close($scope.loadingInstance);
            };
            $scope.$watch('cards', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.stage.cardsCount = newValue.length;
            });

            $scope.$watch(function () {
                return advancedFilterFactory.getFilter();
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.filter = advancedFilterFactory.getFilter();
            }, true);
            $scope.$watch(function () {
                return localStorageService.get("isCardDragging");
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.isCardDragging = localStorageService.get("isCardDragging");
            }, true);
        }]
    };
});
