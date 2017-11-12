---
title: 'AngularJS: Introducing modules, controllers, services'
author: Siva
type: post
date: 2014-09-05T07:38:00+00:00
url: /2014/09/angularjs-introducing-modules-controllers-services/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/09/angularjs-introducing-modules.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/5010840770376570939
post_views_count:
  - 33
categories:
  - JavaScript
tags:
  - AngularJS

---
In my previous post [**AngularJS Tutorial: Getting Started with AngularJS**][1] we have seen how to setup an application using SpringBoot + AngularJS + WebJars. But it&#8217;s a kind of quick start tutorial where I haven&#8217;t explained much about AngularJS modules, controllers and services. Also it is a single screen (only one route) application.

In this part-2 tutorial, we will take a look at what are Angular modules, controllers and services and how to configure and use them. Also we will look into how to use **ngRoute** to build multi-screen application.

If we take a look at the code that we developed in previous post, especially in **controllers.js**, we clubbed the client side controller logic and business logic(of-course we don&#8217;t have any biz logic here :-)) in our Controllers which is not good.

_As java developers we get used to have dozen layers and we love making things complex and complain Java is complex. But here in AngularJS things looks simpler, let&#8217;s make things little bit complex. I am just kidding 🙂_

> Even if you put all your logic in single place as we did in **controllers.js**, it will work and acceptable for simple applications. But if you are going to develop large enterprise application (who said enterprise applications should be large&#8230;hmm..ok..continue..) then things quickly become messy. And believe me working with a messy large JavaScript codebase is lot more painful than messy large Java codebase. So it is a good idea to separate the business logic from controller logic.

In AngularJS we can organize application logic into modules and make them work together using dependency injection. Lets see how to create a module in AngularJS.

<b style="background-color: #d0e0e3;">var myModule = angular.module(&#8216;moduleName&#8217;,[&#8216;dependency1&#8242;,&#8217;dependency2&#8217;]);</b>

This is how we can create a module by using angular.module() function by passing the module name and specifying a list of dependencies if there are any.

Once we define a module we can get handle of the module as follows:

<b style="background-color: #a2c4c9;">var myModule = angular.module(&#8216;moduleName&#8217;);</b>

> _<span style="color: #cc0000;">Observe that there is no second argument here which means we are getting the reference of a predefined angular module. If you include the second argument, which is an array, then it means you are defining the new module.</span>_

Once we define a new module we can create controllers in that module as follows:

<span style="background-color: #a2c4c9;">module.controller(&#8216;ControllerName&#8217;,[&#8216;dependency1&#8242;,&#8217;dependency2&#8217;, function(dependency1, dependency2){</span>
  
 <span style="background-color: #a2c4c9;">//logic</span>
  
<span style="background-color: #a2c4c9;">}]);</span>

For example, lets see how we to create **TodoController**.

<span style="background-color: #a2c4c9;">var myApp = angular.module(&#8216;myApp&#8217;,[&#8216;ngRoute&#8217;]);</span>
  
<span style="background-color: #a2c4c9;">myApp.controller(&#8216;TodoController&#8217;,[&#8216;$scope&#8217;,&#8217;$http&#8217;,function($scope,$http){</span>
  
 <span style="background-color: #a2c4c9;">//logic</span>
  
<span style="background-color: #a2c4c9;">}]);</span>

Here we are creating **TodoController** and providing **$scope** and **$http** as dependencies which are built-in angularjs services.

We can also create the same controller as follows:
  
<span style="background-color: #a2c4c9;">myApp.controller(&#8216;TodoController&#8217;,function($scope,$http){</span>
  
 <span style="background-color: #a2c4c9;">//logic</span>
  
<span style="background-color: #a2c4c9;">});</span>

Observe that we are directly passing a function as a second argument instead of an array which has an array of dependencies followed by a function which takes the same dependencies as arguments and it works exactly same as array based declaration.

