---
title: "Getting Started with Generative AI using Java, LangChain4j, OpenAI and Ollama"
author: Siva
images: ["/preview-images/getting-started-with-generative-ai.webp"]
type: post
draft: false
date: 2024-02-19T04:59:17+05:30
url: /getting-started-with-generative-ai-using-java-langchain4j-openai-ollama
toc: true
categories: [AI]
tags: [AI, Generative AI, Java, LangChain4j, OpenAI, Ollama]
---
In this article, we will explore the following:

* Brief introduction to Generative AI?
* How to interact with Open AI APIs using Java?
* How to use LangChain4j to interact with OpenAI?
* How to run a LLM model locally using Ollama?
* Working with Ollama using LangChain4j and Testcontainers.

Let's get started.

<!--more-->


{{< box info >}}
**LangChain4j Tutorial Series**

You can check out the other articles in this series:

* [Part 1: Getting Started with Generative AI using Java, LangChain4j, OpenAI and Ollama]({{< relref "2024-02-19-getting-started-with-generative-ai-using-java-langchain4j.md" >}})
* [Part 2: Generative AI Conversations using LangChain4j ChatMemory]({{< relref "2024-02-21-generative-ai-conversations-using-langchain4j-chat-memory.md" >}})
* [Part 3: LangChain4j AiServices Tutorial]({{< relref "2024-02-23-langchain4j-ai-services.md" >}})
* [Part 4: LangChain4j Retrieval-Augmented Generation (RAG) Tutorial]({{< relref "2024-02-26-langchain4j-rag.md" >}})
{{< /box >}}

## Introduction to Generative AI
Unless you are living under a rock, you might have heard about Generative AI. 
It is a fascinating field of AI that is used to generate new content, such as images, text, audio, etc. 
A few years ago, building a chat bot was a big deal, but now we are talking about generating human-like 
text, images, and audio using a simple API call.

In general, AI involves complex subjects like **Machine Learning**, **Deep Learning**, **Natural Language Processing (NLP)**, etc.
Building AI applications requires a good understanding of these subjects, and it is not easy to get started.
Thanks to the latest advancements in AI, we can build AI-powered applications without having a deep understanding of these complex subjects.
The experts in the AI field built Large Language Models (LLMs) that can generate human-like text, and these models are available as APIs.

A **Large Language Model (LLM)** refers to a type of artificial intelligence model designed to understand and 
generate human-like language on a large scale. These models are trained on massive datasets that include 
diverse examples of language use, allowing them to learn patterns, context, and semantics of language.

Generative AI has diverse use cases, including:

* **Content Generation:** Creating text, images, videos, and music.
* **Language Translation:** Improving machine translation models.
* **Chatbots:** Developing conversational agents for customer support.
* **Code Generation:** Writing code for software development.
* **Text Analysis:** Analyzing and summarizing large volumes of text.

There are a few popular LLMs available as APIs, such as **GPT-3/4 from OpenAI**, **Vertex from Google**, 
**Azure AI from Microsoft**, etc.

## Getting Started with OpenAI using Java
In this section, we will explore how to interact with OpenAI APIs using Java.

{{< box info >}}
**Sample Code Repository**

