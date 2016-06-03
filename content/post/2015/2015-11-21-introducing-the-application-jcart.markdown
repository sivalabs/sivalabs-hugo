---
author: siva
comments: true
date: 2015-11-21 02:28:23+00:00
layout: post
slug: introducing-the-application-jcart
title: Introducing the application JCart
wordpress_id: 156
categories:
- Java
- Spring
- SpringBoot
tags:
- E-Commerce
---

As I promised in my article [Developing a simple e-commerce application from scratch to production using SpringBoot](http://sivalabs.in/developing-a-simple-e-commerce-application-from-scratch-to-production-using-springboot/), I am starting first post by introducing the application **JCart** that we are going to build.

One of my friend makes quilling toys and she sell them by advertising on Facebook or through word of mouth. Now she is getting more and more customers and she wants to expand her business by going online. So, she asked me to help in setting up a simple e-commerce website. After having some conversations on whether to leverage any existing e-commerce platforms or building a new application, we decided to build a new one with the features we just needed for our need.


<blockquote>**ATTENTION:** There are so many well established open source e-commerce platforms such as BroadleafCommerce, OpenCart, Drupal Commerce etc. But these systems provide so many features that you may probably don't need and hence looks a bit overwhelming. But think twice before building your own. Don't Repeat Yourself.</blockquote>


For those of you who are not familiar with what Quilling Art is, have a loot at the following pictures. These toys are made of some kind of colour paper and other stuff.

[![6](http://sivalabs.in/wp-content/uploads/2015/11/6.jpg)](http://sivalabs.in/wp-content/uploads/2015/11/6.jpg)   [![20](http://sivalabs.in/wp-content/uploads/2015/11/20.jpg)](http://sivalabs.in/wp-content/uploads/2015/11/16.jpg) [![18](http://sivalabs.in/wp-content/uploads/2015/11/18.jpg)](http://sivalabs.in/wp-content/uploads/2015/11/18.jpg)  [![21](http://sivalabs.in/wp-content/uploads/2015/11/21.jpg)](http://sivalabs.in/wp-content/uploads/2015/11/21.jpg) [![24](http://sivalabs.in/wp-content/uploads/2015/11/24.jpg)![14](http://sivalabs.in/wp-content/uploads/2015/11/14.jpg)![15](http://sivalabs.in/wp-content/uploads/2015/11/15.jpg)](http://sivalabs.in/wp-content/uploads/2015/11/24.jpg)

Note: These sample images are downloaded from internet and all rights belongs to their respective owners.


## High Level Requirements


After having a brief discussion with our client, following are the high level requirements:



	
  1. A public facing Shopping Cart website with features:

	
    * Customers can browse through products by category or by searching

	
    * Customers can place orders using CreditCard or Cash On Delivery

	
    * Customers can login and view order history

	
    * Customers will receive confirmation emails when order is placed or order status changed




	
  2. An Administration website which has the following features:

	
    * Ability to manage Categories and Products

	
    * Ability to create one or more users for Administration website

	
    * Ability to restrict access to certain features based on roles

	
    * Ability to view customer orders and update the status




	
  3. A mobile (Android/iOS) application for ShoppinngCart

	
    * Not an immediate requirement, but in future we may need it.








### Overview of System Architecture


[![JCart](http://sivalabs.in/wp-content/uploads/2015/11/JCart-300x197.png)](http://sivalabs.in/wp-content/uploads/2015/11/JCart.png)

These are very high-level requirements and design only. In our next post we will go through all these requirement in detail.
