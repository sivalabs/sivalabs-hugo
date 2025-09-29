---
title: Spring AI RAG using Embedding Models and Vector Databases
author: Siva
images:
  - /preview-images/spring-ai-rag.webp
type: post
draft: false
date: 2024-03-14T23:29:17.000Z
url: /blog/spring-ai-rag-using-embedding-models-vector-databases
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
  - /spring-ai-rag-using-embedding-models-vector-databases
---
In this article, we will explore the following:

* Introduction to Embedding Models.
* Loading data using DocumentReaders.
* Storing embeddings in VectorStores.
* Implementing RAG (Retrieval-Augmented Generation), a.k.a. Prompt Stuffing.

Let's get started.

<!--more-->

## Introduction

{{< box info >}}
**Sample Code Repository**

You can find the sample code for this article in the [GitHub repository](https://github.com/sivaprasadreddy/spring-ai-samples/tree/main/spring-ai-openai)

{{< /box >}}

Large Language Models(LLMs) like OpenAI, Azure Open AI, Google Vertex, etc are 
trained on large datasets. But those models are not trained on your private data, 
so they may not be able to answer questions specific to your domain.
But training a model on your private data may be expensive and time-consuming.
So, how can we use these LLMs to answer questions specific to our domain?

One way to do this is to use RAG (Retrieval-Augmented Generation), a.k.a. Prompt Stuffing.
Using RAG, we will retrieve relevant documents from a datastore and pass that to the LLM to generate the answer.
In this process, we will use an embedding model to convert the documents into embeddings and store them in a vector database.

## Understand Retrieval-Augmented Generation (RAG)
Your business might store structured data in relational databases, unstructured data in NoSQL databases, or even in files.
You will be able to effectively query relational databases using SQL, NoSQL databases using their query languages.
You can also use full-text search engines like Elasticsearch, Solr, etc., to query unstructured data.

However, you might want to retrieve data using natural language with semantic meaning.

For example, "I love Java programming language" and "Java is always my go-to language" have the same semantic meaning, but uses different words.
Trying to retrieve data using the exact words might not be effective.

This is where **Embeddings** comes into play. Embeddings are vector representations of words, sentences, or documents.
You can use these embeddings to retrieve data using natural language.

You can convert your structured and unstructured data into embeddings and store them in a **Vector Database**.
You can then query the **Vector Database** using natural language and retrieve relevant data.
Then, you can query the AI models passing along the relevant data to get the responses.

> **Retrieval-Augmented Generation (RAG)** is the process of optimizing the output of a LLM,
by using additional knowledge base in addition to its training data before generating a response.

## Embedding APIs
The Embedding APIs can convert words, sentences, documents, or images into embeddings. 
An embedding is a vector representation of words, sentences, or documents.

For example, A word "Apple" might be represented as a vector [0.1, 0.2, 0.3, 0.4, 0.5]. 
A sentence "I love Apple" might be represented as a vector [0.1, 10.3, -10.2, 90.3, 2.4, -0.5].

Spring AI provides an **EmbeddingModel** interface to convert text or documents into embeddings.
You can use any of the supported **EmbeddingModel** implementations 
like **OpenAiEmbeddingModel**, **OllamaEmbeddingModel**, 
**AzureOpenAiEmbeddingModel**, **VertexAiEmbeddingModel**, etc.

Depending on which implementation you want to use, you can add the corresponding dependency 
and configure the properties in **application.properties** file.

For example, if you want to use OpenAI's EmbeddingModel, you can add the following dependency to your **pom.xml** file.

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    <version>1.0.0-M1</version>
</dependency>
```

Configure the properties in **application.properties** file.

```properties
spring.ai.openai.api-key=${OPENAI_API_KEY}

# You can override the above common api-key for embedding using the following property
spring.ai.openai.embedding.api-key=${OPENAI_API_KEY}
```

With the above configuration, you can inject **EmbeddingModel** and 
convert text or documents into embeddings as follows:

```java
@Component
class MyComponent {
    private final EmbeddingModel embeddingModel;
    
    public MyComponent(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }
    
    public void convertTextToEmbedding() {
        //Example 1: Convert text to embeddings
        List<Double> embeddings1 = embeddingModel.embed("I like Spring Boot");
        
        //Example 2: Convert document to embeddings
        List<Double> embeddings2 = embeddingModel.embed(new Document("I like Spring Boot"));
        
        //Example 3: Convert text to embeddings using options
        EmbeddingRequest embeddingRequest =
                new EmbeddingRequest(List.of("I like Spring Boot"),
                        OpenAiEmbeddingOptions.builder()
                                .withModel("text-davinci-003")
                                .build());
        EmbeddingResponse embeddingResponse = embeddingModel.call(embeddingRequest);
        List<Double> embeddings3 = embeddingResponse.getResult().getOutput();
    }
}
```

## Vector Database
A Vector Database is a database that stores embeddings.
You can store embeddings of words, sentences, or documents in a Vector Database.
You can use the Vector Database to query the embeddings using natural language and retrieve relevant data.

Spring AI provides a **VectorStore** interface to store and retrieve embeddings.
Currently, Spring AI provides **VectorStore** implementations like **SimpleVectorStore**, 
**ChromaVectorStore**, **Neo4jVectorStore**, **PgVectorStore**, **RedisVectorStore**, etc.

Let us see how to use **SimpleVectorStore** to store and retrieve embeddings.

```java
@Configuration
class AppConfig {
    @Bean
    VectorStore vectorStore(EmbeddingModel embeddingModel) {
        return new SimpleVectorStore(embeddingModel);
    }
}

@Component
class MyComponent {
    private final VectorStore vectorStore;
    
    public MyComponent(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
    
    public void storeAndRetrieveEmbeddings() {
        // Store embeddings
        List<Document> documents = 
                List.of(new Document("I like Spring Boot"),
                        new Document("I love Java programming language"));
        vectorStore.add(documents);
        
        // Retrieve embeddings
        SearchRequest query = SearchRequest.query("Spring Boot").withTopK(2);
        List<Document> similarDocuments = vectorStore.similaritySearch(query);
        String relevantData = similarDocuments.stream()
                            .map(Document::getContent)
                            .collect(Collectors.joining(System.lineSeparator()));
    }
}
```

In the above code, we are adding the Documents to the VectorStore, 
which internally converts the documents into embeddings using the EmbeddingClient 
and stores them in the Vector Database.

We are then querying the VectorStore using natural language and retrieving relevant data.
We specified the maximum number of similar documents to return using the **withTopK()** method.

## DocumentReader and DocumentWriter
In the above examples, we directly constructed a **Document** instance from a String to represent the text or document.
But in real-world applications, you might want to read the documents from a file, database, or any other source.

Spring AI provides **DocumentReader** and **DocumentWriter** interfaces to read and write documents from and to different sources.

As of now, Spring AI provides **DocumentReader** implementations like **JsonReader**, 
**TextReader**, **PagePdfDocumentReader**, etc.

The **VectorStore** interface extends the **DocumentWriter** interface, 
so you can use any **VectorStore** implementation as a **DocumentWriter**.

Let us see how to use **TextReader** to read a text document and store it in the VectorStore.

```java
@Component
class MyComponent {
    private final VectorStore vectorStore;
    
    @Value("classpath:myfile.txt")
    private Resource resource;
    
    public MyComponent(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
    
    public void storeEmbeddingsFromTextFile() {
        var textReader = new TextReader(resource);
        textReader.setCharset(Charset.defaultCharset());
        List<Document> documents = textReader.get();

        vectorStore.add(documents);
    }
}
```

In the above example, we are reading the text from a classpath file and storing it in the VectorStore.

## Implementing RAG (Retrieval-Augmented Generation)
Now that we have seen how to convert documents into embeddings and store them in the Vector Database,
and how to retrieve relevant documents using natural language, let us see how to implement RAG.

```java
@RestController
class RAGController {
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    RAGController(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
    }
    
    // Assume that we have already read the documents from files containing information about people 
    // and stored them in the VectorStore as described in the previous section.
    
    @GetMapping("/ai/rag/people")
    Person chatWithRag(@RequestParam String name) {
        // Querying the VectorStore using natural language looking for the information about a person.
        List<Document> similarDocuments = 
                vectorStore.similaritySearch(SearchRequest.query(name).withTopK(2));
        String information = similarDocuments.stream()
                .map(Document::getContent)
                .collect(Collectors.joining(System.lineSeparator()));
        
        // Constructing the systemMessage to indicate the AI model to use the passed information
        // to answer the question.
        var systemPromptTemplate = new SystemPromptTemplate("""
              You are a helpful assistant.
              
              Use the following information to answer the question:
              {information}
              """);
        var systemMessage = systemPromptTemplate.createMessage(
                Map.of("information", information));

        // Using BeanOutputConverter to parse the response into an instance of Person.
        var outputConverter = new BeanOutputConverter<>(Person.class);
        
        // Constructing the userMessage to ask the AI model to tell about the person.
        PromptTemplate userMessagePromptTemplate = new PromptTemplate("""
        Tell me about {name} as if current date is {current_date}.

        {format}
        """);
        Map<String,Object> model = Map.of("name", name,
                "current_date", LocalDate.now(),
                "format", outputConverter.getFormat());
        var userMessage = new UserMessage(userMessagePromptTemplate.create(model).getContents());

        var prompt = new Prompt(List.of(systemMessage, userMessage));

        var response = chatClient.prompt(prompt).call().content();

        return outputConverter.convert(response);
    }
}

record Person(String name,
              String dateOfBirth,
              int experienceInYears,
              List<String> books) {
}
```

The explanation of the above code is included in the comments.

Overall, the RAG process involves the following steps:
* Load the documents from different sources using **DocumentReaders**.
* Convert the documents into embeddings using **EmbeddingModel** and store them in the **VectorStore**.
* Query the VectorStore using natural language and retrieve relevant documents.
* Construct the **SystemMessage** to indicate the AI model to use the passed information to answer the question.
* Construct the **UserMessage** to ask the AI model for the information.
* Construct the prompt and call the AI model to get the response.
* Parse the response into the desired format using **OutputConverters**.
* Return the response.

## Conclusion
In this article, we have seen how to use Embedding APIs to convert text or documents into embeddings.
We have also seen how to use Vector Database to store and retrieve embeddings.
We have implemented RAG (Retrieval-Augmented Generation) to use the retrieved information to answer questions using AI models.
