---
author: siva
comments: true
date: 2011-02-21 06:44:00+00:00
layout: post
slug: solution-for-eclipse-is-running-in-jre
title: Solution for "Eclipse is running in a JRE, but a JDK is required" problem
wordpress_id: 278
categories:
- IDE
- Maven
tags:
- IDE
- Maven
---

Hi,
When i installed Maven2 Plugin for eclipse i was getting the below error message when i startup my Eclipse IDE.
After that when I tried to perform Maven operations thrugh Eclipse I got some errors saying ".../tools.jar" is not there.

I did the below things to get rid of that problem.

open the eclipse.ini file and add the below argument.
-vm
C:/Siva/Java/jdk1.6.0_04/bin/javaw.exe

Note: The VM configuration should be in two lines and in between --lancher and -vmargs.
--launcher.XXMaxPermSize
256m
-vm
C:/Siva/Java/jdk1.6.0_04/bin/javaw.exe
-vmargs
-Dosgi.requiredJavaVersion=1.5
-Xms40m
-Xmx512m
