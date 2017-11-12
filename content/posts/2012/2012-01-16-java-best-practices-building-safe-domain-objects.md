---
title: 'Java Best Practices : Building Safe Domain Objects'
author: Siva
type: post
date: 2012-01-16T07:26:00+00:00
url: /2012/01/java-best-practices-building-safe-domain-objects/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/01/java-best-practices-building-safe.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/758698442295734882
post_views_count:
  - 18
categories:
  - Design Patterns
tags:
  - Design Patterns
  - Java

---
Domain objects are the core building blocks of any application. These are the fine grained objects which carries the information about the problem domain model.  
Generally domain objects will be created as dumb data carriers with setters/geters without having any logic. But this will cause huge problem in long run.  
If you build the domain objects with dumb setters and getters we will end up in writing null checks all over the places.

I bet many of us have seen the code snippets like:

<pre>User user = ....;<br />if(user!=null)<br />{<br /> String email = user.getEmail();<br /> if(email != null && StringUtils.trimToNull(email) != null)<br /> {<br />  emailService.sendEmail(....);<br /> }<br /> else<br /> {<br />  throw new Exception("Email should not be null/blank");<br /> }<br /><br />}<br /></pre>

Here email address of User object should not be null at all(It could be a not null property in database).

But with dumb domain objects with only setters/getters we will end up writing code to check for nulls as mentioned above.

We can get rid of this null checks in all over the places we can use Builder pattern.

Assume we need to write a domain Object User with properties id, firstname, lastname, email, dob, phone.  
Among them id, firstname, lastname, email properties are mandatory and should not be null or blank.

In this case we can write the User class using Builder pattern as follows:

<pre>package com.sivalabs.core.model;<br /><br />import java.util.Date;<br /><br />/**<br /> * @author Siva<br /> *<br /> */<br />public class User <br />{<br /> private Integer id;<br /> private String firstname;<br /> private String lastname;<br /> private String email;<br /> private Date dob;<br /> private String phone;<br /> <br /> private User()<br /> {<br /> }<br /> <br /> private User(Integer id, String firstname, String lastname, String email) <br /> {<br />  this.id = id;<br />  this.firstname = firstname;<br />  this.lastname = lastname;<br />  this.email = email;<br /> }<br /><br /> public static final User build(Integer id, String firstname, String lastname, String email)<br /> {<br />  if(id == null || id &lt; 0){<br />   throw new IllegalArgumentException("Id should not be null or negetive.");<br />  }<br />  if(firstname == null || firstname.trim().length()==0){<br />   throw new IllegalArgumentException("firstname should not be null or blank.");<br />  }<br />  if(lastname == null || lastname.trim().length()==0){<br />   throw new IllegalArgumentException("lastname should not be null or blank.");<br />  }<br />  if(email == null || email.trim().length()==0){<br />   throw new IllegalArgumentException("email should not be null or blank.");<br />  }<br />  if(!email.contains("@")){<br />   throw new IllegalArgumentException("Invalid email address.");<br />  }<br />  return new User(id,firstname, lastname, email);<br /> }<br /> <br /> public Integer getId() {<br />  return id;<br /> } <br /> public String getFirstname() {<br />  return firstname;<br /> }<br /> <br /> public String getLastname() {<br />  return lastname;<br /> }<br /> <br /> public String getEmail() {<br />  return email;<br /> }<br /> <br /> public Date getDob() {<br />  return new Date(dob.getTime());<br /> }<br /> <br /> public User dob(Date dob) {<br />  this.dob = new Date(dob.getTime());<br />  return this;<br /> }<br /> public String getPhone() {<br />  return phone;<br /> }<br /> public User phone(String phone) {<br />  this.phone = phone;<br />  return this;<br /> } <br /> <br />}<br /></pre>

Following are the steps to build safe domain objects:

**1. Make default constructor as private preventing others creating empty instances.** **&nbsp;**  
**2. Create a private parametrized constructor with mandatory arguments only.** **&nbsp;**  
**3. Provide a public static build() method taking mandatory arguments, validate them and then build the object using parametrized constructor.** **&nbsp;**  
**4. Create setter methods (I have used Method chaining here) for optional properties.&nbsp;**  
**&nbsp;**   
With this procedure I need not check for nulls for the mandatory arguments becuase if I have a non-null user object means it contains valid values for mandatory properties.