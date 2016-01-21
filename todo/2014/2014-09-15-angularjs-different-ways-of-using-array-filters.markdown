---
author: siva
comments: true
date: 2014-09-15 07:13:00+00:00
layout: post
slug: angularjs-different-ways-of-using-array-filters
title: 'AngularJS: Different ways of using Array Filters'
wordpress_id: 214
categories:
- AngularJS
tags:
- AngularJS
---

**AngularJS** provides filter feature which can be used to format input value or to filter an Array with the given matching input criteria. For example you can use 'date' filter to format a Date value into human readable Date representation like **MM-DD-YYYY** as **{{dob | date}}**.

On the other hand there are Array filtering feature which is very useful while filtering data from an Array of JavaScript objects. The Array filtering is very commonly used with a Table along with **ng-repeat** directive.

For example, we can have a list of Todos which we can display in a Table using **ng-repeat** tag. And we can have a text field to search todos which matches any one of the data properties of Todo object as follows:

    
    
    $scope.todos = [
        {id: 1,title: 'Learn AngularJS', description: 'Learn AngularJS', done: true, date: new Date()}  ,
        {id: 2,title: 'Explore ui-router', description: 'Explore and use ui-router instead of ngRoute', done: true, date: new Date()}  ,
        {id: 3,title: 'Play with Restangular', description: 'Restangular seems better than $resource, have a look', done: false, date: new Date()}  ,
        {id: 4,title: 'Try yeoman', description: 'No more labour work..use Yeoman', done: false, date: new Date()}  ,
        {id: 5,title: 'Try MEANJS', description: 'Aah..MEANJS stack seems cool..why dont u try once', done: false, date: new Date()}                
                ];
    
    
    


 

    
    
    <input type="text" ng-model="searchTodos">
     <table class="table table-striped table-bordered">
     <thead>
      <tr>
       <th>#</th>
       <th>Title</th>
       <th>Description</th>
       <th>Done?</th>
       <th>Date</th>
      </tr>
     </thead>
     <tbody>
      <tr ng-repeat="todo in todos| filter: searchTodos">
       <td>{{$index + 1}}</td>
       <td>{{todo.title}}</td>
       <td>{{todo.description}}</td> 
       <td>{{todo.done}}</td>
       <td>{{todo.date | date}}</td> 
      </tr>
    
     </tbody>
    
    </table>
    


Observe that our search input field's **ng-model** attribute is set to '**searchTodos**' which we have used to filter on **ng-repeat** attribute. As you type in the search input field, the **$scope.todos** array will be filtered and only matching records will be shown up. This is a "**match anything**" type filter, means the search criteria will be checked against all properties(**id, title, description, date**) of Todo object.

If you want to search only on one field, say '**description**', you can apply filter as follows:

    
    
    <tr ng-repeat="todo in todos| filter: {description: searchTodos}">


If you want to display only Todos which aren't **done** yet then you can do it as follows:

    
     
    <tr ng-repeat="todo in todos| filter: {description: searchTodos, done: false}">


**Note that here the 2 conditions will be applied using AND conditions. **

If you want to display only Todos which aren't done yet and you want to search on all fields not just on '**description**' then you can do it as follows:

    
    
    <tr ng-repeat="todo in todos| filter: {$: searchTodos, done: false}">


Here **$** means all fields. So far so good as it is a simple and straight forward case.

How about having nested objects in our Array objects and we want to search based on a nested object property?

Let's look at such a type of scenario. In order to explain these scenarios I am using some code examples from my ebuddy application.

In my ebuddy application I have an ExpenseManager module where I will keep track of my expenses as follows:



	
  * I will have a list of Accounts such as Cash, savings Bank Account, CreditCard etc with the current balance details.

	
  * I will have a list of Payees such as HouseRent, PowerBill, Salary etc which fall into INCOME or EXPENDITURE categories.

	
  * I will record all my transactions by picking one of the account and a Payee and the amount.


This application is just to record my financial transactions so that I can see monthly reports by Account or Payee wise. I hope you get an idea about the domain model.

Now let us create a simple AngularJS application and set some sample data.

    
      
    <!DOCTYPE html>
     <html ng-app="myApp">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>My AngularJS App</title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
      <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min.js"></script>
      
      <script>
          var myApp = angular.module('myApp',[]);
          myApp.controller('SampleController', function($scope){
                $scope.accounts = [ 
                        {id: 1, name: 'Cash'}, 
                        {id: 2, name: 'Bank Savings'} 
                      ];
                $scope.payees = [
                        {id:'1',name:'HouseRent', txnType:'EXPENDITURE'},
                        {id: '2', name:'InternetBill', txnType:'EXPENDITURE'}, 
                        {id:'3', name: 'PowerBill', txnType:'EXPENDITURE'}, 
                        {id:'4', name: 'Salary', txnType:'INCOME'}
                      ];
                $scope.transactions = [
                    {id:'1', txnType:'EXPENDITURE', amount: 1000, account: $scope.accounts[0], payee: $scope.payees[0]},
                    {id:'2', txnType:'EXPENDITURE', amount: 500, account: $scope.accounts[1], payee: $scope.payees[1]},
                    {id:'3', txnType:'EXPENDITURE', amount: 1200, account: $scope.accounts[0], payee: $scope.payees[1]},
                    {id:'4', txnType:'INCOME', amount: 5000, account: $scope.accounts[1], payee: $scope.payees[3]},
                    {id:'5', txnType:'EXPENDITURE', amount:200, account: $scope.accounts[0], payee: $scope.payees[2]}
                ];
                
          });
          
      </script>  
    </head>
    <body ng-controller="SampleController">
    <br/>
     <div class="col-md-8 col-md-offset-2">
            
        <h3>Transaction Details</h3>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Account</th>
                    <th>Type</th>
                    <th>Payee</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="txn in transactions">
                    <td>{{$index + 1}}</td>
                    <td>{{txn.account.name}}</td>
                    <td>{{txn.txnType}}</td> 
                    <td>{{txn.payee.name}}</td> 
                    <td>{{txn.amount}}</td> 
                </tr>
            </tbody>
        </table>
    </div>
    
    </body>
    </html>


