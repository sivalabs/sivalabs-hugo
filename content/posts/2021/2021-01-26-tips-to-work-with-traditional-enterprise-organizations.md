---
title: Tips to work at traditional enterprise organizations as consultant/contractor (and save your ass)
author: Siva
images: ["/preview-images/corp-emp.webp"]
type: post
draft: false
date: 2021-01-26T04:59:17+05:30
url: /tips-to-work-with-traditional-enterprise-organizations/
categories: [Thoughts]
tags: [Thoughts]
---

I worked at different types of IT organizations including small 20 people company, world's largest bank,
start-ups etc. Working at a service based company is both very interesting and at times frustrating depending on the client.
On the positive side you get to work on different types of domains/applications, different tech stacks, 
and you may get to learn verity of organizational cultures. On the downside you may end up working with 
**"Typical traditional enterprise organizations"** which makes you question your career choices!!!

If you are about to say dude, **"Typical traditional enterprise organizations" doesn't always mean bad workplaces**.
Yes, I totally agree with you and I have once worked at such a large organization which I still consider "happiest days of my career".
So, there can be "large enterprise organizations" which have great work culture, 
but we are going to talk about the other segment of "Typical traditional enterprise organizations" in this article.

So, what I am referring to as "Typical traditional enterprise organizations"? 
Excluding those very few amazing large organizations, most of the remaining organizations that I worked with have some common qualities, 
hence I used the word **"Typical"**.

These **"Typical traditional enterprise organizations"** 

* Assumes **they are following "Agile" because they are using JIRA and having stand-ups every day**.
* Have **siloed Dev and QA departments** usually reporting to different managers, 
  each team doesn't have a clue on what other team is doing, only come to work together 2 months before production release.
* **Hard to change anything at all because you will need 4 levels of approvals** for any small change in the process.
* If any new joiner suggests any improvement over the current way of doing things, 
  they will be tortured so much that leaves the person with only 2 choices: 
    1) Forget about improvements and become like one of them 
    2) Leave the organization
  
I guess you get the picture of what kind of organizations I am talking about.

**Working at such organizations itself is a challenge. Working at such organization as a vendor/contractor/consultant is even more horrible.**

> There are some simple universal rules of nature:
>
> * Roses are red
> * Lillies are white
> * Customer is king
> * If something goes wrong it is vendor's fault.

So, here are few things I noticed in such types of organizations over and over again.
I tried to handle these problems in different ways and finally settled on few approaches.
These are my approaches based on my personality type and experience. So it may or may not suits you.

> A young one says "Never give up". A wise one says "Know when to give up. Not all the battles are worth fighting for."

### 1. The search for "Declaration of Production Readiness"
You may think playing the role of a project manager or scrum master is easy. No, it's not.
What you may not know is, in these kind of organizations they usually write a **Declaration of Production Readiness** document for each project 
and hides it somewhere in their office building. 

{{< figure src="/images/scroll-letter.webp" height="250" width="280" >}}

The Scrum Master is supposed to find it and do all the things mentioned in that letter 
for the project to be considered as **"Production Ready"**. 
Most of the time, Scrum Masters find that document just 3 weeks before production deadline.
Even more interesting thing is, the "Declaration of Production Readiness" document of all the projects contains same thing:

