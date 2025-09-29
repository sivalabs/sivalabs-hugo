---
title: How (not) to ask for Technical Help? 
author: Siva
images: ["/preview-images/help-hand.webp"]
type: post
draft: false
date: 2022-08-02T04:59:17+05:30
url: /how-to-not-to-ask-for-technical-help/
categories: [Tips]
tags: [Tech, Tips]
---

We, software developers, have a great advantage when it comes to getting help from others.
Irrespective of how much experience you have you will need help fromm others. 
And, there are plenty of good people out there willing to help you by means of answering on StackOverflow, writing blog posts, making video tutorials etc. They are taking their personal time to help strangers whom they may never meet in-person, kudos to all of them.

<!--more-->


But, in order to help you they need some context of the problem, and you need to approach them in reasonable ways.

Here I would like share my thoughts on **what are the better ways to ask for help?** and what are **some patterns that you should avoid while asking for help**.

## How NOT to ask for help
### 1. Use the right medium/channel

**StackOverflow**, **GitHub Issues** etc are specifically designed for this purpose, where you can share code snippets and ask for help.

**Twitter DMs**, **WhatsApp messages** are terrible ways to post a bunch of code snippets and ask for help.
It is very hard for the people to make sense of code on Twitter DMs and WhatsApp. Use the right medium/channel.

### 2. Asking "I need XYZ, it is very urgent"
Those who want to help others may also have a regular day job, they have their own priorities, families to take care.
What is urgent for you, may/need not be urgent for them, especially when they are offering their help for FREE.

Just adding "It is very urgent" doesn't help much, in fact that may have a negative impact also.

### 3. Asking for whole project implementation as HELP
Some people ask **"Could you please send me a microservices based sample project with OAuth 2.0 security and Angular front-end?"**

This is not "help", that is a whole project work for which people usually charge few hundred dollars.

If you try to implement that project yourself and got stuck somewhere then people would help you to resolve that particular issue. 
But if you ask them to build the whole application for you then there is very less chance you may get that "HELP".

### 4. Asking for help with "It's not working" as the whole details
Occasionally I come across questions on StackOverflow as follows:

* I am using Spring Security and I am getting 403 error. Please help.
* I am using SpringBoot and when I start the application it is throwing error. Why?
* I am getting CORS issue even after configuring CORS. How to resolve it?

These are not just the titles, these are the whole questions. No code snippets, no Exception StackTraces, nothing.

Just imagine, somebody asked you for help with just that info, would you be able to help? No right?

**Share the context, share some code snippets or exception you are getting** so that others can get some insights into the problem and can help you. 

Just asking for help with 10000 feet view of the problem won't get you any answers. 

## How to ask for help

### 1. Share context, software versions, actual problem you are facing
Many times we try to solve a problem and come up with some approach which involves steps 1, 2 and 3.
We may get stuck at step 2 or 3 and ask for help how to resolve that particular issue.
This is called [The XY Problem](https://xyproblem.info/)

Sometimes giving the overall context, not just the problem you are facing, really helps others to understand the context of the issue. 
There may be a better alternative approach than what you are trying to follow which can only be realized if you share the full context. 

Also, it is a good practice to share what OS, language/framework versions you are using to reproduce the problem before solving it.

### 2. Share what you have tried already
You might have already tried in few ways to solve the issue before asking others for help.
Sharing all those details will spare others time from trying those same ways again.

### 3. Provide minimal reproducible example
Sometimes it is the very minor details, which we take it for granted, causing the issue.
The best way to get help is to create a minimal reproducible example project and share it

Here is a StackOverflow article on [How to create a Minimal, Reproducible Example](https://stackoverflow.com/help/minimal-reproducible-example)

Happy learning and sharing :-)
