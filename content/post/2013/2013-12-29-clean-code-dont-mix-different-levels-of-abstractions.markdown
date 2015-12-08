---
author: siva
comments: true
date: 2013-12-29 06:23:00+00:00
layout: post
slug: clean-code-dont-mix-different-levels-of-abstractions
title: 'Clean Code: Don''t mix different levels of abstractions'
wordpress_id: 222
categories:
- Best Practices
- Java
tags:
- Best Practices
- Java
---

We spend more time on reading code than writing. So if the code is more readable then obviously it will increase the developer productivity.

Many people associate readability of code with coding conventions like following standard naming conventions, closing file, DB resources etc etc. When it comes to code reviews most of the people focus on these trivial things only, like checking for naming convention violations, properly releasing resources in finally block or not.

Do we need "Senior Resources" in team (I hate to call a human being as a Resource) to do these things?Tools like Findbugs, PMD, Checkstyle, Sonar can do that for you. I agree that following a standard naming convention by all the team members is a good thing. But that doesn't increase the readability of code.

Let us take a simple example. I would like to implement Fund Transfer usecase and following are the rules to implement:



	
  * Source and target accounts should be valid accounts

	
  * Check whether source account has sufficient amount

	
  * Check whether source account has provision for Overdraft and check whether this transaction exceeds the overdraft limit

	
  * Check for duplicate transaction with last transaction. If source, target accounts and amount is same with last transaction consider it as a duplicate transaction

	
  * If everything is fine then transfer amount to target account


Assume we have the following implementation for the above usecase:

[gist https://gist.github.com/sivaprasadreddy/8167981 /]

The above code is readable..right??...because:
1. We have followed naming conventions like camel casing variable names
2. We have all the open braces ({) on the method definition line
3. We have closed DB Connection in finally block
4. we have logged exception instead of using System.err.println()
and most important, it is working as expected.

_**So is it readable and clean code?? In my opinion absolutely not. There are many issues in the above code from readability perspective.**_
_**1. Mixing DB interaction code with business logic**_
_**2. Throwing IllegalArgumentException, RuntimeException etc from business methods instead of Business specific exceptions**_
_**3. Most importantly, the code is mixed with different levels of abstractions.**_

Let me explain what I mean by different levels of abstractions.

Firstly, from business perspective fund transfer means validating source/target accounts, checking for sufficient balance, checking for overdraft limit, checking for duplicate transaction and making the fund transfer.

From technical point of view there are various tasks like fetching Account details from DB, performing all the business related checks, throwing Exceptions if there are any violations, properly closing the resources etc.

But in the above code everything is mixed together.

_While reading the code you start looking at JDBC code and your brain is working in Technical mode and after getting Account object from ResultSet you are checking for null and throwing Exception if it is null which is Business requirement. So immediately you need to switch your mind to Business mode and think "OK, if the account is invalid we want to abort the operation immediately"._
_
__Though you managed to switch between Technical and Business modes, what about making an enhancement to one perticular subtask like "Fund transfer is considred duplicate only if it matches with the last transaction that happened with in an hour only". To make that enhancement you have to go through the entire method because you haven't modularised your sub-tasks and there is no separation of concerns._

Lets rewrite the above method as follows:

[gist https://gist.github.com/sivaprasadreddy/8167990 /]

The above improved method do exactly what the initial verson is doing but now it looks lot better than earlier version.



	
  * We have divided the entire task into sub-tasks and implemented each sub-task in a separate method.

	
  * We have delegated DB interactions to DAOs

	
  * We are throwing Business specific Exceptions instead of Java language Exceptions

	
  * All in all we have separated the levels of abstractions.


_At the first level we have highest level of abstraction in transferFunds(FundTransferTxn txn) method. By looking at this method we can understand what we are doing as part of Fund Transfer operation without worrying much about implementation or technical details._
_
__At the second level we have business logic implementation methods checkForOverdraft, checkForDuplicateTransaction etc which performs business logic, again without worrying much about technical details._
_
__At the lowest level we have technical implementation details in AccountDAO and TransactionDAO which contains DB interaction logic._

So the reader(future developer/maintainer) of your code can easily understand what you are doing at the high level and can dig into method which he is interested in.

As I said earlier, if we have to make the change to consider the transaction as a duplicate transaction only if it happened with in an hour, we can easily understand that checkForDuplicateTransaction() is the one we have to look into and make change.

Happy coding!!
