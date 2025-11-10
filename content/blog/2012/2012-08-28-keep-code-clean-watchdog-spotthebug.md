---
title: 'Keep The Code Clean: WatchDog & SpotTheBug Approach'
author: Siva
type: post
date: 2012-08-28T04:55:00.000Z
url: /blog/keep-code-clean-watchdog-spotthebug/
categories:
  - Best-Practices
tags:
  - best-practices
  - java
  - java-ee
aliases:
  - /keep-code-clean-watchdog-spotthebug/
---
Before discussing the **WatchDog & SpotTheBug Approach**, let me give a brief context on the need for this.

Three months back, I was asked to write core infrastructure code for our new application, which uses all the latest and greatest technologies.
I have written the infrastructure code and implemented two use cases to demonstrate which logic should go into which layer, and the code looks good (at least to me :-)). Then I moved on to my main project, and I was hearing that the project that I designed (from now onwards, I will refer to this as ProjectA) is going well.

After 3 months, last week, one of the developers of ProjectA came to me to help him in resolving a JAXB Marshalling issue. Then I imported the latest code into Eclipse and started looking into the issue, and I was literally shocked by looking at the messy code. First, I resolved that issue and started looking into the whole code, and I was speechless. How did the code become such a mess in this short span of time? It has only been 3 months.

*   There are Date Formatting methods in almost every Service class (Copy & Paste with different names).
*   There are Domain classes with 58 String properties and setters/getters. The Customer class contains homeAddressLine1, homeAddressLine2, homeCity..., officeAddrLine1, officeAddrLine2, officeCity… There is no Address class.
*   In some classes, XML to Java marshaling is done using JAXB, in some other classes using XStream, and in some other places, constructing XML strings manually even though there is a core utilities module with lots of XML marshaling utility methods.
*   In some classes, SLF4J Logger is used, and in some places, Log4J Logger is being used.

and the list goes on…

So what just happened? Where is the problem?

We started this project by pledging to keep the code clean and highly maintainable/enhanceable. But now it is in the worst possible state.

> **_Somehow it is understandable if the code is legacy and messy because today's latest way of doing things becomes tomorrow's legacy and bad approach. For example, externalizing the application configuration into XML was the way to go sometime back, and now it has become an XML hell with shiny new Annotations. I am pretty sure that in a couple of years, we will see "Get Rid of Annotation Hell by Using Some New Great Way"._**

But, in my case, it is just a 3-month-old project.

When I think about the causes of why that code became such a mess, I end up with a never-ending list of reasons:

*   Tight deadlines
*   Incompetent developers
*   Not using code quality checking tools
*   No code reviews
*   No time to clean the messy code

etc., etc.

So whatever the reason, your code will become messy after some time, especially when more people are working on the project.

The worst part is you can't blame anyone. A developer will say, "I have no time to clean up the code as I have been assigned high-priority tasks." The Tech Lead is busy analyzing and assigning new tasks to developers.
The manager is busy aggregating the team's task status reports to satisfy his boss. The architect is busy designing new modules for new third-party integration services. QA people are busy preparing/executing their test cases for upcoming releases.

So whose responsibility is it to clean the code? Or, in other words, how can we keep the code clean even with all the above-said busy circumstances?

Before explaining how the "WatchDog & SpotTheBug Approach" works, let me tell you another story.

3 years back, I worked on a banking project which was well-designed, well-organized, and had the best-written code I have ever seen so far. That project started almost 10 years back, but still, the code quality is very good. How is it possible?

> **_The only reason is that if any developer checks in the code with some bad code, like adding duplicate utility methods, then within 4 hours, that developer will receive an email from a GUY asking for an explanation of what the need was to add that method when that utility method was already available in the core-utilities module. In case there is no valid reason, that developer has to open a new defect with "Cleaning Bad Code" in the defect title, assign the defect to himself, change the code, and check in the files ASAP._**

With this process, every team member in our team used to triple-check the code before checking it into the repository.

I think this is the best possible way to keep the code clean. By now, you may have a clue on what I mean by "WatchDog". Yes, I called the GUY a WatchDog. First of all, I'm sorry for calling such an important role a Dog, but it better describes what that guy will do. It will bark as soon as it sees some bad code.

**Need for WatchDog:**

As I mentioned above, everyone in the team might be busy with their high-priority tasks. They might not be able to spend time cleaning the code. Also, from the business perspective, adding new customer-requested features might be a higher priority than cleaning the code. Sometimes, even though Business knows that in the long run, there is a chance that the entire application will become un-maintainable if they don't clean up the mess, they will have to satisfy their customer first with some quick new features and will opt for short-term benefits.

We have plenty of Quality Checking tools like PMD, FindBugs, and Sonar. But do these tools suggest creating an Address class instead of repeating all address properties for different types of addresses, as I mentioned above? Do these tools suggest you use the same XML marshaling library across the project? As far as I know, they won't.

So if you really want your software/product to sustain over time, I would suggest hiring a dedicated WatchDog (a Human Being).

**The WatchDog's primary responsibilities would be:**

*   Continuously checking for code smells, duplicate methods, and coding standards violations and sending the report to the entire team.
*   If possible, point out the existing utility to use instead of creating duplicate methods.
*   Checking for design violations like establishing a Database Connection or Transaction management code in the wrong places (the web layer, for example).
*   Checking for cyclic dependencies between modules.
*   Exploring and suggesting well-established, tested generic libraries like Apache Commons-\*.jars, Google Guava instead of writing homegrown solutions (I feel like instead of writing homegrown Cache Management, it's better to use Guava Cache, but YMMV).

So far, so good if the WatchDog does its job well. What if the WatchDog itself is inefficient? What if the WatchDog is not skilled enough to perform its job? Who is going to check whether the WatchDog is doing a good job or not? Here, the **SpotTheBug** program comes into the picture.

**SpotTheBug**
I strongly believe in having a friendly culture to encourage developers to come up with thoughts to better the software.

Every week, each team member should come up with 3 points to better/clean the code. They can be: Bad code Identification, Better Design, New Features, etc.

Instead of just saying that the code is bad, he has to specify why he is feeling that the code is bad, how to rewrite it in a better way, and what the impact would be.

Based on the effectiveness of the points, value points should be given to the developer, and those points should definitely be considered in the performance review (there should be some motivation, right? :-)).

With WatchDog and SpotTheBug programs in place, if the team can identify the bad code before the WatchDog catches it, then it is going to be a negative point for the WatchDog. If the WatchDog continuously gets negative points, then it is time to evaluate the effectiveness of the WatchDog itself.

**_By using this WatchDog & SpotTheBug approach, combined with proper usage of Code Quality Checking Tools (FindBugs, PMD, Sonar), we can make sure the code is clean to the maximum extent._**
