---
title: "Harness Engineering for Java and Spring Boot Applications"
author: "Siva"
images:
  - /preview-images/harness-engineering-for-java-spring.webp
type: post
draft: false
date: 2026-10-29T06:00:00+05:30
slug: harness-engineering-for-java-and-spring-boot-applications
toc: true
categories:
  - AI
tags:
  - AI
  - HarnessEngineering
  - Java
  - SpringBoot
aliases:
  - /harness-engineering-for-java-and-spring-boot-applications
---

I want to accelerate development using AI coding agents, but I don't want to give up on code quality to get there. Generating code faster is useful only if I can keep the application understandable, maintainable, and correct as it grows.

An agent can implement a feature, generate tests, and refactor several classes in a few minutes. Reviewing all those changes carefully still takes time. If every review requires me to point out formatting issues, explain package boundaries again, and ask for missing authorization tests, I have moved the bottleneck rather than removed it.

So I set up a harness to take care of as much code quality verification as possible. Formatting, coverage checks, architecture rules, and behavioral tests become part of the development workflow. The agent gets feedback from executable checks, and I can spend more of my review time on product behavior and design decisions.

{{< box info >}}
**Reference application: FeedbackHub**

I'll use [FeedbackHub](https://github.com/sivaprasadreddy/feedback-hub), a Spring Boot application for employee feedback and discussions, to show what this looks like. It has user management, messages, replies, voting, moderation, and AI-assisted content analysis. That gives us meaningful application with boundaries and business rules to protect.
{{< /box >}}

For my Java projects, the basic expectation is concrete:

```shell
./mvnw spotless:apply <-- should automatically format the code
./mvnw verify         <-- should verify coding standards, architecture violations and run behaviour tests
```

These commands don't prove that a change is perfect. They provide a repeatable baseline that every change must meet.

## Agent Skills: Teach Your Coding Standards to AI Agents

Before any check runs, the agent has to know how I like to build applications. Package structure, how to write REST APIs, how to test them, which build plugins to configure: I don't want to explain these in every prompt.

**Agent Skills** are a good fit. A skill is a folder with a `SKILL.md` file, and optionally supporting files, that the agent loads when the task matches its description. I keep my coding standards and architecture guidelines in skills, and the agent imports them when it works on a Spring Boot application.