* Should have tests with minimum 80% code coverage
* Performance test suite proving your APIs are returning response with in max 3 seconds
* Should not use any libraries with known [CVE vulnerabilities](https://cve.mitre.org/)

Once the Scrum Master heroically found the "Declaration of Production Readiness" document, 
they will question the dev team "Why didn't you have minimum 80% test coverage", and you will be tasked to write tests with in a week.

You might be in a shock because whenever you bring up "we are not able to write enough tests due to timelines" 
the very same Scrum Master told you not to worry about tests, QA team will take care of automation testing.

> **Lesson:** Setup code quality checks and linting tools from the beginning of the project so that you don't have to work crazy hours at the end.

### 2. GIVEN "development going on" WHEN "assigned a JIRA card" THEN "ask for clear requirements"
How many times you worked on JIRA cards which contains just the "title"? 
In the Sprint after Sprint mad rush they simply create JIRA cards with nothing but a title and ask you to work on it.
If your scrum master is a **"one day trained certified scrum master"** then there might be description in the card as:
> As a user I should be able to [Whatever is there in title appears here]

You might have verbal discussion with BA/product owner, and they might ask you to start working on it.
But during testing, they might realize they haven't thought about many other scenarios.
Instead of accepting it's a miss from all of us as a team, they question you "why didn't you cover those scenarios?"

> **Lesson:** Never pick up card without having clear requirements. 
If they didn't put any details in the card then ask product owner or scrum master for details and put acceptance criteria, 
what is in scope, what is out of scope clearly and get it reviewed by BA and then start working on it. 
If they insist on starting to work on it without having clear understanding of the card then respectfully disagree.
> 
> Make sure you have the following details in the card before picking it up:
>
> * Detailed description of requirement
> * What is in scope and out of scope
> * Dependencies on other tasks
> * Input and output formats
> * How to handle error scenarios

### 3. Live by rules

You might have read the [Agile Manifesto](https://agilemanifesto.org/) and try to follow few of the things mentioned in the manifesto.

> Individuals and interactions over processes and tools

Stop right there...they may tolerate if you don't deliver on-time, but not following processes is considered as a crime.
Just because Agile Manifesto said **"Responding to change over following a plan"**, 
when you find a bug and quickly fix it and create a PR in 10 minutes then 
you might expect a pat on the shoulder but all you get is a question "Why did you work on a non planned task?"

> **Lesson:** If you found a bug then create a JIRA ticket and let the team know it and tell them you know how to fix it and if they agreed to work on it then fix it.

### 4. Keep project related discussion in official channels
When you raise a DevOps ticket for some resource it may take 2 to 4 days to fulfill that request.
If you have a friend in DevOps team that might be resolved in 20 minutes. 
Having good relationships with fellow team members and other teams greatly helps in many ways.

However, when you are working as a consultant/contractor things will be little different, 99% of the times you will be treated as an outsider only.
In this situation it is better to make every conversation regarding project in the official communication channels only.

If there is an issue going on like deployment failures etc then if you get a direct message from one of the client side team member then it is time to be cautious.
If they ask you questions like **how are you?**, **where are you originally from?** etc then you should be definitely cautious :-).

If there is an issue from their side(ex: devops team) and if they asked you **is there a way to fix from your side(ex: dev team) without going through all "escalation chain"** 
and suppose you know a way of fixing it, you might think of HELPING them and say "YES" then you are done.

While this conversation sounds like YOU ARE HELPING THEM, the way it is going to be conveyed to upper management is 
"the dev team missed some configuration, and they are working on the fix. We(devops team) are blocked on that." 

> **Lesson:** If somebody approached you to do a temporary fix or something then tell them you are happy to help and 
let's take this conversation in the official channel so that team also aware of this and if they have any concerns they will let us know.

### 5. If it's not your responsibility then don't put your finger in that

We are all familiar with the following **"It's not my job"** image, aren't we?

{{< figure src="/images/not-my-job.webp" height="300" width="380" >}}

Yes, in software development world we use this image to represent a bad software engineer attitude.
But I feel this is exactly how I need to be when working at a bad workplace.

Suppose, you came across a very poor(read as shitty) deployment process followed by DevOps team, and you know a far better way.
As someone who genuinely want to improve the overall development process you might propose a new way. 
The scrum master and other team members might have liked the approach whereas DevOps team is not so happy about it because they need to learn something new.

Any new/better way needs some amount of reading and understanding of new way of doing it.
But they (DevOps team)  try to apply it without properly understanding it, missing the required configuration or mis-configuring the details which eventually resulting in errors, more deployment cycles etc.

And, the conclusion would be, as you might have already guessed, **"The issues are because of the new approach proposed by those vendors"**.

Your project manager or scrum master might agree with you at cafeteria or parking lot that the issue happened because of their DevOps team fault, but they have to backup their team in front of everyone.

> **Lesson:** Before proposing a better way think twice is the organization/team members are open for suggestions or not.

## Summary
I worked at some places where the colleagues are super talented and getting your PR approved is like an achievement.
They shred your PullRequest(PR) to 1000 pieces pointing out every minor details. 
But, at the end of the day I feel great because I became little better at what I do for a living.

On the other hand, working at those **"Typical traditional enterprise organizations"** I feel exhausted by the end of the day even though there are absolutely no technical challenges.
Having to be cautious all the times because of the "blame game" culture sucks the energy out of you.
But being cautious is better than becoming a fool.

I hope this article would be helpful to avoid some common mistakes.