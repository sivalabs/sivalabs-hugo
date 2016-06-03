---
author: siva
comments: true
date: 2011-12-04 02:59:00+00:00
layout: post
slug: unable-to-create-maven-project-using
title: Unable to create a maven project using appfuse archetypes?
wordpress_id: 251
categories:
- Maven
tags:
- Maven
---

I don't know why sometimes when i tried to create a Maven project using one of appfuse archetypes, eclipse throws error saying unable to create maven project.  
  
I resolved it by doing following:  
  
Window-->Preferences-->Maven-->Archetypes  
Add Remote Catalog : http://repo1.maven.org/maven2/archetype-catalog.xml  
  
Now I am able to create maven projects using Appfuse archetypes.