I use the Spring Boot skills from [sivalabs-agent-skills](https://github.com/sivaprasadreddy/sivalabs-agent-skills). They capture how I structure packages, build modular monoliths, write REST APIs and persistence code, and test them. Install them once and every project starts from the same baseline instead of a prompt I rewrite from memory.

### Guidelines, Not Rules

Skills are **guidelines**, not rules. A skill is text that goes into the agent's context, and the agent decides how much weight to give it. Most of the time it follows the guidance. Sometimes it doesn't:

- The skill is never loaded because the agent didn't think the task matched its description.
- The agent loads it, then drifts from it in the middle of a long task as the context fills up.
- It follows the spirit of a guideline but not the letter. For example, it makes a repository package-private in one module and public in another.
- A direct instruction in the prompt wins over a skill, even when that instruction contradicts it.

**Nothing in a skill forces the agent to comply. That is the main difference between a skill and the build checks. A failing test blocks the build. A skill that says "keep repositories package-private" only makes it more likely.**

So I use both:

```text
Agent Skills        -> shape the first draft so fewer things need fixing
Executable  checks  -> catch what the agent ignored, misread, or forgot
```

A skill reduces the number of violations the agent produces. [Spotless](https://github.com/diffplug/spotless), [ArchUnit](https://www.archunit.org/), [Taikai](https://github.com/enofex/taikai), [Spring Modulith](https://spring.io/projects/spring-modulith), and the coverage gate are what verify the result. 

{{< box important >}}
**Golden Rule**

If a guideline matters enough that you would reject a pull request for breaking it, you should turn it into an executable rule.
{{< /box >}}

I also still review the diff against these standards. A skill saves me from repeating myself, but it doesn't remove my responsibility for the result.

## Give the Agent a Feedback Loop

**Harness Engineering** means designing the instructions, tools, checks, and feedback loops around an AI coding agent so that it can produce changes we can verify.

A prompt such as “follow best practices” expresses an intention. It doesn't tell us whether the resulting code follows our architecture or preserves an authorization rule.

A useful harness makes those expectations observable:

```text
Read the use case and repository conventions
    -> implement a focused change
    -> format the code
    -> run architecture and behavioral tests
    -> run coverage and quality checks
    -> inspect failures and repair the change
    -> review the final diff
```

Each part has a different job. Instructions explain how to work. Tests and build checks enforce the rules we can automate. Runtime tools help investigate behavior that requires a running application. Human review evaluates whether the solution makes sense.

We already have much of the tooling in the Java ecosystem. The interesting work is connecting it into a loop that an agent can use without waiting for a developer to interpret every routine failure.

## Stop Reviewing Linting/Formatting Changes

Formatting is an easy place to start because the expected result is deterministic. I don't want either a developer or an AI agent spending time arguing about import order and line wrapping.

FeedbackHub uses [Spotless](https://github.com/diffplug/spotless) with [Palantir Java Format](https://github.com/palantir/palantir-java-format) to automatically verify whether code formatted properly or not:

```xml
<plugin>
    <groupId>com.diffplug.spotless</groupId>
    <artifactId>spotless-maven-plugin</artifactId>
    <version>3.10.4</version>
    <configuration>
        <java>
            <importOrder/>
            <removeUnusedImports/>
            <formatAnnotations/>
            <palantirJavaFormat>
                <version>2.103.0</version>
            </palantirJavaFormat>
        </java>
    </configuration>
    <executions>
        <execution>
            <phase>compile</phase>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

With the plugin configured, you can use the following goals:

```shell
./mvnw spotless:apply   <-- formats the code
./mvnw spotless:check   <-- report violations and fails the build without fixing them
```
Binding the `check` goal to `compile` phase means builds enforce the formatting policy early.

## JaCoCo: Make Missing Test Coverage Visible

AI can generate tests quickly. That doesn't mean the tests exercise the important behavior.

FeedbackHub uses [JaCoCo](https://www.jacoco.org/jacoco/) to collect coverage, generate a report, and enforce a minimum of 80% line coverage across the application bundle.

The plugin binds the `report` and coverage `check` goals to `verify` phase:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.16</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <phase>verify</phase>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>BUNDLE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>80%</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

This distinction matters when giving an agent verification instructions:

```shell
# Runs tests, but does not reach the verify-phase coverage gate.
./mvnw test

# Runs tests, and also generates the coverage report and checks the threshold.
./mvnw verify
```

Coverage is a useful signal, not a correctness score. A test can execute an authorization branch without checking whether the wrong user was rejected. A bundle-wide threshold can also hide an under-tested feature behind well-covered code elsewhere. I use coverage to identify gaps, then look at the assertions and acceptance criteria to judge whether those gaps matter.


## ArchUnit: Turn Architecture Decisions into Tests

Architecture tends to drift through small, convenient changes. A controller reaches directly into another module's repository. A domain service imports a web type. An entity becomes public because it is easier to pass around.
These are easy changes for an agent to make when its immediate goal is to get a feature working. 

[ArchUnit](https://www.archunit.org/) lets us encode boundaries as executable rules.

FeedbackHub's `ArchUnitTests` includes these rules:

```java
@AnalyzeClasses(packages = "dev.sivalabs.feedbackhub")
class ArchUnitTests {

    @ArchTest
    static final ArchRule repositoriesShouldNotBePublic =
            classes().that()
                    .areAssignableTo(Repository.class)
                    .should().notBePublic();

    @ArchTest
    static final ArchRule entitiesShouldNotBePublic =
            classes().that()
                    .areAnnotatedWith(Entity.class)
                    .should().notBePublic();

    @ArchTest
    static final ArchRule controllersShouldNotBeAccessedByDomain =
            noClasses().that()
                    .resideInAPackage("..domain..")
                    .should().accessClassesThat()
                    .resideInAPackage("..web..");

    // Services are public (accessible to inbound handlers in the same module),
    // but must only be accessed from within their own module — other modules must go through *API facades.
    @ArchTest
    static final ArchRule servicesShouldNotBeUsedFromOtherModules = classes()
            .that()
            .areAnnotatedWith(Service.class)
            .should(new ArchCondition<>("only be accessed from same module") {
                @Override
                public void check(JavaClass service, ConditionEvents events) {
                    String serviceModule = moduleOf(service);
                    for (Dependency dependency : service.getDirectDependenciesToSelf()) {
                        JavaClass origin = dependency.getOriginClass();
                        String originModule = moduleOf(origin);
                        if (!serviceModule.equals(originModule)) {
                            String message =
                                    origin.getName() + " accesses " + service.getName() + " from another module";
                            events.add(SimpleConditionEvent.violated(dependency, message));
                        }
                    }
                }
            });

    private static String moduleOf(JavaClass clazz) {
        String pkg = clazz.getPackageName();
        String[] parts = pkg.split("\\.");
        return parts[BASE_PACKAGE.split("\\.").length];
    }
}
```

The examples omit imports for readability. The test also has a custom rule preventing services from being accessed from other modules. Cross-module callers must use the module's API facade.

That design is visible in the users module. Here is an excerpt from `UsersAPI`:

```java
package dev.sivalabs.feedbackhub.users;

@Component
public class UsersAPI {
    private final UserService userService;

    UsersAPI(UserService userService) {
        this.userService = userService;
    }

    public Optional<UserDto> findNameById(Long userId) {
        return userService.findById(userId);
    }
}
```

Other modules can ask for a user's info through this facade. They don't need access to the repository or entity.

ArchUnit also supports layered and onion architecture rules. You can use those rules if you want to follow those architecture style for your application. 

```java
@ArchTest
static final ArchRule shouldFollowLayeredArchitecture = 
        layeredArchitecture()
            .consideringAllDependencies()
            .layer("Controller").definedBy("..controller..")
            .layer("Service").definedBy("..service..")
            .layer("Persistence").definedBy("..persistence..")
        
            .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
            .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
            .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service");
    
@ArchTest
static final ArchRule shouldFollowOnionArchitecture = 
        onionArchitecture()
            .domainModels("com.myapp.domain.model..")
            .domainServices("com.myapp.domain.service..")
            .applicationServices("com.myapp.application..")
            .adapter("cli", "com.myapp.adapter.cli..")
            .adapter("persistence", "com.myapp.adapter.persistence..")
            .adapter("rest", "com.myapp.adapter.rest..");
```

## Use Taikai for Recurring Java and Spring Conventions

[Taikai](https://github.com/enofex/taikai), built on top of ArchUnit, provides a fluent API for many recurring Java, testing, JPA, and Spring conventions.

The following is a shortened selection of rules from FeedbackHub's `TaikaiTests`:

```java
class TaikaiTests {

    @Test
    void shouldFulfillConstraints() {
        Taikai.builder()
            .namespace("dev.sivalabs.feedbackhub")
            .java(java -> java
                .noUsageOfDeprecatedAPIs()
                .methodsShouldNotDeclareGenericExceptions())
            .test(test -> test.junit(junit -> junit
                .classesShouldNotBeAnnotatedWithDisabled()
                .methodsShouldNotBeAnnotatedWithDisabled()))
            .jpa(jpa -> jpa.entities(entities -> entities
                .shouldBePackagePrivate()
                .shouldHaveFieldAnnotatedWithVersion()
                .namesShouldMatch(".+Entity")))
            .spring(spring -> spring
                .noAutowiredFields()
                .controllers(controllers -> controllers
                    .namesShouldEndWithController()
                    .shouldNotDependOnOtherControllers()
                    .shouldBePackagePrivate())
                .repositories(repositories -> repositories
                    .shouldNotDependOnServices()
                    .namesShouldEndWithRepository()
                    .shouldBePackagePrivate())
                .transactional(transactional -> transactional
                    .methodsShouldBePublic()
                    .shouldNotBeUsedInControllers()))
            .build()
            .checkAll();
    }
}
```

These checks reduce recurring review comments: use constructor injection, keep transactions out of controllers, preserve repository boundaries, and don't disable tests to make the build green.

Some rules are team preferences rather than universal truths. FeedbackHub's full test also checks logger conventions, entity identifier types, naming, and date types. Adopt a rule because you can explain its value for your application. A harness full of arbitrary restrictions creates work without improving the design.

## Spring Modulith: Verify Module Boundaries 

[Spring Modulith](https://spring.io/projects/spring-modulith) adds another level of verification: the relationships between application modules.

By default, it discovers modules in the direct subpackages of the application class's package. FeedbackHub has business areas such as `users` and `messages`, alongside packages such as `config`, and `shared`.

The core verification test is small:

```java
class ModularityTests {
    private final ApplicationModules modules = ApplicationModules.of(Application.class);

    @Test
    void verifyModuleStructure() {
        modules.verify();
    }
}
```

`verify()` checks for cycles between modules and access to internal packages. It can also enforce explicitly allowed dependencies when modules declare them.

Java visibility alone cannot express all of this. A service may need to be public so that a controller in another package of the same module can call it. That doesn't mean every other module should be allowed to use it.

FeedbackHub makes selected model types available through a named interface:

```java
@NamedInterface("users-models")
package dev.sivalabs.feedbackhub.users.domain.models;

import org.springframework.modulith.NamedInterface;
```

It also explicitly opens the shared module:

```java
@ApplicationModule(type = ApplicationModule.Type.OPEN)
package dev.sivalabs.feedbackhub.shared;

import org.springframework.modulith.ApplicationModule;
```

These declarations document deliberate exposure. An **open** module allows access to its internal packages, so it deserves a conscious decision. Making every module **open** would remove much of the protection we wanted.

Together, module verification and the custom ArchUnit service rule help preserve the distinction between a module's implementation and its supported entry points.

## Test the Behavior the User Cares About

Formatting and architecture checks can all pass while a feature remains wrong. Business behavior needs its own evidence.

For example, deleting a message in FeedbackHub means changing its status and hiding its content from normal views while retaining the original database record. It also requires checking ownership.

This test from `DeleteMessageTests` verifies a meaningful failure case:

```java
@Test
void anotherUserCannotDeleteMessage() {
    var otherUserSession = session(login("siva@gmail.com", "secret"));

    assertThat(deleteMessage(otherUserSession, ADMIN_MESSAGE_ID))
            .hasStatus(HttpStatus.FORBIDDEN)
            .hasViewName("error/403");
    assertThat(statusOf(ADMIN_MESSAGE_ID)).isEqualTo("ACTIVE");
}
```

The response assertion checks that the request was rejected. The database assertion checks that rejection didn't leave behind an unauthorized state change. Both matter.

The test class also verifies that an owner can soft-delete a message, that its original content remains stored, that normal views hide the content, and that a deleted message cannot be deleted again.

These tests inherit the shared Spring Boot test setup in `BaseIT`. 
The application uses [Testcontainers](https://testcontainers.com/) for PostgreSQL:

```java
@Bean
@ServiceConnection
PostgreSQLContainer postgres() {
    return new PostgreSQLContainer(parse("postgres:18-alpine"));
}
```

This exercises the application against PostgreSQL rather than assuming an in-memory substitute behaves identically.

When asking an agent for tests, I want acceptance criteria translated into observable outcomes: authorization, validation, persistence, privacy, and failure behavior. The number of test methods is much less interesting.

## Code Analysis using JaCoCo and SonarQube

Consistent formatting makes a diff easier to read. It doesn't tell us whether a method contains a likely bug, whether code is duplicated, or whether a security-sensitive implementation deserves attention. JaCoCo tells us what the tests executed. We still need something that looks at the code itself.

[Checkstyle](https://checkstyle.sourceforge.io/), [SpotBugs](https://spotbugs.github.io/), and [PMD](https://pmd.github.io/) offer automated checks for coding conventions and potential defects. FeedbackHub uses [SonarQube](https://www.sonarsource.com/products/sonarqube/) because it combines several kinds of feedback in one place.

### What SonarQube Can Catch

SonarQube analyzes the source code against a rule set called a quality profile. Each finding is classified so that we can decide how urgent it is:

- **Bugs**: code that is likely wrong, such as a possible `NullPointerException`, a resource that is never closed, or a comparison that is always false.
- **Vulnerabilities and security hotspots**: SQL built by string concatenation, hard-coded credentials, weak cryptography, or disabled CSRF protection.
- **Code smells**: maintainability problems such as high cognitive complexity, long methods, duplicated blocks, unused fields, empty catch blocks, and `System.out` instead of a logger.
- **Coverage and duplication**: the JaCoCo report is imported, so SonarQube can also flag new code that has too little test coverage.

The Java rules also cover Spring-specific practices, for example field injection with `@Autowired`, and `@Transactional` on methods that Spring's proxies can't intercept. This complements ArchUnit and Taikai. They enforce the conventions we write for our application. SonarQube brings a large library of general Java rules we don't have to write ourselves.

A **quality gate** turns these findings into a pass or fail decision. The default gate looks at *new code* only: no new bugs, no new vulnerabilities, sufficient coverage on new code, and limited duplication. That is useful with AI-generated changes because it doesn't require us to fix years of legacy findings before we can get a clean signal on today's diff.

### Integrating SonarQube with the Application

The integration has three parts: a SonarQube server, a project configuration, and a scan step.

For local experiments, a Community Build server runs in Docker:

```shell
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
```

Open `http://localhost:9000`, log in, create a project, and generate a token. For a team, use a shared SonarQube server or SonarQube Cloud instead and keep the token in a secret store.

The scan reads the reports that the build already produces, so the project configuration only has to point at them:

```properties
# feedbackhub/sonar-project.properties
sonar.sources=src/main/java
sonar.tests=src/test/java
sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
sonar.junit.reportPaths=target/surefire-reports
```

Run the verification build first, so the JaCoCo and Surefire reports exist, then run the scan:

```shell
./mvnw clean verify

# Run from feedbackhub/ after the verification build.
mvn initialize sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token="$SONAR_TOKEN"
```

The CI workflow runs the same scan on the main branch after verification, with `SONAR_TOKEN` supplied through the environment.

Publishing analysis and enforcing a quality gate are separate concerns. The current workflow contains the scan step. It doesn't explicitly wait for the server's quality gate result. If a project requires the gate before merging, wire the result into the required CI checks as well. For example, by setting `sonar.qualitygate.wait=true` so that the scan fails when the gate fails.

### Let the Agent Fix Violations with the SonarQube MCP Server

Opening the SonarQube dashboard and copying issues into a prompt is the kind of manual step a harness should remove. The SonarQube MCP server lets the agent query SonarQube directly, so it can read the findings, understand the rule behind each one, and repair the code.

Register the server with the agent. For Claude Code, a configuration looks like this:

```shell
claude mcp add sonarqube \
  --env SONARQUBE_TOKEN="$SONAR_TOKEN" \
  --env SONARQUBE_URL=http://localhost:9000 \
  -- docker run -i --rm -e SONARQUBE_TOKEN -e SONARQUBE_URL mcp/sonarqube
```

For SonarQube Cloud, supply `SONARQUBE_ORG` instead of `SONARQUBE_URL`. The exact environment variables and available tools depend on the server version, so check the [SonarQube MCP Server documentation](https://github.com/SonarSource/sonarqube-mcp-server) for the one you install. Use a token with only the access the agent needs.

The server exposes tools to search issues in a project, read the details of a rule, check the quality gate status, and analyze code snippets. With those, the agent can follow a repeatable loop:

```text
Run verify and the Sonar scan
    -> fetch the open issues and the quality gate status
    -> read the rule behind each issue to understand why it matters
    -> fix the code and add or update tests where behavior is affected
    -> run spotless:apply and verify again
    -> re-scan and confirm the issues are gone
```

A task instruction for this can be short:

```text
Use the SonarQube MCP server to list the open issues for the feedbackhub project
on this branch, starting with bugs and vulnerabilities.
For each issue, read the rule description before changing code.
Fix the root cause, don't suppress the warning.
Run ./mvnw spotless:apply and ./mvnw verify,
then re-run the scan and report the quality gate status.
```

Some guardrails keep this safe:

- **Fix, don't silence.** Don't allow `@SuppressWarnings`, `// NOSONAR`, or marking issues as "won't fix" to make the gate pass. Treat those as policy changes that need a human decision.
- **Review the fixes.** Some rules are fixed mechanically, such as unused imports or a missing `final`. Others, like reducing cognitive complexity, change the structure of the code. The existing tests and architecture rules should catch regressions, and the final diff still needs a review.
- **Judge false positives.** Not every finding applies to our application. Let the agent explain why it thinks an issue is a false positive and leave the decision to you.
- **Check the scan results.** The agent should confirm the fix by running the analysis again, not by assuming the change worked.

For the agent, analysis findings are another source of actionable feedback. For the reviewer, they remove some repetitive inspection work. Neither replaces understanding the changed behavior.

## Put the Workflow into Agent Skills

Build checks tell the agent whether a change satisfies executable rules. Agent skills explain how to approach the work before those checks run.

FeedbackHub includes project-specific skills for turning a PRD into requirements, implementing a use case, synchronizing requirements with existing behavior, and reviewing Java changes.

The implementation skill uses one documented use case as the scope contract. Its workflow can be summarized as:

```text
Read the selected UC-### and its dependencies
Resolve significant ambiguity before editing
Change its status to IN_PROGRESS
Implement its acceptance criteria and focused tests
Run relevant verification and review the diff
Change its status to COMPLETED only after verification passes
```

That puts useful structure around the requirement-to-implementation loop. For a pending use case, an invocation looks like:

```text
Use $implement-usecase to implement UC-008 from docs/requirements.md.
```

## BootUI: Give the Agent Access to Runtime Evidence

Some problems only become clear when the application runs. [BootUI](https://www.julien-dubois.com/boot-ui/) provides a developer console for Spring Boot and Quarkus, with advisors for inspecting best-practice violations and MCP access to findings and runtime diagnostics.

FeedbackHub includes the BootUI starter:

```xml
<dependency>
    <groupId>com.julien-dubois.bootui</groupId>
    <artifactId>bootui-spring-boot-starter</artifactId>
    <version>${bootui.version}</version>
</dependency>
```

The application keeps both the console and its MCP support off by default:

```properties
bootui.enabled=${BOOTUI_ENABLED:off}
bootui.mcp.enabled=${BOOTUI_MCP_ENABLED:off}
```

For a local development session, those switches can be enabled when starting the application:

```shell
BOOTUI_ENABLED=on BOOTUI_MCP_ENABLED=on \
  ./mvnw spring-boot:run
```

Now, configure the BootUI MCP server for your AI Agent:

```json
{
  "mcpServers": {
    "bootui": {
      "type": "http",
      "url": "http://localhost:8080/bootui/api/mcp"
    }
  }
}
```
With the corresponding MCP connection configured, the agent can use runtime findings as evidence for investigation.

{{< youtube 9V5IeBmGI14 >}}

With BootUI MMCP configured, you can ask AI Agent to fetch advisor findings and fix them.

The same feedback principle applies to the SonarQube MCP setup. A developer can ask the agent to inspect open issues and repair relevant findings. This extends the harness beyond the compiler's view of the code while keeping automated build checks as a separate enforcement layer.

## Run Architecture Verification Tests Early

A harness is easier to use when the developer, the agent, and CI share the same verification commands.

To prioritize architecture checks, configure JUnit's test class orderer in `src/test/resources/junit-platform.properties`:

```properties
junit.jupiter.testclass.order.default=org.junit.jupiter.api.ClassOrderer$OrderAnnotation
```

This makes JUnit honor class-level `@Order` annotations. FeedbackHub assigns the following priorities to its architecture tests; the class bodies are omitted here:

```java
import org.junit.jupiter.api.Order;

@Order(1)
class ArchUnitTests {
    // Project-specific architecture rules
}

@Order(2)
class TaikaiTests {
    // Java, Spring, and JPA conventions
}

@Order(3)
class ModularityTests {
    // Module boundary verification and documentation
}
```

Lower values run first. Classes without `@Order` use JUnit's default priority, which places them after these explicitly ordered classes. `ArchUnitTests` and `TaikaiTests` share a priority, so their relative order is not specified by these annotations.

Within a single sequential JUnit execution, this puts architecture checks ahead of the broader behavioral suite. It gives the agent earlier feedback when a change breaks structural rules. Class ordering doesn't coordinate separate test executions or guarantee completion order when parallel execution is enabled, and it doesn't stop the suite after a failure. Keep tests independent; the ordering is there to improve feedback speed.

Now when maven run verification checks using `./mvnw verify`, the agent receives feedback on architecture violations before the broader behavioral suite runs.

The feedback should be specific enough that the agent can act on it:

```text
Formatting violation -> apply the formatter
Architecture violation -> repair the dependency or visibility
Behavioral test failure -> inspect the failed expectation
Coverage gate failure -> identify meaningful untested behavior
Analysis finding -> assess and fix the relevant issue
```

One expectation I would put directly in `AGENTS.md` development workflow instructions: 

```
DON'T LOWER THRESHOLDS, DISABLE TESTS, OR WEAKEN ARCHITECTURE RULES MERELY TO MAKE A CHANGE PASS.
```

Changes to the quality policy deserve their own explanation and review.

## Start with the Rules You Keep Repeating

I would build this incrementally. First, automate formatting and establish a reliable verification command. Then add architecture rules for the boundaries that matter most, behavioral tests for risky workflows, and coverage checks that expose missing evidence. Add analysis and runtime tools where they answer recurring questions.

A practical task instruction for this project could be:

```text
Implement the selected use case using the existing module structure.
Add tests for its success, authorization, and failure behavior.
Run ./mvnw spotless:apply.
Run ./mvnw verify.
Fix relevant failures without weakening the checks.
Review the final diff and report any verification that could not run.
```

I still need to review whether a requirement is right, an API is well designed, a migration is safe, or an edge case is missing. Those decisions benefit from the time recovered by automating routine checks.

The payoff I want from AI is faster delivery of changes I can trust. Every important convention I turn into an executable check makes that goal easier to sustain as the application grows.

