---
title: NetBeansIDE and IntellijIDEA From The Eyes of a Long Time Eclipse User
author: Siva
type: post
date: 2014-10-13T07:15:00+00:00
url: /2014/10/netbeanside-and-intellijidea-from-eyes/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/10/netbeanside-and-intellijidea-from-eyes.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2779599874526813816
post_views_count:
  - 3
categories:
  - IDE
tags:
  - IDE

---
I have been using Eclipse IDE since 2006 and I liked it so much for various reasons. First it is open source and free to use. Eclipse looks pretty neat on Windows OS on which I work most of the time. Occasionally I tried to use NetBeansIDE (before 6.x version) and I didn&#8217;t like it because it&#8217;s too slow. And I never tried IntellijIDEA because it&#8217;s a commercial product and I am 100% sure that my employer is not going to pay $$$ for an IDE.

So over the years I have been using JavaEE based Eclipse version and once I found SpringSource Tool Suite it became my default Java IDE for everything. I like Spring framework very much and I use Spring technologies everyday, both on personal and official projects. STS provides lot of additional features for Spring related technologies like auto-completion in spring xml files, beans graph etc etc. I should mention SpringBoot support in STS specifically. You can create SpringBoot applications with lot of customization options(which modules to use, java version, maven/gradle, java/groovy etc) right from the IDE itself. As of now no other IDE has this much of good support for SpringBoot.

But as everyone knows working with Eclipse isn&#8217;t fun all the times. It has it&#8217;s own set of problems. I get used to see the NullPointerException or  IllegalArgumentException error alerts all the times. When you press Ctrl + Space you may get auto completion suggestion or get an error alert. If you type too fast and press Ctrl+Space many times then Eclipse might disappear and shows a big alert box with very useful details. If you have many open projects in your workspace and if it contains JPA/JSF/JAX-WS/JAX-RS modules then as soon as you opened your Eclipse it may stuck in Building Workspace state forever. The only way to solve it is End Process via Task Manager.

Till this point its bearable. If you install any plugin which contain any conflicting XML libraries then the real problems start. As soon as you open pom.xml you will get to see error alerts repeatedly, you can&#8217;t even close it..it keeps popping up the error alerts. If you are lucky then restarting eclipse might solve the issue or you have to try uninstalling the newly installed plugin(which never solved the problem for me) or start with a new Eclipse altogether.

Even after all these pains I stick to Eclipse because I get used to it. As I said I have been using STS and till STS-3.5.1 version it&#8217;s fine and I am OK to live with all the previously mentioned pain points.

But once I downloaded STS-3.6.0 and started using it, things get even worse. First, Gradle plugin didn&#8217;t work. After googling for a while there is already a bug filed regarding the same issue. I thought this may be resolved in STS-3.6.1 release but it is not. Then I upgraded Gradle plugin with nightly build and it started working fine. I am very happy. Then I started my SpringBoot application and it worked fine. Great!!. Then I opened another Java class and made some changes and tried to click on Relaunch button. As soon as mouse cursor is on Relaunch button it is showing error alert. Navigate to any other file and put cursor on Relaunch button then again it will show error alert. What the hell!! For almost 4 days I was struggling with these kind of issues only. I Haven&#8217;t ever started writing code at all.

I told myself &#8220;Enough!! Shut this f\***king eclipse and start using some better IDE, come out of you Eclipse comfort zone&#8221;.

I have been playing with NetBeansIDE every now and then, and I am aware that NetBeansIDE got lot better than its previous versions, especially from 7.x onwards its very fast and feature rich. A year ago I tried IntellijIDEA Ultimate edition with trial version and it&#8217;s totally confusing to me because of my prior Eclipse experience.

When I google for &#8220;Eclipse vs NetBeansIDE vs IntellijIDEA&#8221; there are lots of articles comparing them and almost every article ends with a conclusion that &#8220;IntellijIDEA > NetBeansIDE > Eclipse&#8221;. But I though of trying NetBeansIDE and IntellijIDEA myself. So I installed NetBeansIDE 8.0.1 and IntellijIDEA Ultimate Edition 13.

**<span style="font-size: large;">How I feel about NetBeansIDE:</span>**
  
First thing I noticed is NetBeansIDE totally improved over its previous versions. It is fast and feature rich.
  
**Pros:**

  * You will get most the Java stuff that you need out-of-the-box. You don&#8217;t need to hunt for plugins.
  * If your project is based on JavaEE technologies like CDI/EJB/JPA/JSF/JAX-RS then you will love NetBeansIDE. It has awesome code generators for JPA Entities from Database, JSF views from Entities, JAX-RS resource from Entities etc.
  * Its Maven support is fantastic. Looking up and adding dependencies works out-of-the-box. No need to check &#8220;Download Indexes at startup&#8221; and perform Rebuild Indexes..You know what I mean 🙂
  * Great support for HTML5 technologies, especially AngularJS. Auto completion for AngularJS directives is amazing.
  * You can download and install many of the popular Javascript libraries right from the IDE itself.
  * It has very good Java8 support. It even shows code recommendations to turn for-loops into Java8 streams and lambdas.
  * Recently I am learning Mobile App development using PhoneGap/Cordova. Getting started with Cordova in NetBeans is a piece of cake.