You can find the sample code for this article in the [GitHub repository](https://github.com/sivaprasadreddy/langchain4j-demos)

{{< /box >}}

First, we need to create an account in OpenAI and get the API key.
* Go to [OpenAI Platform](https://platform.openai.com/) and create an account.
* In the Dashboard, click on the **API Keys** from the left navigation menu and create a new API key.

> **If you are creating a new account, you will be granted some free credits to use the OpenAI APIs.
Otherwise, you need to buy credits to use the OpenAI APIs.**

Once you have the API key, you can use it to interact with OpenAI APIs.
You can find the Open AI API Reference documentation [here](https://platform.openai.com/docs/api-reference/).

First, let us see how we can ask a question to OpenAI using its [Chat API endpoint](https://platform.openai.com/docs/api-reference/chat).

```shell
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "List all the movies directed by Quentin Tarantino"
      }
    ]
  }'
```

You might get a response like this:

```json
{
  "id": "chatcmpl-8tvrQyjw3s28IREvkFl6kIhTxIUGZ",
  "object": "chat.completion",
  "created": 1708341148,
  "model": "gpt-3.5-turbo-0125",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "1. Reservoir Dogs (1992)\n2. Pulp Fiction (1994)\n3. Jackie Brown (1997)\n4. Kill Bill: Vol. 1 (2003)\n5. Kill Bill: Vol. 2 (2004)\n6. Death Proof (2007)\n7. Inglourious Basterds (2009)\n8. Django Unchained (2012)\n9. The Hateful Eight (2015)\n10. Once Upon a Time in Hollywood (2019)"
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 16,
    "completion_tokens": 105,
    "total_tokens": 121
  },
  "system_fingerprint": "fp_69829325d0"
}
```

As you can see, it's a simple API call to get the response from OpenAI.

Now, let's see how we can use Java's built-in **HttpClient** to interact with OpenAI.

We are going to use the Jackson JSON library to serialize/deserialize the request and response.

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.1</version>
</dependency>
```

First, we are going to create Java Record classes to represent the request and response JSON payloads.

```java
record Message(String role, String content) {}

record ChatRequest( String model, List<Message> messages, double temperature) {}

@JsonIgnoreProperties(ignoreUnknown = true)
record ChatUsage(
        @JsonProperty("prompt_tokens")
        int promptTokens,
        @JsonProperty("completion_tokens")
        int completionTokens,
        @JsonProperty("total_tokens")
        int totalTokens
) {}

@JsonIgnoreProperties(ignoreUnknown = true)
record ChatResponseChoice(
        int index,
        Message message,
        @JsonProperty("finish_reason")
        String finishReason
) {}

@JsonIgnoreProperties(ignoreUnknown = true)
record ChatResponse(
        String id, String object, long created,
        String model, ChatUsage usage,
        List<ChatResponseChoice> choices
) {}
```

We have created Java records to represent the request and response, including only the fields we are interested in.

Next, let's use Java's **HttpClient** to interact with OpenAI.

```java
package com.sivalabs.openai.demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class ChatDemo {
    public static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");
    public static final String CHAT_URL = "https://api.openai.com/v1/chat/completions";
    public final static String MODEL = "gpt-3.5-turbo";
    public final static double TEMPERATURE = 0.7;

    static HttpClient client = HttpClient.newHttpClient();
    static ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args) throws Exception {
        ChatRequest chatRequest = new ChatRequest(
                MODEL, List.of(new Message("user", "List all the movies directed by Quentin Tarantino")),
                TEMPERATURE);
        String requestPayload = mapper.writeValueAsString(chatRequest);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(CHAT_URL))
                .header("Authorization", "Bearer %s".formatted(OPENAI_API_KEY))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestPayload))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        String body = response.body();
        ChatResponse chatResponse = mapper.readValue(body, ChatResponse.class);
        System.out.println(chatResponse.choices().getFirst().message().content());
    }
}
```

We have created an instance of **ChatRequest** and serialized it to JSON string using Jackson.
Then we created an instance of **HttpRequest** and sent it using Java's **HttpClient**.
Finally, we deserialized the response JSON to **ChatResponse** using Jackson.

Few important things to note here:
* We are getting the OpenAI API key from the environment variable **OPENAI_API_KEY**.
* We are using **gp-3.5-turbo** model, you can see all available models in OpenAI [here](https://platform.openai.com/docs/models/overview).
* We are using a **temperature** of 0.7, which controls the randomness of the response. 
  A lower temperature will result in more deterministic responses, and a higher temperature will result in more random responses.

An important thing to note here is the **usage** field in the response, which gives you an idea of how many tokens are used for the request and response.

```json
{
  "..":"..",
  "usage": {
    "prompt_tokens": 16,
    "completion_tokens": 105,
    "total_tokens": 121
  }
}
```

Your Open AI API usage is metered based on the number of tokens used.
You can learn more about token at [What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them).

We have seen how to interact with OpenAI using Java's **HttpClient**.
However, this is low-level and not very convenient to use.
In the next section, we will see how to use **LangChain4j** to interact with OpenAI.

## Using LangChain4j to interact with OpenAI
[LangChain4j](https://langchain4j.github.io/langchain4j/) is a Java port of the popular Python [LangChain](https://www.langchain.com/) library for interacting with LLMs.
LangChain4j provides a high-level API to interact with [LLMs](https://langchain4j.github.io/langchain4j/docs/category/language-models), 
including **OpenAI**, **Vertex AI**, **Ollama**, **HuggingFace**, etc.

Create a Java project and add the following dependency to your **pom.xml**:

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j</artifactId>
    <version>0.27.1</version>
</dependency>
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-open-ai</artifactId>
    <version>0.27.1</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.5.0</version>
</dependency>
```

We have added the **langchain4j** core library and **langchain4j-open-ai** which provides integration with Open AI.

