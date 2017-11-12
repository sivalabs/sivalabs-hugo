---
title: How to kill a process running on a port
author: Siva
type: post
date: 2009-02-09T13:26:00+00:00
url: /2009/02/how-to-kill-process-running-on-port/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2009/02/how-to-kill-process-running-on-port.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/5503413754654426884
post_views_count:
  - 1
categories:
  - Java
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