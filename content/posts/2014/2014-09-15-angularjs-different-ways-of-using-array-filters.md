---
title: 'AngularJS: Different ways of using Array Filters'
author: Siva
type: post
date: 2014-09-15T01:43:00+00:00
url: /2014/09/angularjs-different-ways-of-using-array-filters/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/09/angularjs-different-ways-of-using-array.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/7136834512239625405
post_views_count:
  - 184
categories:
  - JavaScript
tags:
  - AngularJS

---
**AngularJS** provides filter feature which can be used to format input value or to filter an Array with the given matching input criteria. For example you can use &#8216;date&#8217; filter to format a Date value into human readable Date representation like **MM-DD-YYYY** as **{{dob | date}}**.

On the other hand there are Array filtering feature which is very useful while filtering data from an Array of JavaScript objects. The Array filtering is very commonly used with a Table along with **ng-repeat** directive.

For example, we can have a list of Todos which we can display in a Table using **ng-repeat** tag. And we can have a text field to search todos which matches any one of the data properties of Todo object as follows:

<pre class="brush: js">$scope.todos = [
    {id: 1,title: 'Learn AngularJS', description: 'Learn AngularJS', done: true, date: new Date()}  ,
    {id: 2,title: 'Explore ui-router', description: 'Explore and use ui-router instead of ngRoute', done: true, date: new Date()}  ,
    {id: 3,title: 'Play with Restangular', description: 'Restangular seems better than $resource, have a look', done: false, date: new Date()}  ,
    {id: 4,title: 'Try yeoman', description: 'No more labour work..use Yeoman', done: false, date: new Date()}  ,
    {id: 5,title: 'Try MEANJS', description: 'Aah..MEANJS stack seems cool..why dont u try once', done: false, date: new Date()}                
            ];


</pre>

<pre class="brush: xml">&lt;input type="text" ng-model="searchTodos"&gt;
 &lt;table class="table table-striped table-bordered"&gt;
 &lt;thead&gt;
  &lt;tr&gt;
   &lt;th&gt;#&lt;/th&gt;
   &lt;th&gt;Title&lt;/th&gt;
   &lt;th&gt;Description&lt;/th&gt;
   &lt;th&gt;Done?&lt;/th&gt;
   &lt;th&gt;Date&lt;/th&gt;
  &lt;/tr&gt;
 &lt;/thead&gt;
 &lt;tbody&gt;
  &lt;tr ng-repeat="todo in todos| filter: searchTodos"&gt;
   &lt;td&gt;{{$index + 1}}&lt;/td&gt;
   &lt;td&gt;{{todo.title}}&lt;/td&gt;
   &lt;td&gt;{{todo.description}}&lt;/td&gt; 
   &lt;td&gt;{{todo.done}}&lt;/td&gt;
   &lt;td&gt;{{todo.date | date}}&lt;/td&gt; 
  &lt;/tr&gt;

 &lt;/tbody&gt;

&lt;/table&gt;
</pre>

Observe that our search input field&#8217;s **ng-model** attribute is set to &#8216;**searchTodos**&#8216; which we have used to filter on **ng-repeat** attribute. As you type in the search input field, the **$scope.todos** array will be filtered and only matching records will be shown up. This is a &#8220;**match anything**&#8221; type filter, means the search criteria will be checked against all properties(**id, title, description, date**) of Todo object.

If you want to search only on one field, say &#8216;**description**&#8216;, you can apply filter as follows:

<pre class="brush: xml">&lt;tr ng-repeat="todo in todos| filter: {description: searchTodos}"&gt;</pre>

If you want to display only Todos which aren&#8217;t **done** yet then you can do it as follows:

<pre class="brush: xml">&lt;tr ng-repeat="todo in todos| filter: {description: searchTodos, done: false}"&gt;</pre>

**Note that here the 2 conditions will be applied using <span style="color: red;">AND</span> conditions. **

If you want to display only Todos which aren&#8217;t done yet and you want to search on all fields not just on &#8216;**description**&#8216; then you can do it as follows:

<pre class="brush: xml">&lt;tr ng-repeat="todo in todos| filter: {$: searchTodos, done: false}"&gt;</pre>

Here **<span style="color: red;">$</span>** means all fields. So far so good as it is a simple and straight forward case.

How about having nested objects in our Array objects and we want to search based on a nested object property?

Let&#8217;s look at such a type of scenario. In order to explain these scenarios I am using some code examples from my ebuddy application.

