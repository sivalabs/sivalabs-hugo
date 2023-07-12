---
title: JCart Release Planning
author: Siva
type: post
date: 2015-11-24T04:26:20+00:00
url: /jcart-release-planning/
categories:
  - Java
tags:
  - E-Commerce
  - jcart

---
In our previous article 
[JCart Requirements Analysis]({{< relref "2015-11-21-jcart-requirements-analysis.md" >}})
we have listed out all the requirements that we need to implement for JCart application. Now we need to come up with an implementation and release plan. As we are following iteration model, we will plan for N iterations where in each iteration we will implement some usecases.

After listing out all the implementation tasks and based on the task dependencies, we came up with the following Iteration plan.

### [Iteration - 1]({{< relref "2015-12-01-jcart-iteration-1.md" >}})

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

### [Iteration - 2]({{< relref "2015-12-18-jcart-iteration-2.md" >}})

  * Security 
      * Manage Privileges &#8211; List all privileges
      * Manage Roles 
          * List all Roles
          * Create new Role
          * Add/Remove Permission to/from Role
      * Manage Users 
          * List all Users
          * Create new User
          * Add/Remove Roles to/from User

### [Iteration - 3]({{< relref "2015-12-20-jcart-iteration-3-manage-categories-and-products.md" >}})

  * Site Settings &#8211; Locale & Currency
  * Manage Categories 
      * Create new Category
      * Update category
  * Manage Products 
      * Create new Product
      * Update Product

### [Iteration - 4]({{< relref "2015-12-30-jcart-iteration-4.md" >}})

  * Initial code setup for ShoppingCart webapp
  * ShoppingCart UI Layout setup
  * Configuring HTTPS/SSL/TLS
  * Home Page
  * Category Page
  * Product Page
  * Product Search Results

### [Iteration - 5]({{< relref "2015-12-31-jcart-iteration-5.md" >}})

  * Add To Cart in HomePage/CategoryPage/ProductPage
  * Cart Page 
      * View Cart Items
      * Updates Quantity
      * Remove Items

### [Iteration - 6]({{< relref "2015-12-31-jcart-iteration-6.md" >}})

  * Mock PaymentService
  * Billing & Delivery Page
  * Customer Login
  * Customer Registration
  * Order Confirmation Page
  * Send Order Confirmation Email

### [Iteration - 7]({{< relref "2015-12-31-jcart-iteration-7.md" >}})

  * Manage Orders 
      * List all Orders
      * View Order details
      * Update Order status
  * Manage Customers 
      * List all customers
      * Search customers
      * View customer details

### [Iteration - 8]({{< relref "2015-12-31-jcart-iteration-8.md" >}})

  * Customer MyAccount Page 
      * Profile
      * Order History

So, for now these are all the usecases we have identified and added to our iterations. We may come to know few more usecases going forward.
  
Looks like we are good to start the implementation. But before jumping on to coding let us take a look at our development environment setup in next article.
