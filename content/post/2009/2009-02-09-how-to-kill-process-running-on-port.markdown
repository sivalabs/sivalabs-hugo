---
author: siva
comments: true
date: 2009-02-09 13:26:00+00:00
layout: post
slug: how-to-kill-process-running-on-port
title: How to kill a process running on a port
wordpress_id: 307
categories:
- Miscellaneous
tags:
- Miscellaneous
---

Hi All,  
Many of the Java developers frequently facing some problems with ports.  
Ex: If JBoss server has started and closed accedentally without properly shutdown process , several processes will remain running on some ports which will causes Port Already binded kind of exceptions.  
In that kind of situations, we can forcefully kill a process running on a port as follows:  
1. get the PID of that process  
d:>netstat –ao  
  
2. kill the process  
D:>taskkill /F /PID p_id
