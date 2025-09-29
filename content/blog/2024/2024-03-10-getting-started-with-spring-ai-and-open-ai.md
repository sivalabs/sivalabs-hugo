---
title: Getting Started with Spring AI and Open AI
author: Siva
images:
  - /preview-images/spring-ai-introduction.webp
type: post
draft: false
date: 2024-03-09T23:29:17.000Z
url: /blog/getting-started-with-spring-ai-and-open-ai
toc: true
categories:
  - AI
tags:
  - AI
  - Generative AI
  - Java
  - SpringAI
  - OpenAI
aliases:
  - /getting-started-with-spring-ai-and-open-ai
---
In this article, we will explore the following:

* Introduction to Spring AI.
* Interacting with Open AI using Spring AI.
* Using **PromptTemplates**.
* Using **OutputConverters**.

Let's get started.

<!--more-->

{{< box info >}}
**Sample Code Repository**

You can find the sample code for this article in the [GitHub repository](https://github.com/sivaprasadreddy/spring-ai-samples/tree/main/spring-ai-openai)

{{< /box >}}

## Introduction to Open AI and Spring AI
ChatGPT took the world by storm when it was released by OpenAI. 
It was the first time that a language model was able to generate human-like responses to prompts. 
OpenAI has since released several other models, including DALL-E, which can generate images from textual prompts.

[Spring AI](https://spring.io/projects/spring-ai) is a Java library that provides a simple and easy-to-use interface to interact with LLM models.
Spring AI provides higher-level abstractions to interact with various LLMs such as 
**Open AI**, **Azure Open AI**, **Hugging Face**, **Google Vertex**, **Ollama**, **Amazon Bedrock**, etc.

In this article, we are going to explore how to interact with Open AI using Spring AI.

First, we need to create an account in OpenAI and get the API key.
* Go to [OpenAI Platform](https://platform.openai.com/) and create an account.
* In the Dashboard, click on the **API Keys** from the left navigation menu and create a new API key.

> **If you are creating a new account, you will be granted some free credits to use the OpenAI APIs.
Otherwise, you need to buy credits to use the OpenAI APIs.**

Once you have the API key, set the environment variable `OPENAI_API_KEY` with the API key.

```bash
export OPENAI_API_KEY=<your-api-key>
```
## Create Spring AI Project
Let's create a new Spring Boot project using Spring Initializr.

* Go to [Spring Initializr](https://start.spring.io/)
* Select **Web**, and **OpenAI** starters

## Interacting with Open AI using ChatClient
Spring AI provides **ChatClient** abstraction to interact with different types of LLMs 
without coupling with the actual LLM model.

For example, we can use **ChatClient** to interact with OpenAI as follows:

```java
@RestController
class ChatController {

    private final ChatClient chatClient;

    ChatController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @GetMapping("/ai/chat")
    Map<String, String> chat(@RequestParam String question) {
        String response = chatClient.prompt().user(question).call().content();
        return Map.of("question", question, "answer", response);
    }
}
```

In the above code, there is nothing coupled to OpenAI.

We can configure the **ChatClient** to use OpenAI by providing the API key and other parameters in the **application.properties** file.

```properties
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.chat.model=gpt-3.5-turbo
spring.ai.openai.chat.temperature=0.7
```

Now we can run the application and test the chat API.

```bash
curl --location 'http://localhost:8080/ai/chat?question=Tell%20me%20about%20SpringBoot'

//OUTPUT:
{
  "question":"Tell me about SpringBoot",
  "answer":"Spring Boot is an open-source Java-based framework used for building and 
            deploying stand-alone, production-ready applications. It is a part of the 
            larger Spring ecosystem and provides a simpler and faster way to set up and 
            configure Spring applications.\n\nSpring Boot eliminates the need for 
            manual configuration by providing default settings for most Spring projects, 
            allowing developers to quickly get started with their application development. 
            It also offers a wide range of features, such as embedded servers, metrics, 
            health checks, and security, that are pre-configured and ready to use out of the box."
}
```

## Using PromptTemplates
We can use **PromptTemplates** to provide a set of predefined prompts to the **ChatClient**.

```java
@RestController
class ChatController {

    private final JokeService jokeService;

    ChatController(JokeService jokeService) {
        this.jokeService = jokeService;
    }

    @GetMapping("/ai/chat-with-prompt")
    Map<String,String> chatWithPrompt(@RequestParam String subject) {
        String answer = jokeService.getJoke(subject);
        return Map.of("answer", answer);
    }
}

@Service
class JokeService {
    private final ChatClient chatClient;

    JokeService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    String getJoke(String subject) {
        PromptTemplate promptTemplate = new PromptTemplate("Tell me a joke about {subject}");
        Prompt prompt = promptTemplate.create(Map.of("subject", subject));
        return chatClient.prompt(prompt).call().content();
    }
}
```

By using PromptTemplates, we can hide the complexity of creating prompts and provide a simple interface to the users.

In the above example, we created a Prompt that represents the user message.
We can use **SystemMessage** to indicate the role of the LLM in the conversation.

```java
@Service
class JokeService {
    private final ChatClient chatClient;

    JokeService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    String getJoke(String subject) {
        SystemMessage systemMessage = new SystemMessage("You are a helpful and funny chat bot");
        UserMessage userMessage = new UserMessage("Tell me a joke about " + subject);
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
        return  chatClient.prompt(prompt).call().content();
    }
}
```

In the above example, we created a **SystemMessage** and **UserMessage** to represent the conversation between the user and the LLM.
By using **SystemMessage**, we can define the role and provide additional context to the LLM.

## Using OutputConverters
In the previous examples, we get the response from LLMs as Strings.
We can use **OutputConverters** to parse the response and extract the required information in the desired format.

As of now, Spring AI provides the following type of **OutputConverters**:
* **BeanOutputConverter** - To parse the response and convert into a Java Bean.
* **MapOutputConverter** - To parse the response and convert into a Map.
* **ListOutputConverter** - To parse the response and convert into a List.

Let's create a new controller called **MovieController** to get the list of movies directed by a director.

```java
@RestController
class MovieController {
    private final ChatClient chatClient;

    MovieController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    private static final String PROMPT_TEMPLATE = """
            What are the best movies directed by {director}?
                    
            {format}
            """;
    //...
}
```

Now, let's see how to use **BeanOutputConverter** to parse the response and convert it into a Java Bean.

```java
record DirectorResponse(String director, List<String> movies) {}

@RestController
class MovieController {
    //...

    @GetMapping("/ai/chat/movies")
    DirectorResponse chat(@RequestParam String director) {
        var outputConverter = new BeanOutputConverter<>(DirectorResponse.class);
        var userPromptTemplate = new PromptTemplate(PROMPT_TEMPLATE);
        Map<String, Object> model = Map.of("director", director, "format", outputConverter.getFormat());
        var prompt = userPromptTemplate.create(model);
        var response = chatClient.prompt(prompt).call().content();
        return outputConverter.convert(response);
    }
}
```

In the above example, we created a Java Bean called **DirectorResponse** to represent the response from the LLM.
The **BeanOutputConverter** will parse the response and convert it into **DirectorResponse** object.

Similarly, we can use **MapOutputConverter** and **ListOutputConverter** to parse the response and convert it into a Map and List respectively.

```java
@RestController
class MovieController {
    //...

    @GetMapping("/ai/chat/movies-as-map")
    Map<String, Object> chatWithMapOutput(@RequestParam String director) {
        var outputConverter = new MapOutputConverter();
        var userPromptTemplate = new PromptTemplate(PROMPT_TEMPLATE);
        Map<String, Object> model = Map.of("director", director, "format", outputConverter.getFormat());
        var prompt = userPromptTemplate.create(model);
        var response = chatClient.prompt(prompt).call().content();
        return outputConverter.convert(response);
    }

    @GetMapping("/ai/chat/movies-as-list")
    List<String> chatWithListOutput(@RequestParam String director) {
        var outputConverter = new ListOutputConverter(new DefaultConversionService());
        var userPromptTemplate = new PromptTemplate(PROMPT_TEMPLATE);
        Map<String, Object> model = Map.of("director", director, "format", outputConverter.getFormat());
        var prompt = userPromptTemplate.create(model);
        var response = chatClient.prompt(prompt).call().content();
        return outputConverter.convert(response);
    }
}
```

We can test the APIs as follows:

```bash
curl --location 'http://localhost:8080/ai/chat/movies?director=Quentin%20Tarantino'

//OUTPUT:
{"director":"Quentin Tarantino","movies":["Pulp Fiction","Inglourious Basterds","Django Unchained","Kill Bill: Volume 1","Kill Bill: Volume 2"]}

curl --location 'http://localhost:8080/ai/chat/movies-as-map?director=Quentin%20Tarantino'

//OUTPUT:
{"best_movies":[{"title":"Pulp Fiction","year":1994},{"title":"Inglourious Basterds","year":2009},{"title":"Kill Bill: Volume 1","year":2003},{"title":"Kill Bill: Volume 2","year":2004},{"title":"Django Unchained","year":2012}]}

curl --location 'http://localhost:8080/ai/chat/movies-as-list?director=Quentin%20Tarantino'

//OUTPUT:
["Pulp Fiction","Kill Bill: Volume 1","Inglourious Basterds","Django Unchained","Once Upon a Time in Hollywood"]
```

You need to use the appropriate **OutputConverter** based on the response from the LLM and in which format you want to convert to.

## Conclusion
In this article, we have seen how to interact with OpenAI using Spring AI.
In the next article, we will learn about Embedding Models, VectorStores and how to implement 
RAG (Retrieval-Augmented Generation) using Spring AI.