**<span style="color: #cc0000;">But why do we need to do more typing when both do the same thing??</span>**

AngularJS injects the dependencies by name, that means when you define $http as a dependency then AngularJS looks for a registered service with name &#8216;**$http**&#8216;. But majority of the real world applications use JavaScript code minification tools to reduce the size. Those tools may rename your variables to short variable names.

For example:
  
<span style="background-color: #a2c4c9;">myApp.controller(&#8216;TodoController&#8217;,function($scope,$http){</span>
  
 <span style="background-color: #a2c4c9;">//logic</span>
  
<span style="background-color: #a2c4c9;">});</span>

The preceding code might be minified into:
  
<span style="background-color: #a2c4c9;">myApp.controller(&#8216;TodoController&#8217;,function($s,$h){</span>
  
 <span style="background-color: #a2c4c9;">//logic</span>
  
<span style="background-color: #a2c4c9;">});</span>

Then AngularJS tries to look for registered services with names **$s** and **$h** instead of **$scope** and **$http** and eventually it will fail. To overcome this issue we define the names of services as string literals in array and specify the same names as function arguments. With this even after JavaScript minifies the function argument names, string literals remains same and AngularJS picks right services to inject.

That means you can write the controller as follows:

<span style="background-color: #a2c4c9;">myApp.controller(&#8216;TodoController&#8217;,[&#8216;$scope&#8217;,&#8217;$http&#8217;,function($s,$h){</span>
  
 <span style="background-color: #a2c4c9;">//here $s represents $scope and $h represents $http services</span>
  
<span style="background-color: #a2c4c9;">}]);</span>

> **So always prefer to use array based dependencies approach.**

Ok, now we know how to create controllers. Lets see how we can add some functionality to our controllers.

Here in our **TodoController** we defined a variable **todos** which initially holds an empty array and we defined **loadTodos()** function which loads todos from RESTful services using **$http.get()** and once response received we are setting the todos array to our **todos** variable. Simple and straight forward.

**<span style="color: #cc0000;">Why can&#8217;t we directly assign the response of $http.get() to our todos variable like todoCtrl.todos = $http.get(&#8216;/todos.json&#8217;);??</span>**

