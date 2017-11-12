---
title: 'JCart : Iteration-2'
author: Siva
type: post
date: 2015-12-18T13:38:10+00:00
url: /2015/12/jcart-iteration-2/
post_views_count:
  - 15
categories:
  - Java
tags:
  - jcart

---
Now we have completed Iteration-1 tasks. Iteration-1 includes so many tasks to establish the foundation like configuring Spring Security, Thymeleaf settings, UI layout setup etc. I hope from now on we can put more focus on actual tasks implementation rather than infrastructure setup.

Though majority of the infrastructure setup is in place now, we will implement Role Based Access Control (RBAC) security using User-Role-Permission model before jumping on to Category/Product management.

As part of Iteration-2, we will be implementing the following UseCases:

  * Security 
      * Manage Privileges – List all privileges
      * Manage Roles 
          * List all Roles
          * Create new Role
          * Add/Remove Permission to/from Role
      * Manage Users 
          * List all Users
          * Create new User
          * Add/Remove Roles to/from User