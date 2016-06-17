angular.module('xeditable').factory('editableThemes', function() {
    var themes = {
        //default
        'default': {
            formTpl:      '<form class="editable-wrap"></form>',
            noformTpl:    '<span class="editable-wrap"></span>',
            controlsTpl:  '<span class="editable-controls"></span>',
            inputTpl:     '',
            errorTpl:     '<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:   '<span class="editable-buttons"></span>',
            submitTpl:    '<button type="submit">save</button>',
            cancelTpl:    '<button type="button" ng-click="$form.$cancel()">cancel</button>'
        },

        //bs2
        'bs2': {
            formTpl:     '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl:   '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',
            inputTpl:    '',
            errorTpl:    '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:  '<span class="editable-buttons"></span>',
            submitTpl:   '<button type="submit" class="btn btn-primary">好的</button>',
            cancelTpl:   '<button type="button" class="btn" ng-click="$form.$cancel()">'+
            '<span></span>'+
            '</button>'

        },

        //bs3
        'bs3': {
            formTpl:     '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl:   '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',
            inputTpl:    '',
            errorTpl:    '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:  '<span class="editable-buttons"></span>',
            submitTpl:   '<button type="submit" class="btn btn-primary">好</button>',
            cancelTpl:   '<button type="button" class="btn  editable-cancel-button" ng-click="$form.$cancel()">'+
            '放弃'+
            '</button>',

            //bs3 specific prop to change buttons class: btn-sm, btn-lg
            buttonsClass: '',
            //bs3 specific prop to change standard inputs class: input-sm, input-lg
            inputClass: '',
            postrender: function() {
                //apply `form-control` class to std inputs
                switch(this.directiveName) {
                    case 'editableText':
                    case 'editableSelect':
                    case 'editableTextarea':
                    case 'editableEmail':
                    case 'editableTel':
                    case 'editableNumber':
                    case 'editableUrl':
                    case 'editableSearch':
                    case 'editableDate':
                    case 'editableDatetime':
                    case 'editableBsdate':
                    case 'editableTime':
                    case 'editableMonth':
                    case 'editableWeek':
                    case 'editablePassword':
                        this.inputEl.addClass('form-control');
                        if(this.theme.inputClass) {
                            // don`t apply `input-sm` and `input-lg` to select multiple
                            // should be fixed in bs itself!
                            if(this.inputEl.attr('multiple') &&
                                (this.theme.inputClass === 'input-sm' || this.theme.inputClass === 'input-lg')) {
                                break;
                            }
                            this.inputEl.addClass(this.theme.inputClass);
                        }
                        break;
                    case 'editableCheckbox':
                        this.editorEl.addClass('checkbox');
                }

                //apply buttonsClass (bs3 specific!)
                if(this.buttonsEl && this.theme.buttonsClass) {
                    this.buttonsEl.find('button').addClass(this.theme.buttonsClass);
                }
            }
        },

        //semantic-ui
        'semantic': {
            formTpl:     '<form class="editable-wrap ui form" ng-class="{\'error\': $error}" role="form"></form>',
            noformTpl:   '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls ui fluid input" ng-class="{\'error\': $error}"></div>',
            inputTpl:    '',
            errorTpl:    '<div class="editable-error ui error message" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:  '<span class="mini ui buttons"></span>',
            submitTpl:   '<button type="submit" class="ui primary button">好的</button>',
            cancelTpl:   '<button type="button" class="ui button" ng-click="$form.$cancel()">'+
            '<i class="ui cancel icon"></i>'+
            '</button>'
        }
    };

    return themes;
});