Now, let's see how to use LangChain4j to interact with OpenAI.

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

public class LangChain4jOpenAIDemo {
    
    public static void main(String[] args) {
        String openAiKey = System.getenv("OPENAI_API_KEY");
        ChatLanguageModel model = OpenAiChatModel.withApiKey(openAiKey);
        String answer = model.generate("List all the movies directed by Quentin Tarantino");
        System.out.println(answer);
    }
}
```

As you can see, using LangChain4j provides high-level abstraction and gives a simple API to interact with OpenAI.

{{< box tip >}}
**TIP**

You can also use the special LangChain4j Open AI API key "demo" to test the OpenAI APIs without using your own API key. 

{{< /box >}}

We have just seen the basic usage of LangChain4j to interact with OpenAI.
In the future articles, we will explore more advanced features of LangChain4j such as using PromptTemplates, AiServices, RAG, etc.

Open AI is a paid service, and you will be charged based on the number of tokens used.
While learning and experimenting, you might want to run the LLM model locally without incurring cost.
Luckily, there are a few open-source projects that provide LLM models that you can run locally.
In the next section, we will see how to run a LLM model locally using Ollama.

## Running a LLM model locally using Ollama
[Ollama](https://ollama.com/) is an open-source project that provides LLM models that you can run locally.
Download and install Ollama from [here](https://ollama.com/download).
Once installed, you can start Ollama and run any available [Models](https://ollama.com/library).
We are going to run [llama2](https://ollama.com/library/llama2) model.

```shell
ollama run llama2
```

When you run it for the first time, it will download the model and start the server.
Once the server is started, you can check the status by visiting [http://localhost:11434](http://localhost:11434)
which should display **Ollama is running**.

Now, let's see how to use LangChain4j to interact with Ollama.

Let's add **langchain4j-ollama** dependency to our `pom.xml`.

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-ollama</artifactId>
    <version>0.27.1</version>
</dependency>
```

Now, let's use LangChain4j Ollama APIs to interact with Ollama LLM.

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;

public class OllamaChatDemo {

    public static void main(String[] args) {
        ChatLanguageModel model = OllamaChatModel.builder()
                .baseUrl("http://localhost:11434")
                .modelName("llama2")
                .build();
        String answer = model.generate("List all the movies directed by Quentin Tarantino");
        System.out.println(answer);
    }
}
```

You can see that using LangChain4j, we can interact with Ollama LLM in the same way as we did with OpenAI.

Instead of installing Ollama manually, you can use [Testcontainers](https://www.testcontainers.org/) to run Ollama in a Docker container.
In the next section, we will see how to use LangChain4j with Testcontainers to run Ollama in a Docker container.

## Working with Ollama using LangChain4j and Testcontainers
[Testcontainers](https://www.testcontainers.org/) is a Java library that can provide lightweight, throwaway instances of any Docker container.
LangChain4j provides various [Ollama Docker images](https://hub.docker.com/repositories/langchain4j) with different LLM models.

First, let's add the Testcontainers dependency to our `pom.xml`.

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.4</version>
    <scope>test</scope>
</dependency>
```

Let's see how to use LangChain4j with Testcontainers to run Ollama in a Docker container.

```java
public class LangChain4jTestcontainersDemo {
    static String MODEL_NAME = "llama2";
  
    public static void main(String[] args) {
      GenericContainer<?> ollama = new GenericContainer<>("langchain4j/ollama-" + MODEL_NAME + ":latest")
              .withExposedPorts(11434);
      ollama.start();
      
      String baseUrl = String.format("http://%s:%d", ollama.getHost(), ollama.getFirstMappedPort());
      ChatLanguageModel model = OllamaChatModel.builder()
              .baseUrl(baseUrl)
              .modelName(MODEL_NAME)
              .build();
      String answer = model.generate("List all the movies directed by Quentin Tarantino");
      System.out.println(answer);

      ollama.stop();
    }
}
```

Testcontainers will start the Ollama Docker container and expose the container port 11434 on a random available port on the host.
We can get the host and port using `ollama.getHost()` and `ollama.getFirstMappedPort()` respectively.

If you are building a Spring Boot, Quarkus, or Micronaut application, 
you can run Ollama in a Docker container for integration tests and running the application locally
using their out-of-the-box integration with Testcontainers.

## Conclusion
We have explored the basics of Generative AI and how to interact with OpenAI using Java and LangChain4j.
In the future articles, we will explore more advanced features of LangChain4j, such as using PromptTemplates, AiServices, RAG, etc.