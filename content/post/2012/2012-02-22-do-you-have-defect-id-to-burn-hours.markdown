---
author: siva
comments: true
date: 2012-02-22 10:04:00+00:00
layout: post
slug: do-you-have-defect-id-to-burn-hours
title: Do you have defect id to burn the hours spent on code refactoring?
wordpress_id: 245
categories:
- IT
tags:
- IT
---

Working on a large legacy code-base is challenging(painful?) and is inevitable.  
You may need to keep on refactoring the legacy code to fix bugs, to add new features or enhancements.  
For these changes normally we would have a defect or new requirement created in QualityCenter/VersionOne or whatever the tool you use for tracking the tasks. We burn the hours spent on these tasks against the respective defect-id or requirement-id.  
  
Then assume you identify some piece of code which is written in horrible way and thought of refactoring that logic. Generally we will create a defect-id explaining the need for refactoring and refactor, test, commit, done.  
  
In some organizations, **as per process every commit to the source code should be associated with some defect-id or requirement-id**.  
  
What if your manager said   


<blockquote>_As per our process, every commit should be associated with a defect/requirement.  
We can create a defect for code refactoring that you are suggesting. Every code change should go through all the QA/UAT cycles. But the business will prioritize the defects/features for the next release as per release plan. So I can't assure you whether this will go in next release or not._</blockquote>

I guess you can understand what that manager's reply implies :-).  
  
But I felt like from the manager's perspective it is valid point. His target might be to deliver the planned bug-fixes/features for the next release.  
  
So guys, I am curious to know how is code refactoring is happening in your organizations?
