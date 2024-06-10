---
title: "LangChain4j AiServices Tutorial"
author: Siva
images: ["/preview-images/langchain4j-ai-services.webp"]
type: post
draft: false
date: 2024-02-23T04:59:17+05:30
url: /langchain4j-ai-services-tutorial
toc: true
categories: [AI]
tags: [AI, Generative AI, Java, LangChain4j, OpenAI]
---
In this article, we will explore the following:

* Using LangChain4j **AiServices** to interact with LLMs.
* How to ask questions and map responses to different formats?
* Summarizing the given text in different formats.
* Analyzing the sentiment of the given text.

{{< box info >}}
**Sample Code Repository**

You can find the sample code for this article in the [GitHub repository](https://github.com/sivaprasadreddy/langchain4j-demos)

{{< /box >}}

In the [previous article]({{< relref "2024-02-21-generative-ai-conversations-using-langchain4j-chat-memory.md" >}}), 
we have seen how to have a conversation using LangChain4j **ChatMemory** and **ConversationalChain**.
As mentioned in the **ConversationalChain** JavaDocs, let us see how to use **AiServices** which is more flexible and feature rich.

{{< box info >}}
**LangChain4j Tutorial Series**

You can check out the other articles in this series:

* [Part 1: Getting Started with Generative AI using Java, LangChain4j, OpenAI and Ollama]({{< relref "2024-02-19-getting-started-with-generative-ai-using-java-langchain4j.md" >}})
* [Part 2: Generative AI Conversations using LangChain4j ChatMemory]({{< relref "2024-02-21-generative-ai-conversations-using-langchain4j-chat-memory.md" >}})
* [Part 3: LangChain4j AiServices Tutorial]({{< relref "2024-02-23-langchain4j-ai-services.md" >}})
* [Part 4: LangChain4j Retrieval-Augmented Generation (RAG) Tutorial]({{< relref "2024-02-26-langchain4j-rag.md" >}})
{{< /box >}}

So far we have seen asking questions using **chatLanguageModel.generate(question)** method which returns response as **String**.
But, using **AiServices**, we can create a Java interface that takes input and returns output in a specific format.

## Using AiServices to interact with LLMs
Let's see how to use **AiServices** to interact with LLMs.

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

public class AiServicesDemo {

    interface Assistant {
        String chat(String message);
    }
    
    public static void main(String[] args) {
        String openAiKey = "demo";
        //String openAiKey = System.getenv("OPENAI_API_KEY");
        ChatLanguageModel model = OpenAiChatModel.withApiKey(openAiKey);

        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(2);
        Assistant assistant = AiServices.builder(Assistant.class)
                                        .chatLanguageModel(model)
                                        .chatMemory(chatMemory)
                                        .build();
        String question = "What are all the movies directed by Quentin Tarantino?";
        String answer = assistant.chat(question);
        System.out.println("Answer: " + answer);
    }
}
```

We have created an interface called **Assistant** with a method **chat** which takes a message and returns a response.
We have used **AiServices.builder()** to create an instance of **Assistant** and used **ChatMemory** to remember the context of the conversation.
LangChain4j dynamically provides an implementation for the **Assistant** interface.

So far, this doesn't look much better from the previous approach. 
But the real power of **AiServices** comes when we want to map the request and response to a specific format.

Let's see another example.

```java
interface FunnyAssistant {
    @UserMessage("Tell me a joke about {{it}}")
    String tellMeAJokeAbout(String subject);
}

FunnyAssistant funnyAssistant = AiServices.builder(FunnyAssistant.class)
        .chatLanguageModel(model)
        .build();
String answer = funnyAssistant.tellMeAJokeAbout("Python");
System.out.println("Joke about [Python]: " + answer);
//Joke about [Python]: Why do programmers prefer Python over C++? Because they don't like snakes... or brackets!
```

In this example, we are passing only the subject as input, and the complete question is formed using the **@UserMessage** annotation.
When we look at the client code **funnyAssistant.tellMeAJokeAbout("Python")**, 
it just looks like a regular method call without any AI specific logic.

As there is only one parameter, and we didn't name it explicitly with **@V("name")**, it is named as "it" by default.

Let's see a few more examples.

```java
interface FunnyAssistant {
    @UserMessage("Tell me a joke about {{it}}")
    String tellMeAJokeAbout(String subject);

    //@SystemMessage("You are a friendly, polite chat assistant")
    @SystemMessage("You are a sarcastic and funny chat assistant")
    String chat(String message);

    @SystemMessage("You are an IT consultant who just replies \"It depends\" to every question")
    String ask(String question);
}

FunnyAssistant funnyAssistant = AiServices.builder(FunnyAssistant.class)
        .chatLanguageModel(model).build();

String answer = funnyAssistant.chat("Do you think you are smarter than humans?");
System.out.println("Answer: " + answer);
//Answer: Oh, definitely not. I mean, I may know a lot of random facts and have access to vast amounts of information, but I still can't tie my own shoelaces. So, I think humans have the upper hand on that one.

answer = funnyAssistant.ask("Do we need to use Microservices?");
System.out.println("Answer: " + answer);
//Answer: It depends

answer = funnyAssistant.ask("Is Node.js better than Python?");
System.out.println("Answer: " + answer);
//Answer: It depends
```

That was fun :-) Mocking the IT Consultants and making the Chat Assistant sarcastic.

But the point is, you can use **@SystemMessage** to tell the AI model about the role of the assistant and how to respond.
You can also use both **@UserMessage** and **@SystemMessage** on the same method.

## Summarizing the given text
A good usecase for Generative AI is analyzing the large text and summarizing it.
Let's see how we can summarize the given text using AiServices.

```java
interface Summarizer {
    @UserMessage("Give a summary of {{name}} in 3 bullet points using the following information:\n\n {{info}}")
    String summarize(@V("name") String name, @V("info") String info);
}

Summarizer summarizer = AiServices.builder(Summarizer.class).chatLanguageModel(model).build();

String aboutSiva = """
            Siva, born on 25 June 1983, is a software architect working in India.
            He started his career as a Java developer on 26 Oct 2006 and worked with other languages like
            Kotlin, Go, JavaScript, Python too.
                            
            He authored "Beginning Spring Boot 3" book with Apress Publishers.
            He has also written "PrimeFaces Beginners Guide" and "Java Persistence with MyBatis 3" books with PacktPub.
            """;
String answer = summarizer.summarize("Siva", aboutSiva);
System.out.println("[About Siva]: \n" + answer);

//[About Siva]: 
//- Siva is a software architect born on 25 June 1983 in India, who started his career as a Java developer in 2006 and has experience working with other languages like Kotlin, Go, JavaScript, and Python.
//- He authored the book "Beginning Spring Boot 3" with Apress Publishers, as well as "PrimeFaces Beginners Guide" and "Java Persistence with MyBatis 3" with PacktPub.
//- Siva has a strong background in software development and has contributed to multiple books in the field of programming and software development.
```

In this example, the given text is summarized, but to me, it doesn't look very impressive.

Let's see how to summarize the given text in a specific format.

```java
interface Summarizer {

    @UserMessage("""
            Give a person summary in the following format:
             Name: ...
             Date of Birth: ...
             Profession: ...
             Books Authored: ...
            
            Use the following information:
            {{info}}
            """)
    String summarizeInFormat(@V("info") String info);
}

answer = summarizer.summarizeInFormat(aboutSiva);
System.out.println("[About Siva]:\n" + answer);
```

This gave me the following response:

```shell
[About Siva]:
Name: Siva
Date of Birth: 25 June 1983
Profession: Software Architect
Books Authored:
    1. "Beginning Spring Boot 3" with Apress Publishers
    2. "PrimeFaces Beginners Guide" with PacktPub
    3. "Java Persistence with MyBatis 3" with PacktPub
```

This looks nice. We can ask the AI model to summarize the given text in a specific format.

Let's try to summarize the text in JSON format.

```java
interface Summarizer {

    @UserMessage("""
            Summarize the the following information in JSON format having name, date of birth,
            experience in years and books authored as keys:
            {{info}}
            """)
    String summarizeAsJSON(@V("info") String info);
}

answer = summarizer.summarizeAsJSON(aboutSiva);
System.out.println("[About Siva]:\n" + answer);
```

This gave me the following response:

```shell
[About Siva in JSON Format]: {
  "name": "Siva",
  "date_of_birth": "25 June 1983",
  "experience_in_years": 15,
  "books_authored": [
    "Beginning Spring Boot 3 (Apress Publishers)",
    "PrimeFaces Beginners Guide (PacktPub)",
    "Java Persistence with MyBatis 3 (PacktPub)"
  ]
}
```

This is great, but so far we are getting responses in String format.
How about getting the response as a Java object? Let's try that.

```java 
record Person(String name, 
              LocalDate dateOfBirth, 
              int experienceInYears, 
              List<String> booksAuthored) {
}

interface Summarizer {
    @UserMessage("""
        Give a person summary as of {{current_date}}
                
        Using the following information:
                
        {{info}}
        """)
    Person summarizeAsBean(@V("info") String info);
}

Person person = summarizer.summarizeAsBean(aboutSiva);
System.out.println("[About Siva]:\n" + person);
```

This approach successfully extracts the details and maps the values into Person record and gave me the following response:

```shell
[About Siva]:
Person[name=Siva, dateOfBirth=1983-06-25, experienceInYears=17, booksAuthored=[Beginning Spring Boot 3, PrimeFaces Beginners Guide, Java Persistence with MyBatis 3]]
```

## Mapping Java object to UserMessage using StructuredPrompt
We have seen different ways to map the response to different formats.
We can also map the input passed as a Java object to a user message using **@StructuredPrompt** annotation as follows:

```java
@StructuredPrompt("Give summary of {{name}} as of {{current_date}} using the following information:\n\n{{info}}")
record PersonSummaryPrompt(String name, String info) {
}

interface Summarizer {
    Person summarize(PersonSummaryPrompt prompt);
}

PersonSummaryPrompt prompt = new PersonSummaryPrompt("Siva", aboutSiva);
Person person = summarizer.summarize(prompt);
System.out.println("[About Siva]\n: " + person);
```

This gave me the following response:

```shell
[About Siva]:
Person[name=Siva, dateOfBirth=1983-06-25, experienceInYears=17, booksAuthored=[Beginning Spring Boot 3, PrimeFaces Beginners Guide, Java Persistence with MyBatis 3]]
```

## Sentiment Analysis
Another usecase of Generative AI is sentiment analysis.
Let's see how to analyze the sentiment of the given text using AiServices.

```java
enum Sentiment {
    POSITIVE, NEGATIVE, SARCASTIC
}

interface SentimentAnalyzer {
    Sentiment analyze(String text);
}

SentimentAnalyzer sentimentAnalyzer = AiServices.builder(SentimentAnalyzer.class)
        .chatLanguageModel(model).build();
Sentiment sentiment = analyzer.analyze("I love Java programming language");
System.out.println("Sentiment: " + sentiment);
//Sentiment: POSITIVE

sentiment = analyzer.analyze("I am sick of writing if err != nil for every 3rd line of code");
System.out.println("Sentiment: " + sentiment);
//Sentiment: NEGATIVE

sentiment = analyzer.analyze("You seem to like ten layers of abstractions in your code, don't you?");
System.out.println("Sentiment: " + sentiment);
//Sentiment: SARCASTIC
```

We have seen how to use **AiServices** to interact with LLMs and how to map the request and response to different formats.
But there is a lot more to AiServices such as **RAG**, **Tools**, **Shared or per-user ChatMemory** and more.

## Conclusion
In this article, we have taken a static piece of text as input and summarized it in different formats.
But in the real world, we may need to analyze the large text stored in text files, web pages, or databases.

We will explore how to use LangChain4j **Retrieval-Augmented Generation (RAG)** to use our own knowledge base 
to answer questions in the next article.

