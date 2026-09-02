---
title: "AI Agents Are Doing The Heavy Lifting, Then Why Am I So Tired?"
author: Siva
images: ["/preview-images/ai-code-review.webp"]
type: post
draft: false
date: 2026-06-30T04:59:17+05:30
url: /blog/ai-agents-are-doing-the-heavy-lifting
toc: false
categories: [AI]
tags: [AI]
---
I love writing code.

Not just because it pays the bills.

I genuinely enjoy the process.

Give me a use case, let me think about the design, write a failing test, make it pass, refactor, move classes around, 
rename things, delete half the code I wrote an hour ago, run the test suite again, smile because everything is still green... 
and I can happily spend an entire day doing that.

That's my happy place.

It feels like this:

{{< figure src="/raw-images/nicolas-cage-fresh-air.gif" width="350" height="300" >}}

That feeling when you finally find the right abstraction after trying three terrible ones? Beautiful.

Then AI coding agents arrived. And like everyone else, I jumped in.

I spent a good amount of time setting things up properly. Spring Boot Agent Skills. MCP servers. Project rules. Coding conventions. Reusable prompts. The whole harness.

I wasn't doing vibe coding. I still wanted architectural control.

So instead of saying **"Build me an ecommerce application."** I would write detailed functional requirements, explain the boundaries, define the constraints, and let the agent do the mechanical work.

The results were... honestly impressive.

Feature after feature.

Tests. Documentation. Refactoring.

Everything kept appearing faster than I could have written it myself.

It wasn't just a little faster. It was significantly faster.

I remember thinking

_"Okay... this is it. I've officially become one of those ‘10x developer because of AI' people."_

Life was good.

Then every evening I noticed something strange.

I was exhausted.

Not "I've been debugging production at 2 AM" exhausted.

Just mentally drained.

Which made absolutely no sense.

The AI was reading the requirements.

The AI was designing the solution.

The AI was writing the code.

The AI was fixing compilation errors.

The AI was even updating the tests.

So...

**What exactly was I getting tired of?**

It took me a few days to figure it out.

Before AI, every feature started the same way.

I'd stare at the screen for five minutes pretending to think.

(Okay... actually thinking.)

Eventually an approach would emerge.

Then I'd implement it one small step at a time.

Because I had already decided the architecture, every new class made sense.

Every method existed because I had created it.

Every abstraction reflected a decision I had already made.

By the time I finished the feature, I didn't need to "understand" the code.

I already understood it.

I had lived through every line.

AI completely changes that experience.

Now I write a prompt.

The agent disappears for a minute.

Then returns with enough code to keep me busy for half an hour.

I glance through it.

Looks reasonable.

{{< figure src="/raw-images/lame-code-review.gif" width="350" height="300" >}}

Merge.

Next use case.

Looks reasonable.

Merge.

Next use case.

Looks reasonable.

Merge.

After about ten use cases, I noticed something small.

Just a tiny refactoring.

"This helper method could probably be reused."

I opened the module.

Made the change.

Then I noticed another method doing almost the same thing.

"Hmm..."

Then I found validations split between the controller and the service.

"Interesting..."

Then every test class had invented its own way of creating test data.

"That's... creative."

Then there were two utility methods that nobody called anymore.

Then there were three slightly different implementations of exactly the same logic.

At some point I stopped refactoring.

I had accidentally started cleaning an entire module.

Then another.

Then another.

And somewhere around hour three, I realized something uncomfortable.

I hadn't actually reviewed the AI-generated code.

I had only checked whether it looked reasonable.

Those are not the same thing.

We all love saying,

> "Always review every line before it goes to production."

Absolutely.

We should.

But let's also admit something.

Most developers don't wake up excited to review someone else's code.

Writing code is creative.

Reviewing code is archaeology.

When you review someone else's implementation, you're digging through layers trying to reconstruct their thinking.

_"Why did they introduce this abstraction?"_

_"What problem were they trying to solve?"_

_"Why is this validation here instead of there?"_

_"Was this intentional... or just Tuesday afternoon?"_

You're constantly rebuilding another person's mental model inside your own head.

That's surprisingly exhausting.

Now replace "someone else" with an AI that produces code ten times faster than you can read it.

Congratulations.

You've become a professional code reviewer.

That was the moment everything clicked.

The AI wasn't making me tired by writing code.

It was making me review far more code than I ever had before.

So I changed my workflow.

No more quick scans.

From that day on, every generated feature got a proper review before moving to the next task.

Which introduced a new problem.

The AI can generate code much faster than I can thoroughly review it.

By lunchtime, it happily has three more features waiting.

Meanwhile, I'm still tracing through the second service wondering,

_"Wait... where does this DTO actually get validated?"_

The bottleneck had moved.

It wasn't writing code anymore.

It was understanding code.

Ironically, AI had automated the part I enjoy the most and left me spending most of my day doing the part I enjoy the least.

Now, can this be improved?

Absolutely.

Every time I find a recurring mistake, I teach the agent not to make it again.

Sometimes it's another Agent Skill.

Sometimes it's a better project rule.

Sometimes it's another guardrail.

Sometimes it's a reusable prompt.

The quality keeps improving.

And that's genuinely satisfying.

But even with a solid harness (Agent Skills, MCP servers, project rules, detailed prompts, coding standards), the agent occasionally decides that today is a good day to invent a brand-new pattern that exists nowhere else in the project.

AI has a remarkable ability to be consistently excellent...

...and occasionally spectacularly creative.

Which means human review is still necessary.

At least for now.

I often see people saying,

> "I'm running twenty agents simultaneously."
> 
> "I'm a hundred times more productive."

Maybe they are.

Maybe their work parallelizes beautifully.

Maybe they're simply much better at context switching than I am.

If that's true, honestly, hats off.

Me?

I can deeply focus on maybe two things before my brain starts filing formal complaints.

So no.

I may probably never become a 100x developer.

What AI has given me is something different.

It lets me produce far more software.

It removes a huge amount of mechanical work.

It catches plenty of mistakes.

It remembers things I forget.

It absolutely makes me more productive.

But it hasn't removed my responsibility to understand the code that's about to ship.

And understanding code that somebody or something else wrote is still hard work.

One approach that I've found helpful is asking the AI to work in much smaller increments.

Generate one service.

Review it.

Generate one repository.

Review it.

Generate one controller.

Review it.

The reviews become dramatically easier because the changes are small.

The downside is obvious.

You spend much more time talking to the AI instead of letting it disappear for fifteen minutes and build an entire feature.

Like everything else in software engineering...

It's another trade-off.

So these days, whenever someone tells me

"AI lets me build software ten times faster."

I completely believe them.

But I also wonder something else.

**Who's reviewing all that code?**

Because after spending the last few weeks with AI coding agents, I've become convinced of one thing.

Writing code is fun.

Reading code is work.

AI is incredibly good at making us do a lot more of the second.

Now I'm curious.

How are you dealing with AI fatigue?

Have you found a workflow that keeps code reviews manageable without sacrificing quality? Or have you simply accepted that reviewing AI-generated code is now a significant part of the job?

I'd love to hear your experience.