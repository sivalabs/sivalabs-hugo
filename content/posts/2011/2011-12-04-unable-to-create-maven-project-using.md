---
title: Unable to create a maven project using appfuse archetypes?
author: Siva
type: post
date: 2011-12-03T21:29:00+00:00
url: /2011/12/unable-to-create-maven-project-using/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/12/unable-to-create-maven-project-using.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/6963081679575371062
post_views_count:
  - 11
categories:
  - Misc
tags:
  - Maven

---
I don&#8217;t know why sometimes when i tried to create a Maven project using one of appfuse archetypes, eclipse throws error saying unable to create maven project.

I resolved it by doing following:

Window&#8211;>Preferences&#8211;>Maven&#8211;>Archetypes  
Add Remote Catalog : http://repo1.maven.org/maven2/archetype-catalog.xml

Now I am able to create maven projects using Appfuse archetypes.