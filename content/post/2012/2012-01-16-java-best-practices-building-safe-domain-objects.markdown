---
author: siva
comments: true
date: 2012-01-16 12:56:00+00:00
layout: post
slug: java-best-practices-building-safe-domain-objects
title: 'Java Best Practices : Building Safe Domain Objects'
wordpress_id: 249
categories:
- Design Patterns
- Java
tags:
- Design Patterns
- Java
---

Domain objects are the core building blocks of any application. These are the fine grained objects which carries the information about the problem domain model.  
Generally domain objects will be created as dumb data carriers with setters/geters without having any logic. But this will cause huge problem in long run.  
If you build the domain objects with dumb setters and getters we will end up in writing null checks all over the places.  
  
I bet many of us have seen the code snippets like:  
  

    
    User user = ....;<br></br>if(user!=null)<br></br>{<br></br> String email = user.getEmail();<br></br> if(email != null && StringUtils.trimToNull(email) != null)<br></br> {<br></br>  emailService.sendEmail(....);<br></br> }<br></br> else<br></br> {<br></br>  throw new Exception("Email should not be null/blank");<br></br> }<br></br><br></br>}<br></br>

  
Here email address of User object should not be null at all(It could be a not null property in database).  
  
But with dumb domain objects with only setters/getters we will end up writing code to check for nulls as mentioned above.  
  
We can get rid of this null checks in all over the places we can use Builder pattern.  
  
Assume we need to write a domain Object User with properties id, firstname, lastname, email, dob, phone.  
Among them id, firstname, lastname, email properties are mandatory and should not be null or blank.  
  
In this case we can write the User class using Builder pattern as follows:  
  

    
    package com.sivalabs.core.model;<br></br><br></br>import java.util.Date;<br></br><br></br>/**<br></br> * @author Siva<br></br> *<br></br> */<br></br>public class User <br></br>{<br></br> private Integer id;<br></br> private String firstname;<br></br> private String lastname;<br></br> private String email;<br></br> private Date dob;<br></br> private String phone;<br></br> <br></br> private User()<br></br> {<br></br> }<br></br> <br></br> private User(Integer id, String firstname, String lastname, String email) <br></br> {<br></br>  this.id = id;<br></br>  this.firstname = firstname;<br></br>  this.lastname = lastname;<br></br>  this.email = email;<br></br> }<br></br><br></br> public static final User build(Integer id, String firstname, String lastname, String email)<br></br> {<br></br>  if(id == null || id < 0){<br></br>   throw new IllegalArgumentException("Id should not be null or negetive.");<br></br>  }<br></br>  if(firstname == null || firstname.trim().length()==0){<br></br>   throw new IllegalArgumentException("firstname should not be null or blank.");<br></br>  }<br></br>  if(lastname == null || lastname.trim().length()==0){<br></br>   throw new IllegalArgumentException("lastname should not be null or blank.");<br></br>  }<br></br>  if(email == null || email.trim().length()==0){<br></br>   throw new IllegalArgumentException("email should not be null or blank.");<br></br>  }<br></br>  if(!email.contains("@")){<br></br>   throw new IllegalArgumentException("Invalid email address.");<br></br>  }<br></br>  return new User(id,firstname, lastname, email);<br></br> }<br></br> <br></br> public Integer getId() {<br></br>  return id;<br></br> } <br></br> public String getFirstname() {<br></br>  return firstname;<br></br> }<br></br> <br></br> public String getLastname() {<br></br>  return lastname;<br></br> }<br></br> <br></br> public String getEmail() {<br></br>  return email;<br></br> }<br></br> <br></br> public Date getDob() {<br></br>  return new Date(dob.getTime());<br></br> }<br></br> <br></br> public User dob(Date dob) {<br></br>  this.dob = new Date(dob.getTime());<br></br>  return this;<br></br> }<br></br> public String getPhone() {<br></br>  return phone;<br></br> }<br></br> public User phone(String phone) {<br></br>  this.phone = phone;<br></br>  return this;<br></br> } <br></br> <br></br>}<br></br>

Following are the steps to build safe domain objects:  
  
**1. Make default constructor as private preventing others creating empty instances.** ** **  
**2. Create a private parametrized constructor with mandatory arguments only.** ** **  
**3. Provide a public static build() method taking mandatory arguments, validate them and then build the object using parametrized constructor.** ** **  
**4. Create setter methods (I have used Method chaining here) for optional properties. **  
** **   
With this procedure I need not check for nulls for the mandatory arguments becuase if I have a non-null user object means it contains valid values for mandatory properties.
