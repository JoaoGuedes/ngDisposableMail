#ngDisposableMail
Disposable email validation for AngularJS

##Usage
Import **ngDisposableMail** module after angular

~~~html
<script src="ngDisposableMail.js"></script>
~~~
	
Inject **ngDisposableMail** into your main module

~~~javascript
angular.module("myApp", ["ngDisposableMail"])
~~~
Use the directive in a form field

~~~html
<form novalidate name="form">
	<input type="email" name="email" ng-model="user.email" ng-disposable-mail/>
</form>
<span ng-if="form.email.$error.disposable">Invalid domain!</span>
~~~

This is all you need to use this directive, the domain blacklist is fetched 
from <https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blacklist.conf>
	
##Optional configuration

####domainBlacklist
Add custom domains to blacklist

~~~html
<input type="email" name="email" ng-model="user.email" 
ng-disposable-mail domain-blacklist="['myowndomain1.com', 'domain2.com]">
~~~

####blacklistUrl and blacklistUrlParseFn
Use this URL for fetching disposable domains data.  
It must be used with a parsing function specified by **blacklistUrlParseFn**.

~~~html
<input type="email" name="email" ng-model="user.email" 
	ng-disposable-mail 
	domain-blacklist="http://www.invaliddomains.com/get"
	blacklist-url-parse-fn="fn(data)">
~~~

*E.g.*,

#####Controller

~~~javascript
angular.module("myApp", ["ngDisposableMail"])
    .controller("myController", ['$scope', function($scope) {
        
        $scope.fn = function(data) {
            return data.split('\n');
        };
        
        $scope.url = 'https://www.invaliddomains.com/get';
        
    }]);
~~~

#####HTML
~~~html
<input type="email" name="email" class="form-control" ng-model="user.email"
	ng-disposable-mail="" 
	blacklist-url="url" 
	blacklist-url-parse-fn="fn(data)">
~~~