---
title: "Generative AI Conversations using LangChain4j ChatMemory"
author: Siva
images: ["/preview-images/langchain4j-chat-memory.webp"]
type: post
draft: false
date: 2024-02-21T04:59:17+05:30
url: /generative-ai-conversations-using-langchain4j-chat-memory
toc: true
categories: [AI]
tags: [AI, Generative AI, Java, LangChain4j, OpenAI]
---
In this article, we will explore the following:

* How to use LangChain4j **ChatMemory** and **ConversationalChain** to implement conversation style interaction?
* How to ask questions using **PromptTemplate**?

In the [previous article]({{< relref "2024-02-19-getting-started-with-generative-ai-using-java-langchain4j.md" >}}), we have seen how to interact with OpenAI using Java and LangChain4j.

{{< box info >}}
**LangChain4j Tutorial Series**

You can check out the other articles in this series:

* [Part 1: Getting Started with Generative AI using Java, LangChain4j, OpenAI and Ollama]({{< relref "2024-02-19-getting-started-with-generative-ai-using-java-langchain4j.md" >}})
* [Part 2: Generative AI Conversations using LangChain4j ChatMemory]({{< relref "2024-02-21-generative-ai-conversations-using-langchain4j-chat-memory.md" >}})
* [Part 3: LangChain4j AiServices Tutorial]({{< relref "2024-02-23-langchain4j-ai-services.md" >}})
{{< /box >}}

{{< box info >}}
**Sample Code Repository**