Because **$http.get(&#8216;/todos.json&#8217;)** returns a **promise**, not actual response data. So you have to get data from success handler function. Also note that if you want to perform any logic after receiving data from **$http.get()** you should put your logic inside success handler function only.

For example if you are deleting a Todo item and then reload the todos you should **NOT** do as follows:

<span style="background-color: #a2c4c9;">$http.delete(&#8216;/todos.json/1&#8217;).success(function(data){</span>
  
 <span style="background-color: #a2c4c9;">//hurray, deleted</span>
  
 <span style="background-color: #a2c4c9;">}).error(function(){</span>
  
 <span style="background-color: #a2c4c9;">alert(&#8216;Error in deleting Todo&#8217;);</span>
  
 <span style="background-color: #a2c4c9;">});</span>
  
<span style="background-color: #a2c4c9;"><span style="color: #cc0000;">todoCtrl.loadTodos();</span></span>

Here you might assume that after delete is done it will **loadTodos()** and the deleted Todo item won&#8217;t show up, but that won&#8217;t work like that. You should do it as follows:

<span style="background-color: #a2c4c9;">$http.delete(&#8216;/todos.json/1&#8217;).success(function(data){</span>
  
 <span style="background-color: #a2c4c9;">//hurray, deleted</span>
  
 <span style="background-color: #a2c4c9;"><span style="color: #cc0000;">todoCtrl.loadTodos();</span></span>
  
<span style="background-color: #a2c4c9;">}).error(function(){</span>
  
 <span style="background-color: #a2c4c9;">alert(&#8216;Error in deleting Todo&#8217;);</span>
  
<span style="background-color: #a2c4c9;">});</span>

Lets move on to how to create AngularJS services. Creating services is also similar to controllers but AngularJS provides multiple ways for creating services.
  
There are 3 ways to create AngularJS services:

  * Using **module.factory()**
  * Using **module.service()**
  * Using **module.provider()**

**<span style="font-size: large;">Using module.factory()</span>**
  
We can create a service using **module.factory()** as follows:
  


<div class="gist-oembed" data-gist="sivaprasadreddy/b264fd883424a895c9e7.json">
</div>

**<span style="font-size: large;">Using module.service()</span>**
  
We can create a service using **module.service()** as follows:
  


<div class="gist-oembed" data-gist="sivaprasadreddy/42bd33585fc34b9fa6b7.json">
</div>

**<span style="font-size: large;">Using module.provider()</span>**
  
We can create a service using **module.provider()** as follows:
  


<div class="gist-oembed" data-gist="sivaprasadreddy/522fb12b3e4b22c1d0ca.json">
</div>

You can find good documentation on which method is appropriate in which scenario at <http://www.ng-newsletter.com/advent2013/#!/day/1>.

Let us create a **TodoService **in our **services.js** file as follows:
  


<div class="gist-oembed" data-gist="sivaprasadreddy/746449a4623d12cf37d1.json">
</div>

Now inject our **TodoService **into our **TodoController **as follows:
  


<div class="gist-oembed" data-gist="sivaprasadreddy/c9ef496493fdf42f4bf8.json">
</div>

Now we have separated our controller logic and business logic using AngularJS controllers and services and make them work together using Dependency Injection.

In the beginning of the post I said we will be developing a multi-screen application demonstrating **ngRoute** functionality.
  
In addition to Todos, let us add PhoneBook feature to our application where we can maintain list of contacts.

First, let us build the back-end functionality for PhoneBook REST services.

Create Person JPA entity, its Spring Data JPA repository and Controller.
  


<div class="gist-oembed" data-gist="sivaprasadreddy/0742b57bad46fa3809e6.json">
</div>

Now let us create AngularJS service and controller for Contacts. Observe that we will be using **module.service()** approach this time.
  


<div class="gist-oembed" data-gist="sivaprasadreddy/8a1744e0696fbdaa9375.json">
</div>

Now we need to configure our application routes in **app.js** file.
  


<div class="gist-oembed" data-gist="sivaprasadreddy/9b35955454f750ed7911.json">
</div>

Here we have configured our application routes on **$routeProvider** inside **myApp.config()** function.
  
When url matches with any of the routes then corresponding template content will be rendered in **<div ng-view></div>** div in our **index.html**.

If the url doesn&#8217;t match with any of the configured urls then it will be routed to &#8216;**home**&#8216; as specified in **otherwise()** configuration.

Our **templates/home.html** won&#8217;t have anything for now and **templates/todos.html** file will be same as **home.html** in previous post.

The new **templates/contacts.html** will just have a table listing contacts as follows:
  


<div class="gist-oembed" data-gist="sivaprasadreddy/0e7ea5f70a00f5e2a088.json">
</div>

Now let us create navigation links to Todos, Contacts pages in our **index.html** page **<body>**.
  


<div class="gist-oembed" data-gist="sivaprasadreddy/d477e4fadcf3dc3ec28f.json">
</div>

By now we have a multi-screen application and we understood how to use modules, controllers and services.
  
You can find the code for this article at <https://github.com/sivaprasadreddy/angularjs-samples/tree/master/angularjs-series/angularjs-part2>

<span style="font-size: large;">Our next article would be on how to use <b>$resource</b> instead of <b>$http</b> to consume REST services. </span>
  
<span style="font-size: large;">Also we will look update our application to use more powerful <b>ui-router</b> module instead of <b>ngRoute</b>. Stay tuned :-).</span>

 [1]: http://www.sivalabs.in/2014/09/angularjs-tutorial-getting-started-with.html