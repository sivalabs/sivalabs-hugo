---
author: siva
comments: true
date: 2012-04-26 07:57:00+00:00
layout: post
slug: generatedvalue-not-setting-up-auto-increment-in-mysql-and-h2-dialects
title: '@GeneratedValue not setting up auto increment in mysql and h2 dialects'
wordpress_id: 243
categories:
- Hibernate
- Java
- JBoss
tags:
- Hibernate
- Java
- JBoss
---

Hi,  
In earlier versions of Hibernate if we want to have an auto_increment primary key we can use the following:  
  
@Id @GeneratedValue(strategy=GenerationType.AUTO)  
@Column(name="user_id")  
private Integer userId;  
  
But in latest version of Hibernate(may be Hibernate4, whatever is used in JBoss AS7) this doesn't work as expected. The generated table primary key is not auto_increment column.  
  
**To resolve this configure <property name="hibernate.id.new_generator_mappings" value="false"> in persistence.xml.**