You can find the sample code for this article in the [GitHub repository](https://github.com/sivaprasadreddy/java-ai-demos)

{{< /box >}}

I will assume that you have created a Java project with the following dependency to your **pom.xml**:

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

## What is the need for ChatMemory?
In general, while we, human beings, are having a conversation, we remember the context of the conversation and use it to continue the conversation.

Consider the following example:

```shell
Person1: What are all the movies directed by Quentin Tarantino?
Person2: Pulp Fiction, Kill Bill, etc.
Person1: How old is he?
Person2: He is 60 years old.
```

In the above conversation, Person2 remembers the context of the conversation 
and understands "he" in the question "How old is he?" refers to Quentin Tarantino.

Let's try to implement the above conversation using LangChain4j OpenAI LLM.


```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

public class OpenAIChatMemoryDemo {
    
    public static void main(String[] args) {
      String openAiKey = "demo";
      //String openAiKey = System.getenv("OPENAI_API_KEY");
      ChatLanguageModel model = OpenAiChatModel.withApiKey(openAiKey);

      String answer = model.generate("What are all the movies directed by Quentin Tarantino?");
      System.out.println(answer); // Pulp Fiction, Kill Bill, etc.

      answer = model.generate("How old is he?");
      System.out.println(answer);
    }
}
```

When you run the above code, you will get the outputs similar to the following:

```shell
Answer 1: I'm sorry, I cannot answer that question without more context or information about the person you are referring to.

Answer 2: I'm sorry, without more context I am unable to determine who "he" is or his age. Can you please provide more information?
...
```

As you can see, the **ChatLanguageModel** does not remember the context of the conversation.

LangChain4j provides a way to remember the context of the conversation 
using **ConversationalChain** and **ChatMemory**.

## How to use ConversationalChain with ChatMemory?
From the JavaDocs of **ConversationalChain**:

> A chain for conversing with a specified ChatLanguageModel while maintaining a memory of 
> the conversation. Includes a default ChatMemory (a message window with maximum 10 messages), 
> which can be overridden. It is recommended to use AiServices instead, as it is more powerful.

Let's see how to use **ConversationalChain** with **ChatMemory**.

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

public class OpenAIChatMemoryDemo {
    
    public static void main(String[] args) {
      String openAiKey = "demo";
      //String openAiKey = System.getenv("OPENAI_API_KEY");
      ChatLanguageModel model = OpenAiChatModel.withApiKey(openAiKey);

      ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(20);
      //ChatMemory chatMemory = TokenWindowChatMemory.withMaxTokens(300, new OpenAiTokenizer(GPT_3_5_TURBO));

      ConversationalChain chain = ConversationalChain.builder()
                                    .chatLanguageModel(model)
                                    .chatMemory(chatMemory)
                                    .build();
      String answer = chain.execute("What are all the movies directed by Quentin Tarantino?");
      System.out.println(answer); // Pulp Fiction, Kill Bill, etc.

      answer = chain.execute("How old is he?");
      System.out.println(answer); // Quentin Tarantino was born on March 27, 1963, so he is currently 58 years old.
    }
}
```

We have created an instance of **ChatMemory** using **MessageWindowChatMemory** with a maximum of 20 messages.
Instead of using **MessageWindowChatMemory**, you can also use **TokenWindowChatMemory** with a specified maximum limit of tokens.

Then, we have created an instance of **ConversationalChain** using the chat model and chat memory.
Now, when you run the above code, you will get the outputs similar to the following:

```shell
Reservoir Dogs (1992), Pulp Fiction (1994), Jackie Brown (1997), ...

Quentin Tarantino was born on March 27, 1963, so he is currently 58 years old.
```

So, the **ConversationalChain** remembers the context of the conversation and provides the correct answers.

If you are a keen observer, you might have noticed that the second question "How old is he?" is not providing the exact age of Quentin Tarantino.
It is calculating the age based on the birthdate and date of model training, not based on the current date.

You can refine the question by providing more context to get the exact age.

```java
answer = chain.execute("How old is he as of "+ LocalDate.now() + "?");
System.out.println(answer); //As of February 21, 2024, Quentin Tarantino would be 60 years old.
```

Now you will get the correct age of Quentin Tarantino.
While you can do String concatenation to provide the context, LangChain4j provides a better way to ask questions using **PromptTemplate**.

## How to ask questions using PromptTemplate?
**PromptTemplate** is a way to ask questions with a predefined template, optionally with placeholders.

```java
ConversationalChain chain = ConversationalChain.builder()
        .chatLanguageModel(model)
        .chatMemory(chatMemory)
        .build();
String answer = chain.execute("What are all the movies directed by Quentin Tarantino?");
System.out.println(answer); // Pulp Fiction, Kill Bill, etc.

Prompt prompt = PromptTemplate.from("How old is he as of {{current_date}}?").apply(Map.of());
answer = chain.execute(prompt.text());
System.out.println(answer); //As of February 21, 2024, Quentin Tarantino would be 60 years old.
```

We have created an instance of **Prompt** using **PromptTemplate** with a placeholder **{{current_date}}**.
However, we didn't pass the value for **current_date**, because special variables **{{current_date}}**, 
**{{current_time}}**, and **{{current_date_time}}** are automatically filled with **LocalDate.now()**, 
**LocalTime.now()**, and **LocalDateTime.now()** respectively.

If there are other placeholders, you can pass the values using **Map**.

```java
Prompt prompt = PromptTemplate
                    .from("How old is {{name}} as of {{current_date}}?")
                    .apply(Map.of("name","Quentin Tarantino"));
```

PromptTemplates provides many other features, and we will explore them in the future articles.

## Manually adding messages to ChatMemory
You can also manually add messages to **ChatMemory** without using **ConversationalChain**, 

```java
ChatLanguageModel model = OpenAiChatModel.withApiKey(openAiKey);
ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(20);

chatMemory.add(UserMessage.userMessage("What are all the movies directed by Quentin Tarantino?"));
AiMessage answer = model.generate(chatMemory.messages()).content();
System.out.println(answer.text()); // Pulp Fiction, Kill Bill, etc.
chatMemory.add(answer);

chatMemory.add(UserMessage.userMessage("How old is he?"));
AiMessage answer2 = model.generate(chatMemory.messages()).content();
System.out.println(answer2.text()); // Quentin Tarantino was born on March 27, 1963, so he is currently 58 years old.
chatMemory.add(answer2);
```

I can't think of a use case where you need to manually add messages to **ChatMemory** instead of 
using **ConversationalChain**, but there is such an option.

## Conclusion
In this article, we have seen how to use **ConversationalChain** with **ChatMemory** to remember 
the context of the conversation.

From the JavaDocs of **ConversationalChain**, it is recommended to use **AiServices** instead, as it is more powerful.
In the next article, we will explore **AiServices** and its features.
