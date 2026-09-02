---
title: "Confessions of an AI Agent FOMO Survivor"
author: Siva
images: ["/preview-images/confessions-of-an-ai-agent-fomo-survivor.webp"]
type: post
draft: false
date: 2026-06-22T04:59:17+05:30
url: /blog/confessions-of-an-ai-agent-fomo-survivor
toc: false
categories: [AI]
tags: [AI]
---
Every morning, I open X/Twitter, LinkedIn, or YouTube and learn about a brand-new AI engineering discipline that apparently everyone else has already mastered.

A few months ago it was Prompt Engineering.

Then came Context Engineering.

Soon after, people started talking about **Agent Skills, Harness Engineering, Loop Engineering, Ralph Wiggum Loops, Sub-Agent Architectures, Agentic Workflows, Cognitive Tooling**, and probably three more terms while I was writing this sentence.

At this point I fully expect to wake up tomorrow and discover that “Recursive Quantum Harness Context Loop Engineering” is the new must-have skill for AI developers.

And honestly?

It can feel overwhelming.

Every new buzzword comes with an implicit message:

> “If you’re not doing this, you’re not leveraging AI capabilities fully.”

Which immediately triggers a mild form of AI FOMO.

Maybe my setup is outdated.

Maybe I’m missing the secret sauce.

Maybe there is a GitHub repository with 47 agent skills, 12 MCP servers, and a five-level hierarchy of sub-agents that would finally unlock AGI.

So naturally, I spend an hour reading about it instead of actually building software.

## The Surprising Discovery
Over the last several months of working with AI coding agents, I’ve discovered something that feels almost disappointing:

**A minimal setup works surprisingly well.**

Not because all the new ideas are useless.

Many of them are genuinely valuable.

But I’ve found that for day-to-day software development, especially on Java/Spring Boot projects, I don’t need a giant agent infrastructure to be productive.

Most of the time, I just need enough structure for the agent to understand the project and enough guidance to keep it from doing creative things that nobody asked for.

## My Typical Setup
When starting a new Spring Boot project, I almost never ask an AI agent to generate the initial project structure.

Instead, I use a project generator. Spring Initializr exists for a reason.

The generated project uses the latest versions, recommended defaults, and current conventions.

I’d rather start with a project created by the people who maintain the framework than have an AI confidently generate a Maven configuration from six months ago.

Once the project is created, I manually implement one complete end-to-end flow.

For example:

* Controller
* Service
* Repository
* Entity
* DTOs
* Tests

A complete vertical slice.

This is probably the most important thing I do.

That flow becomes the living example of the conventions I want the agent to follow.

Naming conventions.

Package structure.

Error handling.

Testing style.

Mapping patterns.

Validation approach.

Instead of writing a ten-page document explaining architectural preferences, I give the AI a working example.

Developers learn from examples.

AI agents do too.

## The Tiny AGENTS.md
Another thing I’ve learned is that a bigger context is not automatically better context.

My AGENTS.md (or CLAUDE.md) files are intentionally small.

I include only things that are genuinely useful:

* Project overview
* Build commands
* Test commands
* A few important conventions

That’s it.

Not fifty pages of documentation.

Not an encyclopedia of company history.

Not a manifesto on software craftsmanship.

Every extra token has a cost.

And every additional instruction creates another opportunity for conflicts, confusion, or context dilution.

Sometimes I see people stuffing everything imaginable into agent instruction files.

The AI equivalent of:

> “Just in case, let me attach the entire internet.”

Meanwhile, the agent is trying to figure out how to add a new REST endpoint.

## Agent Skills: Useful, But Selectively
I do use agent skills.

For Spring Boot projects, I often use the Spring Boot Agent Skills from:

https://github.com/sivaprasadreddy/sivalabs-agent-skills

The key word is relevant.

I choose skills that directly help with the type of software I’m building.

Not because they are trending.

Not because somebody’s GitHub repository got ten thousand stars.

Not because a YouTube thumbnail promised “10X Better Agents.”

Just because they’re useful.

That’s a surprisingly effective selection criterion.

## MCP Servers: Less Is More
My MCP server setup is equally boring.

Typically:

* Context7 for looking up the latest documentation
* Playwright for UI testing and fixes

That’s usually enough.

Every MCP server introduces additional capabilities, complexity, and potential distractions.

Sometimes I see screenshots where people have twenty MCP servers connected.

