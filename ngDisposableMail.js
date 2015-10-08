"use strict";

angular.module("ngDisposableMail", [])
    .directive("ngDisposableMail", function($http) {
                
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                domainBlacklist: '=',
                blacklistUrl: '=url',
                blacklistUrlParseFn: '&'
            },
            controller: function($scope) {
                $scope.getBlacklist = function(url, parseCb) {
                    var get_url = url || 'https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blacklist.conf';
                    return $http.get(get_url)
                        .then(function(response) {
                            return parseCb ? parseCb({ data: response.data }) : response.data.split('\n');
                        });
                }; 
            },
            link: function(scope, element, attrs, ngModel) {
                var parsed_domain,
                    blacklist = [],
                    domain_regex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-.]+)$/g;
                    
                scope.domainBlacklist = scope.domainBlacklist || [];
                
                scope.blacklistUrlParseFn = attrs.blacklistUrlParseFn ? scope.blacklistUrlParseFn : undefined;
                scope.getBlacklist(scope.url, scope.blacklistUrlParseFn)
                    .then(function(list) {
                        if (list && list.constructor === Array) {
                            blacklist = list.concat(scope.domainBlacklist);
                        }
                    });
                    
                ngModel.$parsers.push(function(value) {
                    var parsed_domain;
                    while (parsed_domain = domain_regex.exec(value)) {
                        if (blacklist.indexOf(parsed_domain[1]) !== -1) {
                            ngModel.$setValidity("disposable", false);
                            return true;
                        }
                    }
                    ngModel.$setValidity("disposable", true);
                    return false;
                });
            }
        }; 
});