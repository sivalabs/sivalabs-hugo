---
title: "A Few Hard Learned Lessons On Structuring Spring Boot Applications"
author: Siva
images: ["/preview-images/structuring-spring-boot-applications.webp"]
type: post
draft: false
date: 2026-06-12T04:59:17+05:30
url: /blog/a-few-hard-learned-lessons-on-structuring
toc: true
categories: [Spring Boot]
tags: [Java, Spring Boot, Spring Modulith]
---
One of the most common questions developers ask when starting a Spring Boot project is: 

**How should I structure my code?**

If you spend enough time in Java circles, you'll quickly run into recommendations like **Clean Architecture, Hexagonal Architecture, Onion Architecture, Ports and Adapters**, and a dozen variations of the same idea.

Now, before anyone gets upset: I think those architectures solve real problems.

The issue is that many teams adopt them on day one, long before they actually have those problems.

Suddenly a simple CRUD application has ports, adapters, facades, mappers, DTOs, command handlers, query handlers, and enough boilerplate to make you wonder whether you're building software or preparing tax documents.

Over the years I've gravitated toward a much simpler approach.

It gives me most of the benefits I care about:

* Clear module boundaries
* Separation of concerns
* Testable business logic
* Maintainable code

...without drowning the codebase in ceremony.

And now that AI coding agents are becoming part of everyday development, having a simple and consistent set of conventions matters even more.

Let me share the conventions I use and how they can be turned into Agent Skills so AI-generated code also follows the same structure.

## Why Are My Files Scattered Across 20 Packages?
The traditional Spring Boot structure organizes code by technical role:

```shell
dev.sivalabs.bookstore/
├── controllers/
│   ├── UserController.java
│   ├── OrderController.java
├── services/
│   ├── UserService.java
│   ├── OrderService.java
├── repositories/
│   ├── UserRepository.java
│   ├── OrderRepository.java
```

At first glance it looks neat and organized.

Until you need to change one feature.

Then adding a single order field turns into a mini treasure hunt across **controllers, services, repositories**, 
and probably a **mapper** package lurking somewhere.

Even worse, this structure does nothing to protect module boundaries.

Nothing stops **OrderController** from calling **UserRepository** directly.

The compiler shrugs. Spring happily wires it.

You find out six months later during a refactoring session that starts with optimism and ends with bargaining.

That's why I prefer organizing code by business feature rather than technical layer.

**Package by feature** groups everything belonging to a business domain together:

```shell
dev.sivalabs.bookstore/
├── Application.java
├── shared/                     # Cross-cutting utilities
├── users/                      # Users bounded context
│   ├── config/
│   ├── domain/
│   │   ├── models/
│   │   ├── UserEntity.java
│   │   ├── UserRepository.java
│   │   ├── UserMapper.java
│   │   └── UserService.java
│   ├── api/
│   │   ├── UserController.java
│   │   ├── CreateUserRequest.java
│   │   └── CreateUserResponse.java
│   └── UsersAPI.java
├── orders/
├── catalog/
└── config/
    ├── WebMvcConfig.java
    ├── SecurityConfig.java
    └── GlobalExceptionHandler.java
```

Now all the code related to users lives together.

If I need to understand the Users module, I don't have to play hide-and-seek across the entire codebase. Everything is right there inside the users package.

## Why Not Keep Everything Flat Inside the Module?
This is a question I get quite often.

After all, if everything belongs to the **Users** module, why not put everything directly under `users/`?

Because developers are human.

Give them access to an HTTP request DTO, and eventually someone will pass it directly into the service layer.

Give them access to an HTTP-specific type and eventually it leaks into business logic.

Good package structures don't just organize code.

They make the wrong thing harder to do.

If **UserController**, **CreateUserRequest**, **CreateUserResponse**, and **UserService** all live in users/ together, 
the request/response DTOs are visible to **UserService** and **UserRepository**.

Nothing in the language prevents a developer from accidentally leaking an HttpServletRequest-bound DTO into a service method signature.

Separating **domain** from **api** makes this impossible: **UserService** cannot even see **CreateUserRequest** because it lives inside the api package with package-private visibility.

## The Business Rules Shouldn't Care How the Request Arrived
Today the request might arrive through a REST endpoint. Tomorrow it might come from a Kafka event handler, a scheduled job, a CLI command, or something else entirely.

The business rules shouldn't change just because the delivery mechanism changed.

That's why I like keeping inbound request handlers thin and pushing all business logic into the domain layer.

The job of an inbound request handler (HTTP Request Handler, Kafka Listener, Scheduled Job, etc.) is surprisingly simple:

* Accept input
* Validate input
* Convert input into a command or query
* Call business logic
* Return a response