The agent has access to databases, Slack, Jira, GitHub, browsers, calendars, weather reports, stock prices, smart refrigerators, and possibly the International Space Station.

Meanwhile, I’m just trying to implement a pagination endpoint.

## Specs or Detailed Prompts
Sometimes I use Spec Driven Development.

Sometimes I don’t.

When the task is large or requires multiple iterations, a specification document works well.

For smaller tasks, I often write a detailed prompt in a Markdown file and use that as input.

```markdown
# REQ_001 - User Registration

## Requirement Description
Create a new user account with basic profile and credentials.

## Preconditions
- Request payload should contain non-blank `name`, valid `email`, and non-blank `password`.
- Email must be unique in persistence layer.

## Postconditions
- A new user record is persisted.
- Password is stored in encoded form.
- User role is set to `ROLE_USER`.

## API
- HTTP Method: `POST`
- URL: `/api/users`
- Headers:
  - `Content-Type: application/json`

## Request Body

{
  "name": "TestUser",
  "email": "testuser@gmail.com",
  "password": "Secret@1234"
}

## Response Body
- Status: `201 Created`

{
  "name": "TestUser",
  "email": "testuser@gmail.com",
  "role": "ROLE_USER"
}

## Error Responses
- `400 Bad Request` (validation failure)
    - Title: `Validation Error`
    - `errors` includes messages like:
        - `Name is required`
        - `Invalid email address`
        - `Password is required`
- `500 Internal Server Error` (e.g., persistence constraint/unhandled errors)
```

I’ve found that the format matters less than the clarity.

If the following are clearly defined:

* Inputs
* Outputs
* Constraints
* Acceptance criteria

The agent usually does a decent job.

Not perfect.

But surprisingly good.

Occasionally I need to make corrections.

Sometimes I need to redirect it.

Sometimes it invents abstractions that nobody requested.

But overall, the results are often much better than people assume.

## Things I Try to Avoid
One of the biggest temptations in the AI ecosystem is collecting agent configurations like Pokémon cards.

A new repository appears.

Everyone stars it.

Someone posts:

> “This changed everything.”

Five minutes later you’ve cloned:

* 37 agent skills
* 12 sub-agent configurations
* 8 workflow frameworks
* 4 prompt libraries
* 1 mysterious folder that nobody understands

The assumption is:

> More agent stuff = better agents.

In my experience, that’s not always true.

Every skill adds instructions.

Every configuration adds opinions.

Every framework adds assumptions.

Eventually, the agent receives conflicting guidance from multiple sources and starts behaving like a committee trying to design a horse.

You asked for a simple CRUD endpoint.

_The agent delivers a distributed event-driven hexagonal architecture with CQRS and three design patterns nobody can explain._

There’s also the security aspect.

Pulling random agent skills from the internet and giving them access to your development workflow deserves at least the same scrutiny you’d apply to any other dependency.

Maybe more.

## About All The Loop Engineering Stuff
Now, before the internet gets upset, I’m not saying the newer agent techniques are useless.

Far from it.

I think approaches like Ralph Wiggum loops, loop engineering, multi-agent systems, autonomous task execution, and similar ideas can absolutely improve agent capabilities.

Especially for long-running tasks and highly autonomous workflows.

If your goal is:

> “Here is a backlog. Wake me up when it’s done.”

Then sophisticated orchestration may be exactly what you need.

But let’s be honest.

Not everyone has unlimited AI budgets.

Not everyone wants agents consuming tokens all night while recursively discussing architecture with themselves.

Not everyone needs a digital employee working unsupervised for eight hours.

Many of us are simply trying to build software faster and better during the workday.

For that use case, a relatively simple setup often delivers most of the value.

## Simpler Than Expected
The longer I work with AI coding agents, the more I appreciate boring solutions.

A clean project.

One well-implemented example.

A small instruction file.

A handful of relevant skills.

A couple of useful MCP servers.

Clear requirements.

That’s it.

No revolutionary framework.

No secret prompt.

No agent enlightenment ceremony.

Just enough structure for the agent to succeed.

And surprisingly often, that works really well.

Maybe I’ll eventually adopt the latest loop engineering technique.

Maybe next year’s buzzword will genuinely change everything.

Or maybe we’ll discover that software engineering’s oldest lesson still applies:

> **Simplicity scales surprisingly far.**

I’m curious what kind of setup you’re using.

Do you have a minimal agent harness?

Are you running a fleet of specialized subagents?

What has worked well for you?

And perhaps more importantly...

What didn’t work?
