---
title: Select ALL starters on Spring Initializer (http://start.spring.io)
author: Siva
type: post
date: 2017-10-18T02:50:23+00:00
url: /2017/10/select-all-starters-on-spring-initializer-httpstart-spring-io/
categories:
  - Spring
  - Tips
tags:
  - SpringBoot
  - Tips

---
If you are working on Spring Boot then you most probably aware of Spring Initializer (http://start.spring.io) which is an online spring boot application generator. You can select the starters that you want to use and then generate the application.

**If you notice that there is no SELECT ALL option to select all the starters. Who would do that insane thing of selecting all the starters for an application??!!???**

But, i would like to have the SELECT ALL option for one single reason:
  
**I can download all the dependencies ahead of time when I have good internet connectivity so that I can continue working even in offline. This is especially useful for conference speakers so that they don&#8217;t have to be at the mercy of conference WIFI connectivity.**

So, when a new spring boot version is released I usually do the following:

  * Go to http://start.spring.io
  * Click on Switch to the full version
  * Open Developer Tools/Console and run the following script:

{{< highlight javascript >}}var inputs = document.getElementsByTagName('input');
for (var i = 0; i &lt; inputs.length; i++)
{
    if (inputs[i].type == 'checkbox' && !inputs[i].disabled) {
       inputs[i].checked = true;
    }
}
{{</ highlight >}}

  * Click on Generate Project and open the project in your favorite IDE.

<span style="color: #ff0000;"><strong>Again, this is only to download maven dependencies and keep them readily available.</strong></span>
