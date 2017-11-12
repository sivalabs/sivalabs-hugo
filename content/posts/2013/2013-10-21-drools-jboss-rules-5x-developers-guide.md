---
title: Drools JBoss Rules 5.X Developer’s Guide Book Review
author: Siva
type: post
date: 2013-10-21T04:58:00+00:00
url: /2013/10/drools-jboss-rules-5x-developers-guide/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2013/10/drools-jboss-rules-5x-developers-guide.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2052005158921866317
post_views_count:
  - 2
categories:
  - Books
tags:
  - Java

---
We all start our new projects by promising to follow best practices and good design principles etc.  
But over the time business rules change and developers keep adding new features or updates existing logic.  
In this process the common mistake done by many teams is putting if-else conditions here and there instead of coming up with better design to support enhancements. Once these feature turn on/off flags and behavior branching logic started creeping into code then overtime it might become un-maintainable mess. The original developers who design the basic infrastructure might left the organization and the current team left with a huge codebase with if-else/switch conditions all over the code.

So we should be very careful while designing the classes holding the business rules and should be flexible for changes. No matter how much care you take you might still need to touch the code whenever a business rule changes.

This is a problem because we are burying the business logic in the code. Drools framework tries to address this problem by externalizing the business rules which can be authored or updated by non-technical people as also (at least theoretically :-)).

Recently a new book is published by **Packt Publishing** titled &#8220;**Drools JBoss Rules 5.X Developer’s Guide**&#8220;.

<div style="clear: both; text-align: center;">
  <a href="https://i1.wp.com/dgdsbygo8mp3h.cloudfront.net/sites/default/files/imagecache/productview_larger/1264OS.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="https://i1.wp.com/dgdsbygo8mp3h.cloudfront.net/sites/default/files/imagecache/productview_larger/1264OS.jpg?w=648" data-recalc-dims="1" /></a>
</div>

Drools JBoss Rules 5.X Developer’s Guide <http://www.packtpub.com/jboss-rules-5-x-developers-guide/book>

I was asked to review the book and here it goes.

_**Chapter 1: Programming declaratively**_  
I would strongly suggest to read this chapter even if you are already familiar with Drools.  
Author Michal Bali explained the problems with putting business rules in code and how Drools addresses these problems.  
This chapter also has When not to use Drools section which I find very useful to determine whether you really need Drools for your project or is it overkill.

**_Chapter 2: Writing Basic Rules:_**  
Here you can start getting your hands dirty by familiarizing yourself with Drools syntax and trying out simple examples.  
This chapter also introduces various concepts and terminology of Drools, so don&#8217;t skip this.

**_Chapter 3: Validating_**  
This chapter covers building a decision service for validating domain model. Any concepts can be explained better with an example rather than lengthy explanations.  
Here author did a good job of taking a real world (if not completely real world, but non-trivial) banking domain model and explained how to build the validation rules with several examples.  
In this chapter you can find plenty of example code snippets that are commonly used in many of the projects.

**_Chapter 4: Transforming Data_**  
This chapter covers transforming data from legacy system to new systems and applying various rules in the transformation process.  
Author explained how to use IBatis for loading data which I find as outdated topic, now it is MyBatis with cool new features.  
**Note:**  
But actually I doubt if any legacy system with huge volumes of data can really use this feature at all because if needs all the data to be loaded in memory.  
I prefer Kettle(Pentaho Data Integration) kind of tools for this purpose.

**_Chapter 5: Creating Human-readable Rules_**  
One of the main promises of Drools is you can configure business rules in human readable format.  
Ofcourse developers are also human beings(:-)) but here the meaning is non-technical people also should be able to understand the rules and with little bit of training they should be able to configure new rules or update existing ones. This chapter covers authoring the rules using Domain Specific Language (DSL). Author covered wide variety of rules configuration options using DSL including configuring and uploading rules &nbsp;from CSV or XLS files.

The rest of the chapter go in-depth of Drools covering advanced topics which I haven&#8217;t yet gone through.

**_Chapter 6: Working with Stateful Session_**  
**_Chapter 7: Complex Event Processing_**  
**_Chapter 8: Defining Processes with jBPM_**  
**_Chapter 9: Building a Sample Application_**  
**_Chapter 10: Testing_**  
**_Chapter 11: Integrating_**  
**_Chapter 12: Learning about Performance_**

**_Appendix A: Setting Up the Development Environment_**  
**_Appendix B: Creating Custom Operators_**  
**_Appendix C: Dependencies of Sample Application_**  
**_  
_****So far I feel it is good read and I would strongly suggest to read this book if you are building an application with complex business rules.**  
**  
**