---
title: You Can Code Offline With Local AI(Ollama)
author: Siva
images:
  - /images/code-offline-with-local-ai.webp
type: post
draft: false
date: 2025-01-09T23:29:17.000Z
url: /blog/code-offline-with-local-ai-ollama
toc: true
categories:
  - AI
tags:
  - Java
  - SpringBoot
  - AI
  - Ollama
aliases:
  - /code-offline-with-local-ai-ollama
---
ChatGPT and other Generative AI tools took the world by a storm.
People are using these AI tools for various purposes such as to explore a topic, 
to seek answers to their questions or to get help in coding, etc.
ChatGPT and Google's Gemini are very popular AI tools that are available for free with some usage limitations.

<!--more-->

**Coding without help from Google, StackOverflow and blogs is challenging.
But what if you had to code without internet connectivity?**

**No need to worry.**

**Now there are some FREE AI tools that you can run locally on your laptop so that you can get help even offline(without internet connection).
Also, by using these local AI tools, you won't risk sharing your details with public AI tool vendors.**

In this article, we will explore:
* Running Ollama locally
* Using GUI Clients to interact with Ollama
* Using Ollama as a Java Developer

## Running Ollama locally
[Ollama](https://ollama.com/) is an open-source project that provides LLM models that you can run locally.
Download and install Ollama from [here](https://ollama.com/download).

Once installed, you can start Ollama and run any available [Models](https://ollama.com/library).

You can perform various actions using `ollama` as follows:

```shell
$ ollama list // <- to list downloded models
$ ollama ps // <- to list running models
$ ollama run <model> // <- to download and run the model
$ ollama show llama3.2 // <- to show information about llama3.2 model
$ ollama help // <- shows all available commands
```

Let's run [llama3.2](https://ollama.com/library/llama3.2) model by running the following command:

```shell
$ ollama run llama3.2
>>> Send a message (/? for help)
```

When you run it for the first time, it will download the model and start the server.
Once the server is started, you can check the status by visiting [http://localhost:11434](http://localhost:11434)
which should display **Ollama is running**.

You can download as many models you want and run multiple models at the same time.

Now you can ask any question from the Terminal/Console:

```shell
>>> Explain what is LLM in layman terms

LLM stands for Large Language Model. In simple words, it's a type of artificial intelligence (AI) that can understand and generate human-like language.

Imagine you have a huge library with an almost endless number of books. Each book contains lots of information and knowledge about the world. A Large Language 
Model is like this library, but instead of physical books, it's made up of digital words and phrases.
....
....
>>>
```

While you can interact with Ollama from CLI, it would be nice to have a GUI Client.

## Using GUI Clients to interact with Ollama
You can see a list of [Web and Desktop GUI Clients for Ollama](https://github.com/ollama/ollama?tab=readme-ov-file#web--desktop) 
in Ollama's GitHub Readme file.

I tried some of those available options, and I like [Enchanted(MacOs native client)](https://github.com/gluonfield/enchanted) and
[Open WebUI](https://github.com/open-webui/open-webui).

You can install them following their installation instructions in their README files.

Here is the Enchanted GUI Client.

{{< figure src="/raw-images/ollama-enchanted-demo.gif" >}}

## Using Ollama as a Java Developer
We can use Ollama with a model that is optimized for coding 
such as [codellama](https://ollama.com/library/codellama), 
[qwen2.5-coder](https://ollama.com/library/qwen2.5-coder),
[codegemma](https://ollama.com/library/codegemma)
to get help in coding related tasks.

Some coding tasks that you can try:

**1. Generate classes or records**

**Prompt:** Generate a Java class to store user information with equals(), hashCode() and toString() methods.

{{< figure src="/raw-images/ollama-generate-class.gif" >}}

**Prompt:** Generate a Java record User with id, name, email, password and phone fields.

{{< figure src="/raw-images/ollama-generate-record.gif" >}}

**2. Generate SQL Table Schema**

**Prompt:** Generate SQL script to create users table that supports user registration, user activation, and forgot password features.

{{< figure src="/raw-images/ollama-generate-sql-script.gif" >}}

**Prompt:** Given the following table structure, generate a query that returns the employee names and their manager names.

```sql
create table employees (
  emp_id int primary key,
  name varchar(100) not null,
  manager_id int references employees(id)
);
```

{{< figure src="/raw-images/ollama-generate-sql-query.gif" >}}

**3. Ask to explain code snippet**

You can ask to explain some code snippet.

**Prompt:** Explain the following code snippet:

```java
@GetMapping("/{slug}")
@Operation(summary = "Find post by slug")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Returns post for the given slug"),
    @ApiResponse(responseCode = "404", description = "Post doesn't exists for the given slug"),
})
ResponseEntity<PostDto> getPostBySlug(@PathVariable(value = "slug") String slug) {
    var post = postService
            .findPostBySlug(slug)
            .map(blogMapper::toPostDto)
            .orElseThrow(() -> new ResourceNotFoundException("Post with slug '" + slug + "' not found"));
    return ResponseEntity.ok(post);
}
```

{{< figure src="/raw-images/ollama-explain-code.gif" >}}

**4. Generate tests for existing code**

You can generate tests for existing code.

**Prompt:** Write integration test for the following code snippet:

```java
@GetMapping("/{slug}")
ResponseEntity<PostDto> getPostBySlug(@PathVariable(value = "slug") String slug) {
    var post = postService
            .findPostBySlug(slug)
            .map(blogMapper::toPostDto)
            .orElseThrow(() -> new ResourceNotFoundException("Post with slug '" + slug + "' not found"));
    return ResponseEntity.ok(post);
}
```

{{< figure src="/raw-images/ollama-generate-test.gif" >}}

**5. Explore pros and cons of competing technologies/approaches**

You can explore the differences of various approaches and ask to give pros and cons of them.

**Prompt:** Explain the differences between REST and GraphQL and also give pros and cons of each.

{{< figure src="/raw-images/ollama-generate-pros-and-cons.gif" >}}

## Summary
The Generative AI tools can help us to be more productive by offloading the boring tasks to AI.
The tools like Ollama and various freely available LLM models enable us to run LLMs locally.

If you are new to Generative AI, using the Gen AI chat would be a first step.
We can be much more productive by using the AI-powered IDEs that use AI Agents to generate or modify code.

I have shown some basic examples of how you can use Ollama for coding related tasks.
You can leverage these AI tools to be more productive by letting them do mundane boring tasks.
Also, we can brainstorm ideas, ask to write documentation, and do many more things.

Happy coding :-)