In my ebuddy application I have an ExpenseManager module where I will keep track of my expenses as follows:

  * I will have a list of Accounts such as Cash, savings Bank Account, CreditCard etc with the current balance details.
  * I will have a list of Payees such as HouseRent, PowerBill, Salary etc which fall into INCOME or EXPENDITURE categories.
  * I will record all my transactions by picking one of the account and a Payee and the amount.

This application is just to record my financial transactions so that I can see monthly reports by Account or Payee wise. I hope you get an idea about the domain model.

Now let us create a simple AngularJS application and set some sample data.

<pre class="brush: xml">&lt;!DOCTYPE html&gt;
 &lt;html ng-app="myApp"&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;meta http-equiv="X-UA-Compatible" content="IE=edge"&gt;
  &lt;title&gt;My AngularJS App&lt;/title&gt;
  &lt;meta name="description" content=""&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  &lt;link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/&gt;
  &lt;script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js"&gt;&lt;/script&gt;
  &lt;script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"&gt;&lt;/script&gt;
  &lt;script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min.js"&gt;&lt;/script&gt;
  
  &lt;script&gt;
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
      
  &lt;/script&gt;  
&lt;/head&gt;
&lt;body ng-controller="SampleController"&gt;
&lt;br/&gt;
 &lt;div class="col-md-8 col-md-offset-2"&gt;
        
    &lt;h3&gt;Transaction Details&lt;/h3&gt;
    &lt;table class="table table-striped table-bordered"&gt;
        &lt;thead&gt;
            &lt;tr&gt;
                &lt;th&gt;#&lt;/th&gt;
                &lt;th&gt;Account&lt;/th&gt;
                &lt;th&gt;Type&lt;/th&gt;
                &lt;th&gt;Payee&lt;/th&gt;
                &lt;th&gt;Amount&lt;/th&gt;
            &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
            &lt;tr ng-repeat="txn in transactions"&gt;
                &lt;td&gt;{{$index + 1}}&lt;/td&gt;
                &lt;td&gt;{{txn.account.name}}&lt;/td&gt;
                &lt;td&gt;{{txn.txnType}}&lt;/td&gt; 
                &lt;td&gt;{{txn.payee.name}}&lt;/td&gt; 
                &lt;td&gt;{{txn.amount}}&lt;/td&gt; 
            &lt;/tr&gt;
        &lt;/tbody&gt;
    &lt;/table&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;</pre>

This is a very simple AngularJS page which is displaying list of transactions in a table. Observe that the transactions contains nested objects (**account**, **payee**) and we are displaying nested properties (**txn.account.name**, **txn.payee.name**) in our table.

Now we want to filter the transactions in a variety of ways, so lets look at them case by case.

**<span style="font-size: large;">Case#1: Search by Payee Name </span>**
  
In our transaction object we have a nested payee object which contains name property on which we want to perform search.

Let us create form which will contain all our filters before transactions table.
  
The first thought that came to my mind to perform a search on a nested property is use the nested property path in filter as follows:

<pre class="brush: xml">&lt;input type="text" ng-model="payeeName"&gt;
...
&lt;tr ng-repeat="txn in transactions| filter: {payee.name : payeeName}"&gt;</pre>

**<span style="color: red;">But THIS WON&#8221;T WORK. </span>**

To search on a nested property we can name our input field **ng-model** to match the target property path and use the root object name as filter as follows:

<pre class="brush: xml">&lt;div class="col-md-8 col-md-offset-2"&gt;
     &lt;form class="form-horizontal" role="form"&gt;
        &lt;div class="form-group"&gt;
          &lt;label for="input1" class="col-sm-4 control-label"&gt;Search by Payee&lt;/label&gt;
          &lt;div class="col-sm-6"&gt;
            &lt;input type="text" class="form-control" id="input1" placeholder="Payee Name" ng-model="filterTxn.payee.name"&gt;
          &lt;/div&gt;
        &lt;/div&gt;
  &lt;!-- additional filters will come here --&gt;
 &lt;/form&gt;
 &lt;h3&gt;Transaction Details&lt;/h3&gt;
 &lt;table class="table table-striped table-bordered"&gt;
  ...
  &lt;tbody&gt;
            &lt;tr ng-repeat="txn in transactions| filter: filterTxn"&gt;
                ...
    ...
            &lt;/tr&gt;
  &lt;/tbody&gt;
 &lt;/table&gt;