This is a very simple AngularJS page which is displaying list of transactions in a table. Observe that the transactions contains nested objects (**account**, **payee**) and we are displaying nested properties (**txn.account.name**, **txn.payee.name**) in our table.

Now we want to filter the transactions in a variety of ways, so lets look at them case by case.

**Case#1: Search by Payee Name **
In our transaction object we have a nested payee object which contains name property on which we want to perform search.

Let us create form which will contain all our filters before transactions table.
The first thought that came to my mind to perform a search on a nested property is use the nested property path in filter as follows:

    
     
    <input type="text" ng-model="payeeName">
    ...
    <tr ng-repeat="txn in transactions| filter: {payee.name : payeeName}">


**But THIS WON"T WORK. **

To search on a nested property we can name our input field **ng-model** to match the target property path and use the root object name as filter as follows:

    
     
    <div class="col-md-8 col-md-offset-2">
         <form class="form-horizontal" role="form">
            <div class="form-group">
              <label for="input1" class="col-sm-4 control-label">Search by Payee</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" id="input1" placeholder="Payee Name" ng-model="filterTxn.payee.name">
              </div>
            </div>
      <!-- additional filters will come here -->
     </form>
     <h3>Transaction Details</h3>
     <table class="table table-striped table-bordered">
      ...
      <tbody>
                <tr ng-repeat="txn in transactions| filter: filterTxn">
                    ...
        ...
                </tr>
      </tbody>
     </table>
    </div>


Observe that we have bind the input field ng-model to "**filterTxn.payee.name**" and used filter: **filterTxn** as filter. So **txn.payee.name** will be matched against **filterTxn.payee.name**.

**Case#2: Filter by Accounts Dropdown **
We would like to filter the transactions by using Accounts Select dropdown. First we need to populate a select dropdown using **$scope.accounts** and use it as a filter.

Add the following filter after our first filter.

    
      
    <div class="form-group">
      <label for="input2" class="col-sm-4 control-label">Search By Account</label>
      <div class="col-sm-6">
      <select id="input2" class="form-control" ng-model="filterTxn.account">
       <option value="">All Accounts</option>
       <option ng-repeat="item in accounts" value="{{item.id}}">{{item.name}}</option>
      </select>
      </div>
    </div>


Here we are populating a <select> field with **$scope.accounts** array by displaying Account Name and using id as value.

The key part here is we have bind **ng-model** to **filterTxn.account**. When we select an account, the selected account object reference will be stored in **filterTxn.account**. As we already have **filterTxn** as filter, the account filter will also be applied along with payee name filter.

Also note that the first option **"All Accounts"** value is empty (**""**) which will be treated as **null** by AngularJS, so when the "All Accounts" is option is selected no account filter will be applied.

**Case#3: Search By Transaction Type **
We want to filter the transaction by transaction type (**INCOME** or **EXPENDITURE**):

Add the following filter after the second filter:

    
      
    <div class="form-group">
      <label for="input3" class="col-sm-4 control-label">Search By Type</label>
      <div class="col-sm-6">
      <select id="input3" class="form-control" ng-model="filterTxn.txnType">
       <option value="">All Types</option>
       <option value="EXPENDITURE">EXPENDITURE</option>
       <option value="INCOME">INCOME</option>
      </select>
      </div>
    </div>


I hope no further explanation is need for this :-)

**Case#4: Search by Payees of Expenditure type **
Aaah..this is interesting!!. We want to search by Payee names but only in **EXPENDITURE** type payees.

We can't simply apply filter like **"filter: expPayeeFilter | filter: {txnType: 'EXPENDITURE'}"** because it will always filter by **EXPENDITURE**.

So we will create a custom filter to perform "**_search by payee name in EXPENDITURE type payees only when some filter text entered_**" as follows:

    
      
    myApp.filter('expenditurePayeeFilter', [function($filter) {
     return function(inputArray, searchCriteria, txnType){         
      if(!angular.isDefined(searchCriteria) || searchCriteria == ''){
       return inputArray;
      }         
      var data=[];
      angular.forEach(inputArray, function(item){             
       if(item.txnType == txnType){
        if(item.payee.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) != -1){
         data.push(item);
        }
       }
      });      
      return data;
     };
    }]);


We have created a custom filter using **myApp.filter()** and inside it we have used **angular.forEach()** to iterate over the input array, rest is plain javascript..no magic.

Now we will apply this custom filter as follows:

    
      
    <tr ng-repeat="txn in transactions| filter: filterTxn | expenditurePayeeFilter:searchCriteria:'EXPENDITURE'">
     <td>{{$index + 1}}</td>
     <td>{{txn.account.name}}</td>
     <td>{{txn.txnType}}</td> 
     <td>{{txn.payee.name}}</td> 
     <td>{{txn.amount}}</td> 
    </tr>


Observer the syntax: **customFilterName:param1:param2:..:paramN**.
These parameters will be passed as arguments to the function inside our custom directive.

We have seen few interesting options on how to use AngularJS array filtering features.

You can find the complete page at [https://gist.github.com/sivaprasadreddy/fbee047803d14631fafd](https://gist.github.com/sivaprasadreddy/fbee047803d14631fafd)


Hope it helps. :-)
