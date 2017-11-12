---
title: 'JCart: Domain Modelling and Database Designing'
author: Siva
type: post
date: 2015-12-01T04:22:19+00:00
url: /2015/12/jcart-domain-modelling-and-database-designing/
post_views_count:
  - 18
categories:
  - Java
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

<img class="aligncenter wp-image-634 size-full" src="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jcart-db.png?resize=648%2C743" alt="jcart-db" srcset="https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jcart-db.png?w=781 781w, https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jcart-db.png?resize=261%2C300 261w, https://i2.wp.com/sivalabs.in/wp-content/uploads/2015/12/jcart-db.png?resize=768%2C881 768w" sizes="(max-width: 648px) 100vw, 648px" data-recalc-dims="1" />

&nbsp;

Though we identified **Cart** as a domain entity, we are not creating the table for holding the Cart details. We are going to take the simple approach of storing the active cart details in **HttpSession** only. But in real applications it is strongly recommended to store them in some persistent storage like database.