That's it.

```java
// api/UserController.java  — Inbound HTTP request handler
@RestController
@RequestMapping("/api/users")
class UserController {

    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    ResponseEntity<CreateUserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        var cmd = new CreateUserCmd(request.name(), request.email());
        var result = userService.createUser(cmd);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateUserResponse(result.userId()));
    }
}
```

Meanwhile, the service orchestrates the actual business rules:

```java
// domain/UserService.java  — business logic
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional
    public RegistrationResult createUser(CreateUserCmd cmd) {
        if (userRepository.existsByEmail(cmd.email())) {
            throw new UserAlreadyExistsException(cmd.email());
        }
        var entity = userMapper.toEntity(cmd);
        var saved = userRepository.save(entity);
        return new RegistrationResult(saved.getId());
    }
}
```

Keeping these responsibilities separate pays off in two ways:

First, testing becomes dramatically simpler.

Second, adding a new delivery mechanism becomes almost trivial because your business logic is already isolated.

## public, public, public Everywhere... Please Stop It
One thing I see in many Spring Boot applications is this:

Everything is **public**.

Controllers? Public.

Services? Public.

Repositories? Public.

Entities? Public.

Mappers? Public.

Utility classes? Also public.

{{< figure src="/images/public-everywhere.webp" >}}

At that point your module boundaries aren't really boundaries anymore.

They're just decorations.

Java gave us package-private visibility for a reason.

We should use it.

My default rule is simple:

**If a class does not need to be visible outside the module, don't make it public.**

That single rule dramatically reduces accidental coupling.

It also makes refactoring much safer because fewer parts of the system can depend on internal implementation details.

```markdown
| Class type                        | Visibility      | Reason                                                                |
|-----------------------------------|-----------------|-----------------------------------------------------------------------|
| UserEntity                        | package-private | Direct entity access couples modules to the DB schema                 |
| UserRepository                    | package-private | Data access belongs to the owning module                              |
| UserMapper                        | package-private | Internal conversion detail                                            |
| UserController                    | package-private | Registered by Spring via component scan; no external reference needed |
| UserService                       | public          | Exposed to inbound request handlers within the same module            |
| CreateUserCmd, UserVM, UserId ... | public          | Shared domain types placed in `domain/models/`                        |
```

## One Front Door Per Module
A service often exposes many methods.

Some are intended for internal use.

Others are safe for other modules to call.

**The mistake is exposing everything.**

Imagine a company where every visitor can walk directly into every office.

That sounds ridiculous.

Most companies have a reception desk.

Your modules should too.

That's what the ModuleAPI facade is.

Other modules interact with the facade.

The facade decides what is available.

Everything else stays internal.

```java
// users/UsersAPI.java
@Service
public class UsersAPI {

    private final UserService userService;

    UsersAPI(UserService userService) {
        this.userService = userService;
    }

    public RegistrationResult createUser(CreateUserCmd cmd) {
        return userService.createUser(cmd);
    }

    public Optional<UserVM> findUserById(Long id) {
        return userService.findUserById(id);
    }
}
```

This keeps dependencies intentional instead of accidental.

## Trust Developers, But Verify With Tests
Every team starts with good intentions.

Someone creates an architecture document.

Everyone agrees it looks great.

The wiki gets published.

People nod approvingly.

{{< figure src="/images/follow-guidelines-right.webp" >}}

Six months later someone injects **UserRepository** directly into an unrelated module, and nobody remembers when the architecture document was last opened.

The uncomfortable truth is this:

**If the build doesn't fail, it's probably just a suggestion.**

That's why I like automated architecture verification.

## ArchUnit: Turning "Don't Do That" Into a Build Failure
Guidelines written in a wiki erode over time. Not because people are careless. Because people are busy, deadlines exist, and "temporary" code has a surprisingly long lifespan.

The only reliable way to keep architecture rules alive is to make violations fail the build.