&lt;/div&gt;</pre>

Observe that we have bind the input field ng-model to &#8220;**filterTxn.payee.name**&#8221; and used filter: **filterTxn** as filter. So **txn.payee.name** will be matched against **filterTxn.payee.name**.

<span style="font-size: large;"><b>Case#2: Filter by Accounts Dropdown </b></span>
  
We would like to filter the transactions by using Accounts Select dropdown. First we need to populate a select dropdown using **$scope.accounts** and use it as a filter.

Add the following filter after our first filter.

<pre class="brush: xml">&lt;div class="form-group"&gt;
  &lt;label for="input2" class="col-sm-4 control-label"&gt;Search By Account&lt;/label&gt;
  &lt;div class="col-sm-6"&gt;
  &lt;select id="input2" class="form-control" ng-model="filterTxn.account"&gt;
   &lt;option value=""&gt;All Accounts&lt;/option&gt;
   &lt;option ng-repeat="item in accounts" value="{{item.id}}"&gt;{{item.name}}&lt;/option&gt;
  &lt;/select&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>

Here we are populating a <select> field with **$scope.accounts** array by displaying Account Name and using id as value.

The key part here is we have bind **ng-model** to **filterTxn.account**. When we select an account, the selected account object reference will be stored in **filterTxn.account**. As we already have **filterTxn** as filter, the account filter will also be applied along with payee name filter.

Also note that the first option **&#8220;All Accounts&#8221;** value is empty (**&#8220;&#8221;**) which will be treated as **null** by AngularJS, so when the &#8220;All Accounts&#8221; is option is selected no account filter will be applied.

**<span style="font-size: large;">Case#3: Search By Transaction Type </span>**
  
We want to filter the transaction by transaction type (**INCOME** or **EXPENDITURE**):

Add the following filter after the second filter:

<pre class="brush: xml">&lt;div class="form-group"&gt;
  &lt;label for="input3" class="col-sm-4 control-label"&gt;Search By Type&lt;/label&gt;
  &lt;div class="col-sm-6"&gt;
  &lt;select id="input3" class="form-control" ng-model="filterTxn.txnType"&gt;
   &lt;option value=""&gt;All Types&lt;/option&gt;
   &lt;option value="EXPENDITURE"&gt;EXPENDITURE&lt;/option&gt;
   &lt;option value="INCOME"&gt;INCOME&lt;/option&gt;
  &lt;/select&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>

I hope no further explanation is need for this 🙂

<span style="font-size: large;"><b>Case#4: Search by Payees of Expenditure type </b></span>
  
Aaah..this is interesting!!. We want to search by Payee names but only in **EXPENDITURE** type payees.

We can&#8217;t simply apply filter like **&#8220;filter: expPayeeFilter | filter: {txnType: &#8216;EXPENDITURE&#8217;}&#8221;** because it will always filter by **EXPENDITURE**.

So we will create a custom filter to perform &#8220;**_search by payee name in EXPENDITURE type payees only when some filter text entered_**&#8221; as follows:

<pre class="brush: js">myApp.filter('expenditurePayeeFilter', [function($filter) {
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
}]);</pre>

We have created a custom filter using **myApp.filter()** and inside it we have used **angular.forEach()** to iterate over the input array, rest is plain javascript..no magic.

Now we will apply this custom filter as follows:

<pre class="brush: xml">&lt;tr ng-repeat="txn in transactions| filter: filterTxn | expenditurePayeeFilter:searchCriteria:'EXPENDITURE'"&gt;
 &lt;td&gt;{{$index + 1}}&lt;/td&gt;
 &lt;td&gt;{{txn.account.name}}&lt;/td&gt;
 &lt;td&gt;{{txn.txnType}}&lt;/td&gt; 
 &lt;td&gt;{{txn.payee.name}}&lt;/td&gt; 
 &lt;td&gt;{{txn.amount}}&lt;/td&gt; 
&lt;/tr&gt;</pre>

Observer the syntax: **customFilterName:param1:param2:..:paramN**.
  
These parameters will be passed as arguments to the function inside our custom directive.

We have seen few interesting options on how to use AngularJS array filtering features.

You can find the complete page at <a href="https://gist.github.com/sivaprasadreddy/fbee047803d14631fafd" target="_blank">https://gist.github.com/sivaprasadreddy/fbee047803d14631fafd</a>


  
Hope it helps. 🙂