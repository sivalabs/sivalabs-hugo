---
title: GeneratedValue not setting up auto increment in mysql and h2 dialects
author: Siva
type: post
date: 2012-04-26T07:57:00+00:00
url: /2012/04/generatedvalue-not-setting-up-auto-increment-in-mysql-and-h2-dialects/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/04/generatedvalue-not-setting-up-auto.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/3785524139059219437
post_views_count:
  - 8
categories:
  - Java
tags:
  - Hibernate
  - Java
  - JBoss

---
Hi,  
In earlier versions of Hibernate if we want to have an auto_increment primary key we can use the following:

@Id @GeneratedValue(strategy=GenerationType.AUTO)  
@Column(name=&#8221;user_id&#8221;)  
private Integer userId;

But in latest version of Hibernate(may be Hibernate4, whatever is used in JBoss AS7) this doesn&#8217;t work as expected. The generated table primary key is not auto_increment column.

**To resolve this configure&nbsp;<span style="color: red;"><property name=&#8221;hibernate.id.new_generator_mappings&#8221; value=&#8221;false&#8221;></span> in persistence.xml.**
