---
title: 'AngularJS Tutorial: Getting Started with AngularJS'
author: Siva
type: post
date: 2014-09-04T08:14:00+00:00
url: /2014/09/angularjs-tutorial-getting-started-with-angularjs/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/09/angularjs-tutorial-getting-started-with.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2346038327181243616
post_views_count:
  - 81
categories:
  - JavaScript
tags:
  - AngularJS

---
AngularJS is a popular JavaScript framework for building Single Page Applications (SPAs).
  
AngularJS provides the following features which makes developing web apps easy:
  
1. Two way data binding
  
2. Dependency Injection
  
3. Custom HTML Directives
  
4. Easy integration with REST webservices using $http, $resource, Restangular etc
  
5. Support for Testing
  
and many more&#8230;

Though there are lot more features than the above mentioned list, these are the very commonly used features.

I am not going to explain what 2-way data binding is, how $scope works here because there are tons of material already on web.

As a Java developer, I will be using SpringBoot based RESTful back-end services. If you want you can use JavaEE/JAX-RS to build REST back-end services. Also you might like using NetBeans as it has wonderful AngularJS auto-completion support out of the box.

So lets get start coding AngularJS HelloWorld application.

Create **index.html** with the following content and start your server and point your browser to <http://localhost:8080/hello-angularjs/index.html>

<div class="gist-oembed" data-gist="sivaprasadreddy/760a1d0e7fdb2b0c8967.json">
</div>

Now start typing in input text and your Hello _{{myname}}_ would immediately reflect the value you are entering in input text field.

Ok, we are done with &#8220;HelloWorld&#8221; ceremony and warm up :-).

We have used AngularJS CDN URL for loading AngularJS library. We can download AngularJS from <https://angularjs.org/> add the _angular.min.js_ script.

But we will be using WebJars (<http://www.webjars.org/>) which provides the popular javascript libraries as maven jar modules along with transitive dependencies. If we want to use Twitter Bootstrap we should include jQuery also. But using WebJars I need to configure only bootstrap jar dependency and it will pull jquery dependency for me.

Let us create a SpringBoot project by selecting File -> New -> Spring Starter Project, select &#8220;Web&#8221; and &#8220;Data JPA&#8221; modules and Finish.

If you are not using STS then you can create this starter template from <http://start.spring.io/> and download it as zip.

We will be using Bootstrap and font-awesome javascript libraries to build our Web UI.
  
Lets configure H2 database, AngularJS, Bootstrap and font-awesome libraries as WebJar maven dependencies in pom.xml.

As it is a SpringBoot jar type application we will put all our html pages in src/main/resources/public folder and all our javascripts, css, images in src/main/resources/static folder.

  * Now modify the AngularJS CDN reference to **<script src=&#8221;webjars/angularjs/1.2.19/angular.js&#8221;></script>**.
  * Lets include the bootstrap and font-awesome css/js in our index.html. Also we will be using angular-route module for page navigation and hence we need to include _angular-route.js_ as well.
  * Lets create _app.js_ file which contains our main angularjs module configuration in **src/main/resources/static/js** folder.
  * Also create _controllers.js, services.js, filters.js, directives.js_ in the same folder and include them in **index.html**.

SpringBoot will serve the static content from **_src/main/resources/static_** folder.

<div class="gist-oembed" data-gist="sivaprasadreddy/2a6fa7bcac62402fd6f9.json">
</div>

In Application.java file add the following RequestMapping to map context root to **index.html**.

<div class="gist-oembed" data-gist="sivaprasadreddy/3580575e8887b57f3cf5.json">
</div>

Now run this Application.java as stand-alone class and go to <http://localhost:8080/>. It should work same as earlier.

Now we have basic setup ready. Lets build a very simple Todo application.

Create a JPA entity Todo.java, its Spring Data JPA repository interface and TodoController to perform Read/Create/Delete operations.

<div class="gist-oembed" data-gist="sivaprasadreddy/26d2e24ab9b1bde8e51d.json">
</div>

Create DatabasePopulator to setup some initial data.

<div class="gist-oembed" data-gist="sivaprasadreddy/d4e16e38b4b1fa7e62c3.json">
</div>

Now our back-end RESTful web services ready at the following URLs.
  
**GET** &#8211; <http://localhost:8080/todos> for getting list of Todos
  
**POST **&#8211; <http://localhost:8080/todos> for creating new Todo
  
**DELETE **&#8211; <http://localhost:8080/todos/1> to delete Todo(id:1)

Lets create our main angularjs module &#8216;**myApp**&#8216; and configure our application routes in _app.js_ file.

<div class="gist-oembed" data-gist="sivaprasadreddy/fffc4b9fbb42b1bd6400.json">
</div>

Now update _index.html_ to hookup **myApp** module at the root of page using **__** and use

<div>
</div>

to load the current route template.

<div class="gist-oembed" data-gist="sivaprasadreddy/01f09813c22126f781ea.json">
</div>

Create _home.html_ template in **src/main/resources/public/templates** folder.

<div class="gist-oembed" data-gist="sivaprasadreddy/310fac5c905bde276511.json">
</div>

It is a very simple html page with some bootstrap styles and we are using some angularjs features.
  
We are using **ng-repeat** directive to iterate through array of Todo JSON objects, **ng-click** directive to bind a callback function to button click.

To invoke REST services we will use angularjs built-in **$http** service. $http service resides in **angular-route.js**, don&#8217;t forget to include it in **index.html**.

_**$http.verb(&#8216;URI&#8217;)**_
  
_**.success(success\_callback\_function(data, status, headers, config){**_
  
_ **//use data**_
  
_** })**_
  
_**.error(error\_callback\_function(data, status, headers, config) {**_
  
_ ** alert(&#8216;Error loading data&#8217;);**_
  
_**});**_

For example: to make **GET **_/todos_ REST call

**_$http.get(&#8216;todos&#8217;)_**
  
**_.success(function(data, status, headers, config) {_**
  
** _//use data_**
  
**_ })_**
  
**_.error(function(data, status, headers, config) {_**
  
** _ alert(&#8216;Error loading data&#8217;);_**
  
**_});_**

Create TodoController in **controllers.js** file. In TodoController we will create functions to load/create/delete Todos.

<div class="gist-oembed" data-gist="sivaprasadreddy/093de52472a2295ee408.json">
</div>

Now point your browser to <http://localhost:8080/>. You should see list of Todos and New Todo Entry form and Delete option for each Todo item.

By now we get some hands-on with AngularJS basic features.
  
In next post I will explain using multiple routes, multiple controllers and services. Stay tuned 🙂