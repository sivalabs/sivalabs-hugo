---
title: "My AI Agentic Workflow"
author: "Siva"
images:
  - /preview-images/my-ai-agentic-workflow.webp
type: post
draft: false
date: 2026-11-10T06:00:00+05:30
slug: my-ai-agentic-workflow
toc: true
categories:
  - AI
tags:
  - AI
  - HarnessEngineering
  - Java
  - SpringBoot
aliases:
  - /my-ai-agentic-workflow
---

I'd been getting good results with **Opus 5.5** and **GPT-6.1 Sol** in JetBrains Air, so I decided to take things a step further. I put a list of requirements in a Markdown file and used `/loop` or `/goal` to let the agents work through them.

The agents finished implementing the requirements, but they made plenty of assumptions along the way. I ended up with a lot of code that only partially worked as intended. Untangling those assumptions and cleaning up the implementation looked like more work than rebuilding the use cases one at a time.

So, my idea of "let's build a software factory" is shelved for now :-)

I see two main problems with handing AI a large batch of requirements:

- **It's easy to leave design decisions unstated.** Requirements that seem clear at first often hide questions about behavior, permissions, and edge cases. The agent fills in whatever we leave open.
- **The resulting code is hard to review as a whole.** When so much changes at once, it's difficult to build a clear understanding of how the system works and whether it behaves as intended.

That brought me back to my tried-and-tested approach: **one feature at a time**.

**Generating code is fast. Figuring out whether it builds what I wanted still takes work.**

That's the challenge my workflow tries to address. Here's how I go from an idea to an implementation I can review without spending the whole day untangling assumptions.

<!--more-->

## My Workflow

{{< figure src="/images/my-ai-agentic-workflow.webp" >}}

## First, Talk Through the Idea

I start by brainstorming with AI. No code yet. I want to answer a few basic questions:

- Who is this application for?
- What problem should it solve?
- What's the smallest useful first version?
- What are we deliberately leaving out?

Then I ask AI to turn that discussion into a **Product Requirements Document (PRD)**. I read it and refine it. A nicely formatted document can still get the product wrong.

From the PRD, we generate high-level requirements: a list of use cases that we can tackle separately. For a feedback application, that could be submitting feedback, replying, voting, and moderation.

Could I skip this and prompt my way through each feature? For a small experiment, sure. As the application grows, though, I want somewhere to check what we agreed to build.

## Give the Agent a Way to Check Its Work

Before implementing features, I set up a harness for the project's tech stack. That includes:

- **Guidelines** for coding conventions and project structure.
- **Formatting and architecture checks** for rules we can automate.
- **Tests and verification commands** the agent can run while making changes.

Otherwise, I end up repeating the same review comments: follow the package structure, add the missing test, run the formatter.

I could put all of that in a prompt. But an instruction can be overlooked; a failing check gives the agent concrete feedback to act on.

{{< box tip >}}
If I keep pointing out the same issue in reviews, it's a candidate for an automated check.
{{< /box >}}

I've written more about this in [Harness Engineering for Java and Spring Boot Applications](/blog/harness-engineering-for-java-and-spring-boot-applications/).

## Pick One Use Case and Let AI Ask Questions

I don't generate a detailed specification for the entire application upfront. I select the next use case and work through its details when we're ready to implement it.

This keeps the discussion focused and leaves room to adjust later use cases as we learn.

I use a *GrillMe-style agent skill* to challenge the requirement. The request is along these lines:

> Before writing the spec, question my assumptions. Ask about ambiguous behavior, permissions, edge cases, and failure scenarios.

Take “users can submit feedback.” That sounds straightforward until we ask:

- Is anonymous feedback allowed?
- Who can see a submission?
- Can the author edit it after someone replies?
- What should happen when a submission is rejected?

Those answers become the specification: business rules, expected behavior, and acceptance criteria. 

```markdown
---
UseCase ID : UC-001
Title: Initial Project Setup
Depends On: []
Status: NOT_IMPLEMENTED
---

## Actors
## Preconditions
## UseCase Details
## Business Rules
## Acceptance Criteria
## In Scope
## Out of scope
```

**I review and refine the spec before implementation.**

I'd rather correct “only the author can edit this” in a short document than discover the misunderstanding across several changed files.

## Let AI Implement, Then Review in Layers

With the spec ready, I ask the agent to implement that use case, add meaningful tests, and run the harness checks. When something fails, it fixes the issue and verifies again.

Then comes review:

1. **Agent review:** I use a code review skill to look for bugs, missing tests, maintainability issues, and differences from the spec.
2. **Fix and verify:** The agent addresses the findings and reruns the relevant checks.
3. **Human review:** I review the business-critical logic myself. Any corrections go through the same fix-and-verify loop.

Why use both kinds of review? The agent can help catch issues before I read the diff. But I still need to check decisions such as who can access a record, how a calculation works, or whether a state transition is allowed.

**Green tests are useful evidence. I still need to ask whether they're testing the right behavior.**

Reviewing every line manually from the start is an option, too. I prefer to let automated checks and agent review handle the first pass so I can spend more attention on the business decisions.

## Then Do It Again

Once the use case is implemented, verified, and reviewed, I select the next one.


## Conclusion
My approach described in this article takes more preparation than asking the agent to build everything in one go. For a throwaway prototype, that extra preparation may not be worthwhile.

For an application I intend to maintain, I prefer these smaller iterations. **Keep each use case small enough that you can understand the spec and review the resulting change.** That's what makes this workflow practical for me.