**Cons:**

  * No workspace concept. For some people it could be an advantage, but for me its a disadvantage. Usually I maintain multiple workspaces for different projects and at times I would like to open them in parallel.
  * Opening multiple NetBeans IDEs is possible, but it should not be that difficult.
  * At home I installed NB 8.0.1 and Wildlfy 8.0.0.FINAL and worked well. The very same day Wildlfy 8.1.0.FINAL got released and at office I tried to run an app using NB 8.0.1 and Wildlfy 8.1.0.FINAL and it&#8217;s not working at all. After pulling off my hair for few hours I figured it out that NB 8.0.1 doesn&#8217;t work with Wildlfy 8.1.0 version yet. That&#8217;s a little bit odd!! Wildlfy changed that much from 8.0.0 to 8.1.0????
  * I just created a web application and tried to deploy on Tomcat, what should go wrong!! But while deployment its failing. After struggling for few minutes and found answer in StackOverflow that it might be because of Proxy issue. After configuring my corporate proxy details in NetBeans its working fine.
  * But this is not cool. Deploying an app on my local tomcat should not worry about Proxy..right??!!??
  * There is no shortcut for block comment!!! Come on&#8230;

Overall I liked NetBeans IDE very much. Being an open source and Free IDE NetBeans is awesome.

**<span style="font-size: large;">How I feel about IntellijIDEA:</span>**
  
Whenever I read about IntellijIDEA user experience, I always here &#8220;wow&#8221;, &#8220;amazing&#8221;,&#8221;can&#8217;t go back to Eclipse/NB&#8221; and &#8220;I don&#8217;t mind paying $$$ for such a wonderful tool&#8221;!!. But I struggled a bit to get used to its Project/Module style of code organization because of my previous Eclipse Workspace/Project style experience. Still I am not very comfortable with it but it&#8217;s not a blocker.

**Pros:**

  * No random NullPointerException/IllegalArgumentException exception alerts.
  * Everything can be done from IDE itself. Be it Working with Database, tinkering from Command Prompt, Maven/Gradle tasks execution, RestClient etc etc.
  * AutoCompletion support is just mind blowing. Type sort and Ctrl+Space twice showing sort methods from all Java classes. Wonderful.
  * Interaction with many Version Control Systems works smoothly.
  * Support for other IDE&#8217;s key bindings.

**Cons: **

  * Well, following may not be really Cons, but from an Eclipse user perspective following are confusing and difficult to get use to it:
  * Project/Module style code organization is very different from other IDEs.
  * I terribly miss right clicking on a web project and choosing Run on Server. It took me 30 mins to figure out how to run a web application on IntellijIDEA. Please provide an option &#8220;Run on Server&#8221; and open Edit Configuration window to choose the Server and other stuff.

Actually, it is too early for me to say whether IntellijIDEA is best or not because still I am learning to do things in Intellij way. But I can clearly sense that IntellijIDEA is very addictive because of its Editing capabilities and &#8220;Everything from IDE&#8221; experience. But the major issue is it is very costly and I am 100% sure that my employer won&#8217;t pay for IDE though its great productivity booster.

I am actually considering to use IntellijIDEA Community Edition also because it has Java/Groovy/Maven/Gradle support. And SpringBoot can be run as a standalone Java program and no need of Server support.

Overall I feel it is powerful and feature rich IDE and I just need to understand the IntellijIDEA way of doing things.

**<span style="font-size: large;">What Eclipse features I missed from NetbeansIDE/IntellijIDEA:</span>**

After playing with NetBeansIDE and IntellijIDEA, I feel Eclipse is better in the following aspects:

  * Support for multiple workspaces and multiple instances
  * Eclipse color scheme for Java editor is pleasant than NetBeans glassy look and IntellijIDEA&#8217;s dull grey look.
  * Sensible Eclipse shortcut key bindings. Many of the key bindings don&#8217;t include crazy combination of Ctrl+Shift+Alt as in IntellijIDEA.
  * Maven pom editor&#8217;s Dependency Hierarchy Tab view which provides a neat view of &#8220;from where this jar dependency came&#8221;. Simple tree structure looks better than fancy graphs to me.

**<span style="font-size: large;">Conclusion:</span>**
  
All in all, what I came to know is most of the things that you do in one IDE can also be done in other IDEs as well. It is just a matter of getting use to the selected IDEs way of doing things. But if you are spending lot of time fighting with IDE itself then it&#8217;s a red flag. You should consider moving to a better IDE.

After playing with NetBeans and IntellijIDEA I came to the conclusion that:

> If you have to work with JavaEE projects heavily go with NetBeans. If you can get a license for IntellijIDEA that&#8217;s great, if not choose a stable version of STS and live with it. Don&#8217;t just upgrade your Eclipse/STS because there is a newer version released. Newer not always means better.

&nbsp;