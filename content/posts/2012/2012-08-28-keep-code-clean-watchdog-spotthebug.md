---
title: 'Keep The Code Clean: WatchDog & SpotTheBug Approach'
author: Siva
type: post
date: 2012-08-28T04:55:00+00:00
url: /keep-code-clean-watchdog-spotthebug/
categories:
  - Best-Practices
tags:
  - best-practices
  - java
  - java-ee

---
Before going to discuss **WatchDog & SpotTheBug Approach**, let me give a brief context on what is the needs for this.

Three months back I was asked to write core infrastructure code for our new application which uses all the latest and greatest technologies.  
I have written the infrastructure code and implemented 2 usecases to demonstrate which logic should go into which layer and the code looks good(atleast to me :-)).&nbsp;Then I moved on to my main project and I was hearing that the project that i designed(from Now&nbsp;on-wards&nbsp;I will refer this as ProjectA) is going well.

After 3 months last week one of the developer of ProjectA came to me to help him in resolving some JAXB Marshalling issue. Then I imported the latest code into eclipse&nbsp;and started looking into the issue and I was&nbsp;literally&nbsp;shocked by looking at the messy code. First I resolved that issue and started looking into whole code and I was&nbsp;speechless.&nbsp;How come the code become such a mess in this short span of time, it is just 3 months.



  * There are Date Formatting methods in almost every Service class(Copy&Paste with different names)
  * There are Domain classes with 58 String properties and setters/getters. Customer class contains homeAddressLine1, homeAddressLine2, homeCity.., officeAddrLine1, officeAddrLine2, officeCity&#8230; There is no Address class.
  * In some classes XML to Java&nbsp;marshaling&nbsp;is done using JAXB and in some other classes using XStream and in some other places constructing XML string manually even though there is core utilities module with lots of XML&nbsp;marshaling&nbsp;utility methods.
  * In some classes SLF4J Logger is used and in some places Log4J Logger is being used.

and the list goes on&#8230;

So what just happend? Where is the problem?

We started this project by pledging to keep the code clean and highly maintainable/enhanceable. But now it is in worst possible state.

> **_Somehow it is understandable if the code is legacy code and is messy&nbsp;because&nbsp;today's latest way of doing things becomes tomorrow's legacy and bad approach like externalizing the application configuration into XML was the way to go sometime back and now it became XML hell with shiny new Annotations.&nbsp;I am pretty sure that in a&nbsp;couple&nbsp;of years we will see &#8220;Get Rid of Annotation Hell by Using SomeNew Gr8 Way&#8221;.&nbsp;_**

But, in my case it is just 3 months old project.

When I think about the causes of why that code becomes such a mess I end-up with never-ending list of reasons:

  *  Tight dead lines
  *  Incompetent developers
  *  Not using code quality checking tools
  *  No code reviews
  *  No time to clean the messy code

 etc etc  
   
So whatever the reason your code will become messy after sometime, especially when more number of people are working the project.

The worst part is you can't blame anyone. Developer will say I have no time to cleanup the code as I have assigned high priority tasks. Tech Lead is busy in analysing and assigning the new tasks to developers.  
Manager is busy in aggregating the team's task status reports to satisfy his boss. Architect is busy in designing the new modules for new third party integration services.&nbsp;QA people are busy in preparing/executing their test cases for upcoming releases.

So whose responsibility it is to clean the code? Or in other way, How can we keep code clean even with all the above said Busy circumstances?

Before going to explain How &#8220;WatchDog & SpotTheBug Approach&#8221; works let me tell you another story.

3 years back I worked on a banking project which is well designed, well organised and well written code that I have ever seen so far.&nbsp;That&nbsp;project&nbsp;started almost 10 years back, but still the code quality is very good. How is it possible?

> **_The only reason is If any developer check-in the code with some bad code like adding duplicate utility methods then within 4 hours that developer will recieve an email from a GUY asking for the explanation what is the need to add that method when that utility method is already available in core-utilities module.&nbsp;In case there is no valid reason, that developer has to open a new defect with &#8220;Cleaning Bad Code&#8221; in the defect title, assign the defect to himself and change the code and should check-in the files ASAP._**

With this process, every team member in our team used to tripple check the code before checking into repository.

I think this is the best possible way to keep the code clean. By now you may have clue on what I mean by &#8220;WatchDog&#8221;. Yes, I called the GUY as WatchDog.&nbsp;First of all, sorry for calling such an important role as Dog but it better describe what that guy will do. It will bark as soon as it saw some bad code.

**Need for WatchDog:**  

As I mentioned above, everyone in the team might be busy with their high-priority tasks. They might not be able to spend time on cleaning the code.&nbsp;Also from the Business perspective Adding new customer-requested features might be high-priority than cleaning the code.&nbsp;Sometime even though Business know that in long run there is a chance that entire application becomes un-maintainable if they don't cleanup the mess they will have to satisfy their customer first with some quick new features and will opt for short-term benefits.

We have plenty of Quality Checking tools like PMD, FindBugs, Sonar. But does these tools suggest to create an Address class instead of repeating all address properties for different type of addresses as i mentioned above.&nbsp;Does these tools suggest you to use same xml marshalling library across the project. As far as I know, they won't.

So if you really want your software/product to sustain over time, I would suggest to hire a dedicated WatchDog(Human Being).

**The WatchDog's primary responsibilities would be:**

  * Continuously&nbsp;checking for the code smells, duplicate methods, coding standards violations and send the report to entire team.
  * If possible point out the existing utility to use instead of creating duplicate methods.
  * Checking for design violations like establishing Database Connection or Transaction management code in wrong places(web layer for ex).
  * Checking for cyclic dependencies for between modules.
  * Exploring and suggesting well established, tested generic libraries like apache commons-*.jars, Google Guava instead of writing home grown solutions(I feel like instead of writing home grown Cache Management better to use Guava Cache,but YMMV)

So far so good if the WatchDog does its job well. What if the WatchDog itself is inefficient?? What if WatchDog is not Skilled enough to perform its job?&nbsp;Who is going to check whether WatchDog is doing good or not? Here **SpotTheBug** program comes into the picture.

**SpotTheBug**  
I strongly believe in having a friendly culture to encourage the developers to come up with thoughts to better the software.

Every week each team member should come up with 3 points to better/clean the code. They can be:&nbsp;Bad code Identification, Better Design, New Features etc.

Instead of just saying that code is bad code, he has to specify why he is feeling that code is bad, how to rewrite it in better way and what would be the impact.

Based on the effectiveness of the points, value-points should be given to the developer and those points should definitely be considered in performance review(There should be some motivation right :-)).  

With WatchDog and SpotTheBug programs in place, if the team can identify the bad code before the WatchDog caught it then it is going to be a negetive point for WatchDog.&nbsp;If WatchDog continuously getting negative points then it is time to evaluate the effectiveness of WatchDog itself.

**_By using this WatchDog & SpotTheBug approach combined with proper usage of Code Quality Checking Tools(FindBugs, PMD, Sonar) we can make sure the code is clean to the maximum extent._**

