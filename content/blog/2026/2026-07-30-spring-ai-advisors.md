---
title: "Spring AI : Advisors API"
author: Siva
images:
  - /preview-images/spring-ai-advisors.webp
type: post
draft: false
date: 2026-07-30T06:00:00+05:30
url: /blog/spring-ai-advisors-api
toc: true
categories:
  - Spring AI
tags:
  - AI
  - SpringAI
  - OpenAI
aliases:
  - /spring-ai-advisors-api
---
Once an AI feature moves beyond a demo, the model call is rarely the whole story.

You need to log requests, restore conversation history, retrieve relevant documents, reject unsafe input, record metrics, and perhaps validate the model's output.
Putting all of that code directly around every `ChatClient` call works for a while. Then a second endpoint arrives, followed by streaming, and suddenly every model call has its own slightly different pile of plumbing.

<!--more-->

{{< box info >}}
**Sample Code Repository**

You can find the sample code for this article in the [GitHub repository](https://github.com/sivaprasadreddy/spring-ai-tutorial/tree/main/04-advisors)

{{< /box >}}

Spring AI's **Advisors** provide a cleaner boundary for that plumbing.
An advisor can inspect or change a request before it reaches the model, inspect or change the response on the way back, or stop the chain without calling the model at all.

If you have worked with Servlet filters or Spring AOP advices, the idea will feel familiar.
Advisors form an ordered chain around a `ChatClient` execution. The difference is scope: a Servlet filter surrounds HTTP traffic, and an AOP advice surrounds method calls; an advisor surrounds an AI request and response.

## Intercept AI Request and Responses using Advisors

Imagine that our application starts with this innocent-looking call:

```java
String response = chatClient
        .prompt(question.question())
        .call()
        .content();
```

Now suppose every request must pass a sensitive-content check and every successful model interaction must be logged.
We could add both concerns to the controller, but neither belongs to HTTP request handling.
We would also have to remember to repeat them in every place that uses the `ChatClient`.

With advisors, the execution becomes a chain:

```text
Request  -> SafetyCheckAdvisor -> MyLoggingAdvisor -> ChatModel
Response <- SafetyCheckAdvisor <- MyLoggingAdvisor <- ChatModel
```

Each advisor decides whether to delegate to the next link.
That small detail is what makes the abstraction useful: an advisor is not limited to observing a call. It can enrich it, replace its response, or short-circuit it.

{{< figure src="/images/spring-ai-advisors-detailed.webp" >}}

## Building an advisor to log LLM request and response

Our first advisor logs the request, calls the rest of the chain, and then logs the response:

```java
class MyLoggingAdvisor implements CallAdvisor {
    private static final Logger logger = LoggerFactory.getLogger(MyLoggingAdvisor.class);

    @Override
    @NonNull
    public ChatClientResponse adviseCall(
            ChatClientRequest chatClientRequest,
            CallAdvisorChain callAdvisorChain) {

        logger.info("request: {}", chatClientRequest);

        ChatClientResponse chatClientResponse =
                callAdvisorChain.nextCall(chatClientRequest);

        logger.info("response: {}", chatClientResponse.chatResponse());

        return chatClientResponse;
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public int getOrder() {
        return 20;
    }
}
```

`ChatClientRequest` contains the prompt and an advisor context map. `ChatClientResponse` contains the model response and the context that has travelled through the chain.
That context is useful when two advisors need to collaborate without stuffing internal state into the prompt.

The interesting line is this one:

```java
callAdvisorChain.nextCall(chatClientRequest);
```

Calling `nextCall(...)` hands control to the next advisor. Eventually the chain reaches the chat model.
When the model returns, control comes back through the advisors in reverse order.
That gives `MyLoggingAdvisor` an around-style view of the execution: code before `nextCall(...)` handles the outgoing request; code after it handles the incoming response.

This same structure can do more than logging. An advisor can create a new `ChatClientRequest` to enrich a prompt, attach information to the context, or return a modified `ChatClientResponse`.

Now you can add `MyLoggingAdvisor` as a default advisor for `ChatClient` as follows:

```java
@RestController
class ChatController {
    private final ChatClient chatClient;

    ChatController(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultAdvisors(new MyLoggingAdvisor())
                .build();
    }
    
    //....
}
```

The important habit is to keep an advisor focused on one cross-cutting concern. A single "do everything AI advisor" becomes just another controller in disguise.

Also, prompts and model responses frequently contain personal or confidential data. Logging the entire request is convenient while learning, but it is a risky production default.
Redact sensitive fields, restrict log access, and prefer metadata such as latency, token usage, model name, and correlation IDs when the full content is not essential.

## SafetyCheckAdvisor: Blocking a request without calling the model

Here is a deliberately small safety advisor. It checks the prompt for configured words and returns a synthetic assistant response when it finds one:

```java
class SafetyCheckAdvisor implements CallAdvisor {
    private static final Logger logger = LoggerFactory.getLogger(SafetyCheckAdvisor.class);

    private final List<String> sensitiveWords;

    SafetyCheckAdvisor(List<String> sensitiveWords) {
        this.sensitiveWords = sensitiveWords;
    }

    @Override
    public ChatClientResponse adviseCall(
            ChatClientRequest chatClientRequest,
            CallAdvisorChain callAdvisorChain) {

        logger.info("Checking for sensitive words");

        boolean containsSensitiveWord = !CollectionUtils.isEmpty(sensitiveWords)
                && sensitiveWords.stream().anyMatch(word ->
                    chatClientRequest.prompt().getContents().contains(word));

        if (containsSensitiveWord) {
            logger.info("Found sensitive words in the request. Abort further processing");
            return createFailureResponse(chatClientRequest);
        }

        return callAdvisorChain.nextCall(chatClientRequest);
    }

    private ChatClientResponse createFailureResponse(ChatClientRequest chatClientRequest) {

        String failureResponse =
                "I'm unable to respond to that due to sensitive content.";

        return ChatClientResponse.builder()
                .chatResponse(ChatResponse.builder()
                        .generations(List.of(new Generation(
                            new AssistantMessage(failureResponse))))
                        .build())
                .context(Map.copyOf(chatClientRequest.context()))
                .build();
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public int getOrder() {
        return 10;
    }
}
```

Notice what the rejection branch does **not** contain: `callAdvisorChain.nextCall(...)`. The advisor creates a normal-looking `ChatClientResponse` and returns immediately, so downstream advisors and the model are skipped.

This example is useful for understanding short-circuiting, but a substring list is not a production moderation system.
It is case-sensitive, can match part of an innocent word, and is easy to evade with spacing or spelling changes.
Depending on the risk, a real application might normalize input, use a dedicated moderation model, enforce tenant-specific policy, and validate model output as well as user input.

### Testing the short circuit

The sample sends a request containing a configured sensitive word and verifies that the endpoint returns the advisor's response:

```java
@Test
void chatWithSensitiveWordsShouldNotBeSentToLLM() {
    MvcTestResult testResult = mockMvcTester.post().uri("/ai/chat")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                    {
                        "question": "Why javascript ecosystem moves at a fucking crazy speed?"
                    }
                    """)
            .exchange();

    assertThat(testResult)
            .hasStatusOk()
            .bodyJson()
            .convertTo(ChatController.Answer.class)
            .satisfies(answer -> assertThat(answer.answer())
                    .contains("I'm unable to respond to that due to sensitive content"));
}
```

This is a useful end-to-end check of the HTTP response and advisor configuration.
In a production codebase, I would add a focused test with a fake or mocked `ChatModel` and explicitly verify that it received no call.
That turns the test name "should not be sent to LLM" into a directly verified contract rather than an inference from the returned text.

## Advisor Ordering is Important

All advisors are ordered. A lower `getOrder()` value has higher precedence and sees the request earlier.
Responses unwind through the same chain in the opposite direction.

Our safety advisor returns `10`, while the logging advisor returns `20`:

```java
@Override
public int getOrder() {
    return 10;
}
```

That gives us this behavior:

```text
Successful request:
Safety before -> Logging before -> Model -> Logging after -> Safety after

Blocked request:
Safety before -> synthetic response
```

Because the safety check runs first and does not delegate when it rejects a prompt, neither `MyLoggingAdvisor` nor the model sees that prompt.
That is a useful privacy property in this sample.

If we gave the logging advisor the lower order instead, it would wrap the safety advisor and log blocked requests too.
Neither choice is universally correct. The point is that advisor order changes system behavior, so choose it deliberately and cover important chains with tests.

## `CallAdvisor` and `StreamAdvisor`

Spring AI separates non-streaming and streaming interception:

```java
public interface CallAdvisor extends Advisor {
    ChatClientResponse adviseCall(
            ChatClientRequest request,
            CallAdvisorChain chain);
}

public interface StreamAdvisor extends Advisor {
    Flux<ChatClientResponse> adviseStream(
            ChatClientRequest request,
            StreamAdvisorChain chain);
}
```

> **Note:** Implement `CallAdvisor` for `chatClient.prompt(...).call()` and `StreamAdvisor` for `chatClient.prompt(...).stream()`. If the same concern must apply to both execution styles, implement both interfaces or use a built-in advisor that supports both. Streaming is not merely a synchronous response wrapped in a `Flux`; response-side work must account for multiple emissions and completion of the stream.

## Default vs Per-request Advisors

We can register both advisors as defaults while building the `ChatClient`:

```java
@RestController
class ChatController {
    private final ChatClient chatClient;

    ChatController(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultAdvisors(
                        new MyLoggingAdvisor(),
                        new SafetyCheckAdvisor(List.of("fuck", "screw")))
                .build();
    }

    @PostMapping("/ai/chat")
    Answer chat(@RequestBody @Valid Question question) {
        String response = chatClient
                .prompt(question.question())
                .call()
                .content();

        return new Answer(response);
    }

    record Question(@NotBlank String question) {}

    record Answer(String answer) {}
}
```

The `defaultAdvisors(...)` applies the advisors to every request made by this client.
That is the right choice for policies such as mandatory safety checks, observability, or conversation memory that define how a particular client behaves.

For a concern needed by only one request, add it to the request specification instead:

```java
String answer = chatClient.prompt("Explain virtual threads")
        .advisors(new MyLoggingAdvisor())
        .call()
        .content();
```

I prefer defaults for invariants and per-request advisors for optional behavior.
If a safety rule is important enough to protect every call, relying on each developer to remember `.advisors(...)` is an optimistic security design.

## Spring AI Built-in Advisors

Custom advisors are straightforward, but Spring AI already provides advisors for common jobs.
The set evolves, so check the reference documentation for the version you use.
In Spring AI 2.0.0, useful options include:

- `SimpleLoggerAdvisor` logs requests and responses and supports call and streaming flows. Treat full prompt logging as sensitive data handling, not harmless diagnostics.
- `SafeGuardAdvisor` provides a basic sensitive-word guard. Like our example, it is a guardrail rather than a complete moderation strategy.
- `MessageChatMemoryAdvisor` adds conversation memory as messages. `VectorStoreChatMemoryAdvisor` retrieves semantically relevant memories from a vector store.
- `QuestionAnswerAdvisor` implements a straightforward vector-store question-answering flow, while `RetrievalAugmentationAdvisor` supports more modular RAG pipelines.
- `ReReadingAdvisor` applies a re-reading prompting technique to improve reasoning on some tasks.
- `ToolCallingAdvisor` coordinates model tool calls, and `StructuredOutputValidationAdvisor` validates structured model output.

The names are less important than the pattern. Memory, retrieval, safety, logging, tool execution, and output validation are all concerns that surround a model call.
Advisors let those concerns compose without forcing the controller to become the AI equivalent of a junk drawer.

Be especially careful when combining stateful advisors. For example, whether memory runs before or after retrieval can change the query sent to the vector store.
Write down the intended request and response path, assign order values with room between them, and test the composition—not only each advisor in isolation.

## Summary

I would recommend starting with built-in advisors for logging, memory, and RAG, then write a custom advisor only when the application's policy is genuinely domain-specific.
I would keep mandatory advisors on a dedicated, centrally configured `ChatClient`, reserve per-request advisors for optional behavior, and treat order values as part of the design.
