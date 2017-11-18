---
title: JCart Release Planning
author: Siva
type: post
date: 2015-11-24T04:26:20+00:00
url: /2015/11/jcart-release-planning/
post_views_count:
  - 11
categories:
  - Java
tags:
  - E-Commerce
  - jcart

---
In our previous article 
[JCart Requirements Analysis]({{< relref "2015-11-21-jcart-requirements-analysis.md" >}})
we have listed out all the requirements that we need to implement for JCart application.  Now we need to come up with an implementation and release plan. As we are following iteration model, we will plan for N iterations where in each iteration we will implement some usecases.

After listing out all the implementation tasks and based on the task dependencies, we came up with the following Iteration plan.

**Iteration#1:**

  * Initial code setup for Admin webapp
  * Domain Modelling and Database Designing
  * Creating JPA Entities
  * Email Service SetUp
  * Admin UI Layout SetUp
  * Admin Login
  * Admin Forgot Password
  * Admin Reset Password
  * Configuring HTTPS/SSL/TLS
  * Setting up Jenkins/SonarQube

**Iteration#2:**

  * Security 
      * Manage Privileges &#8211; List all privileges
      * Manage Roles 
          * List all Roles
          * Create new Role
          * Add/Remove Permission to/from Role
      * Manage Users 
          * List all Users
          * Create new User
          * Add/Remove Roles to/from User

**Iteration#3:**

  * Site Settings &#8211; Locale & Currency
  * Manage Categories 
      * Create new Category
      * Update category
  * Manage Products 
      * Create new Product
      * Update Product

**Iteration#4:**

  * Initial code setup for ShoppingCart webapp
  * ShoppingCart UI Layout setup
  * Configuring HTTPS/SSL/TLS
  * Home Page
  * Category Page
  * Product Page
  * Product Search Results

**Iteration#5:**

  * Add To Cart in HomePage/CategoryPage/ProductPage
  * Cart Page 
      * View Cart Items
      * Updates Quantity
      * Remove Items

**Iteration#6:**

  * Mock PaymentService
  * Billing & Delivery Page
  * Customer Login
  * Customer Registration
  * Order Confirmation Page
  * Send Order Confirmation Email

**Iteration#7:**

  * Manage Orders 
      * List all Orders
      * View Order details
      * Update Order status
  * Manage Customers 
      * List all customers
      * Search customers
      * View customer details

**Iteration#8**

  * Customer MyAccount Page 
      * Profile
      * Order History

So, for now these are all the usecases we have identified and added to our iterations. We may come to know few more usecases going forward.
  
Looks like we are good to start the implementation. But before jumping on to coding let us take a look at our development environment setup in next article.
