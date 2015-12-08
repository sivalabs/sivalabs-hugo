---
author: siva
comments: true
date: 2014-09-05 13:08:00+00:00
layout: post
slug: angularjs-introducing-modules-controllers-services
title: 'AngularJS: Introducing modules, controllers, services'
wordpress_id: 215
categories:
- AngularJS
tags:
- AngularJS
---

In my previous post [**AngularJS Tutorial: Getting Started with AngularJS**](http://www.sivalabs.in/2014/09/angularjs-tutorial-getting-started-with.html) we have seen how to setup an application using SpringBoot + AngularJS + WebJars. But it's a kind of quick start tutorial where I haven't explained much about AngularJS modules, controllers and services. Also it is a single screen (only one route) application.

In this part-2 tutorial, we will take a look at what are Angular modules, controllers and services and how to configure and use them. Also we will look into how to use **ngRoute** to build multi-screen application.

If we take a look at the code that we developed in previous post, especially in **controllers.js**, we clubbed the client side controller logic and business logic(of-course we don't have any biz logic here :-)) in our Controllers which is not good.

_As java developers we get used to have dozen layers and we love making things complex and complain Java is complex. But here in AngularJS things looks simpler, let's make things little bit complex. I am just kidding :-)_


<blockquote>Even if you put all your logic in single place as we did in **controllers.js**, it will work and acceptable for simple applications. But if you are going to develop large enterprise application (who said enterprise applications should be large...hmm..ok..continue..) then things quickly become messy. And believe me working with a messy large JavaScript codebase is lot more painful than messy large Java codebase. So it is a good idea to separate the business logic from controller logic.</blockquote>


In AngularJS we can organize application logic into modules and make them work together using dependency injection. Lets see how to create a module in AngularJS.

**var myModule = angular.module('moduleName',['dependency1','dependency2']);**

This is how we can create a module by using angular.module() function by passing the module name and specifying a list of dependencies if there are any.

Once we define a module we can get handle of the module as follows:

**var myModule = angular.module('moduleName');**


<blockquote>_Observe that there is no second argument here which means we are getting the reference of a predefined angular module. If you include the second argument, which is an array, then it means you are defining the new module._</blockquote>


Once we define a new module we can create controllers in that module as follows:

module.controller('ControllerName',['dependency1','dependency2', function(dependency1, dependency2){
//logic
}]);

For example, lets see how we to create **TodoController**.

var myApp = angular.module('myApp',['ngRoute']);
myApp.controller('TodoController',['$scope','$http',function($scope,$http){
//logic
}]);

Here we are creating **TodoController** and providing **$scope** and **$http** as dependencies which are built-in angularjs services.

We can also create the same controller as follows:
myApp.controller('TodoController',function($scope,$http){
//logic
});

Observe that we are directly passing a function as a second argument instead of an array which has an array of dependencies followed by a function which takes the same dependencies as arguments and it works exactly same as array based declaration.

**But why do we need to do more typing when both do the same thing??**

AngularJS injects the dependencies by name, that means when you define $http as a dependency then AngularJS looks for a registered service with name '**$http**'. But majority of the real world applications use JavaScript code minification tools to reduce the size. Those tools may rename your variables to short variable names.

For example:
myApp.controller('TodoController',function($scope,$http){
//logic
});

The preceding code might be minified into:
myApp.controller('TodoController',function($s,$h){
//logic
});

Then AngularJS tries to look for registered services with names **$s** and **$h** instead of **$scope** and **$http** and eventually it will fail. To overcome this issue we define the names of services as string literals in array and specify the same names as function arguments. With this even after JavaScript minifies the function argument names, string literals remains same and AngularJS picks right services to inject.

That means you can write the controller as follows:

myApp.controller('TodoController',['$scope','$http',function($s,$h){
//here $s represents $scope and $h represents $http services
}]);


<blockquote>**So always prefer to use array based dependencies approach.**</blockquote>


Ok, now we know how to create controllers. Lets see how we can add some functionality to our controllers.

Here in our **TodoController** we defined a variable **todos** which initially holds an empty array and we defined **loadTodos()** function which loads todos from RESTful services using **$http.get()** and once response received we are setting the todos array to our **todos** variable. Simple and straight forward.

**Why can't we directly assign the response of $http.get() to our todos variable like todoCtrl.todos = $http.get('/todos.json');??**

Because **$http.get('/todos.json')** returns a **promise**, not actual response data. So you have to get data from success handler function. Also note that if you want to perform any logic after receiving data from **$http.get()** you should put your logic inside success handler function only.

For example if you are deleting a Todo item and then reload the todos you should **NOT** do as follows:

$http.delete('/todos.json/1').success(function(data){
//hurray, deleted
}).error(function(){
alert('Error in deleting Todo');
});
todoCtrl.loadTodos();

Here you might assume that after delete is done it will **loadTodos()** and the deleted Todo item won't show up, but that won't work like that. You should do it as follows:

$http.delete('/todos.json/1').success(function(data){
//hurray, deleted
todoCtrl.loadTodos();
}).error(function(){
alert('Error in deleting Todo');
});

Lets move on to how to create AngularJS services. Creating services is also similar to controllers but AngularJS provides multiple ways for creating services.
There are 3 ways to create AngularJS services:



	
  * Using **module.factory()**

	
  * Using **module.service()**

	
  * Using **module.provider()**


**Using module.factory()**
We can create a service using **module.factory()** as follows:
[gist https://gist.github.com/sivaprasadreddy/b264fd883424a895c9e7 /]

**Using module.service()**
We can create a service using **module.service()** as follows:
[gist https://gist.github.com/sivaprasadreddy/42bd33585fc34b9fa6b7 /]

**Using module.provider()**
We can create a service using **module.provider()** as follows:
[gist https://gist.github.com/sivaprasadreddy/522fb12b3e4b22c1d0ca /]

You can find good documentation on which method is appropriate in which scenario at [http://www.ng-newsletter.com/advent2013/#!/day/1](http://www.ng-newsletter.com/advent2013/#!/day/1).

Let us create a **TodoService **in our **services.js** file as follows:
[gist https://gist.github.com/sivaprasadreddy/746449a4623d12cf37d1 /]

Now inject our **TodoService **into our **TodoController **as follows:
[gist https://gist.github.com/sivaprasadreddy/c9ef496493fdf42f4bf8 /]

Now we have separated our controller logic and business logic using AngularJS controllers and services and make them work together using Dependency Injection.

In the beginning of the post I said we will be developing a multi-screen application demonstrating **ngRoute** functionality.
In addition to Todos, let us add PhoneBook feature to our application where we can maintain list of contacts.

First, let us build the back-end functionality for PhoneBook REST services.

Create Person JPA entity, its Spring Data JPA repository and Controller.
[gist https://gist.github.com/sivaprasadreddy/0742b57bad46fa3809e6 /]

Now let us create AngularJS service and controller for Contacts. Observe that we will be using **module.service()** approach this time.
[gist https://gist.github.com/sivaprasadreddy/8a1744e0696fbdaa9375 /]

Now we need to configure our application routes in **app.js** file.
[gist https://gist.github.com/sivaprasadreddy/9b35955454f750ed7911 /]

Here we have configured our application routes on **$routeProvider** inside **myApp.config()** function.
When url matches with any of the routes then corresponding template content will be rendered in **<div ng-view></div>** div in our **index.html**.

If the url doesn't match with any of the configured urls then it will be routed to '**home**' as specified in **otherwise()** configuration.

Our **templates/home.html** won't have anything for now and **templates/todos.html** file will be same as **home.html** in previous post.

The new** templates/contacts.html** will just have a table listing contacts as follows:
[gist https://gist.github.com/sivaprasadreddy/0e7ea5f70a00f5e2a088 /]

Now let us create navigation links to Todos, Contacts pages in our **index.html** page **<body>**.
[gist https://gist.github.com/sivaprasadreddy/d477e4fadcf3dc3ec28f /]

By now we have a multi-screen application and we understood how to use modules, controllers and services.
You can find the code for this article at [https://github.com/sivaprasadreddy/angularjs-samples/tree/master/angularjs-series/angularjs-part2](https://github.com/sivaprasadreddy/angularjs-samples/tree/master/angularjs-series/angularjs-part2)

Our next article would be on how to use **$resource** instead of **$http** to consume REST services. 
Also we will look update our application to use more powerful **ui-router** module instead of **ngRoute**. Stay tuned :-).