[ArchUnit](https://www.archunit.org/) lets you convert architecture guidelines into executable tests.

Instead of saying:

**"Repositories should not be accessed outside the module."**

you can make the build fail when somebody does exactly that.

Suddenly, architecture stops being a PowerPoint slide and becomes part of your CI pipeline.

Example tests:

```java
@AnalyzeClasses(packages = "dev.sivalabs.bookstore")
class ArchitectureTests {

    // Controllers must not be called by service or repository classes
    @ArchTest
    static final ArchRule controllers_should_not_be_accessed_by_domain =
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().accessClassesThat()
            .resideInAPackage("..api..");

    // Services must not import anything from the api/web layer
    @ArchTest
    static final ArchRule services_must_not_depend_on_controllers =
        noClasses()
            .that().haveNameMatching(".*Service")
            .should().dependOnClassesThat()
            .haveNameMatching(".*Controller");

    // Repositories must not be accessed from outside their own module
    @ArchTest
    static final ArchRule repositories_are_not_public =
        noClasses()
            .that().haveNameMatching(".*Repository")
            .should().bePublic();

    // Entities must not be public
    @ArchTest
    static final ArchRule entities_are_not_public =
        noClasses()
            .that().haveNameMatching(".*Entity")
            .should().bePublic();
}
```

You can check out the [Taikai](https://github.com/enofex/taikai) library that provides a comprehensive suite of predefined rules for Spring Boot.

## Spring Modulith: Don't Just Define Boundaries, Verify Them
ArchUnit is excellent for enforcing custom rules.

[Spring Modulith](https://spring.io/projects/spring-modulith) goes one step further by understanding your module structure directly.

It can verify dependencies, detect cycles, validate boundaries, and even generate documentation from your application structure.

That's a pretty good deal for a dependency you add to your test scope.

```xml
<dependency>
    <groupId>org.springframework.experimental</groupId>
    <artifactId>spring-modulith-test</artifactId>
    <scope>test</scope>
</dependency>
```

Modulith verification test:

```java
@Test
void verify_module_structure() {
    ApplicationModules.of(Application.class).verify();
}
```

**ApplicationModules.verify()** checks the things we usually hope people remember:

* No module accesses internal (package-private) types of another module
* There are no dependency cycles between modules
* Each module's public API is used for cross-module communication


{{< box info >}}
**Migrating to Modular Monolith using Spring Modulith and IntelliJ IDEA**

Check out [Migrating to Modular Monolith using Spring Modulith and IntelliJ IDEA](https://blog.jetbrains.com/idea/2026/02/migrating-to-modular-monolith-using-spring-modulith-and-intellij-idea/) if you want more details on how to use Spring Modulith.
{{< /box >}}

## Teaching AI Your Architecture Rules Instead of Hoping for the Best
Here's something I've noticed while working with AI coding agents:

They're basically junior developers with infinite energy and zero context.

Ask an AI agent to:

**"Create a user management feature."**

and unless you've provided guidance, you'll probably get:

```shell
controllers/
entities/
services/
repositories/
```

With every class marked **public**.

The AI isn't being careless. It simply doesn't know your conventions.

That's where [Agent Skills](https://agentskills.io/) become incredibly useful.

Instead of repeating the same architectural guidance in every prompt, you encode the rules once and let the agent apply them consistently.

I have created [Spring Boot Skills](https://github.com/sivaprasadreddy/sivalabs-agent-skills/tree/main/skills/spring-boot) which also include how to [organize code](https://github.com/sivaprasadreddy/sivalabs-agent-skills/blob/main/skills/spring-boot/references/code-organization.md) as described above.

The interesting thing is that the conventions work especially well as Agent Skills because they're simple.

Humans can remember them.

AI agents can follow them.

And architecture tests can verify them.

That's a surprisingly effective combination.

{{< box info >}}
**AI-Assisted Java Application Development with Agent Skills**

Check out [AI-Assisted Java Application Development with Agent Skills](https://blog.jetbrains.com/idea/2026/03/ai-assisted-java-application-development-with-agent-skills/) to explore how to create Agent Skills.
{{< /box >}}

## The Rules I Keep Coming Back To
After building Spring Boot applications for years, these are the conventions I keep returning to:

```markdown
| Principle                  | Why I Like It                   |
|----------------------------| ------------------------------- |
| Package by feature         | Related code stays together     |
| Separation of concerns     | Business logic remains reusable |
| Minimize What You Expose   | Boundaries become real          |
| ArchUnit + Modulith        | The build enforces the rules    |
```

Do you need full-blown Clean Architecture or Hexagonal Architecture to build a maintainable Spring Boot application?

Sometimes.

Most of the time?

Probably not.

A small set of well-enforced conventions gets you surprisingly far.

* Package code by business feature.
* Keep controllers thin.
* Expose less.

Verify the rules automatically.

That's the structure I've found easiest to understand, easiest to maintain, and easiest to teach, to both developers and AI agents.

Because these conventions are simple and consistent, you can hand them to your AI coding agent as an Agent Skill. Then the code it generates follows the same structure from the first prompt, instead of after five rounds of "not like that".

Try building a Spring Boot application using [Spring Boot Skills](https://github.com/sivaprasadreddy/sivalabs-agent-skills/tree/main/skills/spring-boot). 
Or, refactor an existing application which is following layered architecture to use the recommended code organization.
