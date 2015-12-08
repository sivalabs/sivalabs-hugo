---
author: siva
comments: true
date: 2015-12-01 04:22:19+00:00
layout: post
slug: jcart-domain-modelling-and-database-designing
title: 'JCart: Domain Modelling and Database Designing'
wordpress_id: 501
categories:
- E-Commerce
tags:
- jcart
- SpringBoot
---

While developing database driven applications using some ORM framework, some people prefer Object first approach and others follow DB first approach. I prefer DB first approach.

So, let us start listing down all the domain entities in our JCart application domain.



	
  * Product

	
  * Category

	
  * Customer

	
  * Order

	
  * OrderItem

	
  * Cart

	
  * Address

	
  * User

	
  * Role

	
  * Permission


Let us create the database tables as follows:

[![jcart](http://sivalabs.in/wp-content/uploads/2015/12/jcart-261x300.png)](http://sivalabs.in/wp-content/uploads/2015/12/jcart.png)

Though we identified **Cart** as a domain entity, we are not creating the table for holding the Cart details. We are going to take the simple approach of storing the active cart details in **HttpSession** only. But in real applications it is strongly recommended to store them in some persistent storage like database.
