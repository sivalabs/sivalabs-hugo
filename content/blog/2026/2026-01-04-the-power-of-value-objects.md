---
title: "The Power of Value Objects"
author: Siva
images: ["/images/power-of-value-objects.webp"]
type: post
draft: false
date: 2026-01-04T04:59:17+05:30
url: /blog/the-power-of-value-objects
toc: true
categories: [SpringBoot]
tags: [Java, SpringBoot, DDD]
---

A **Value Object** is a domain concept defined by its values rather than by identity.
For example, we can represent **EventId**, **EventCode** or **Email** as a value object.
In this article, let's explore the benefits of using value objects over primitive types.

<!--more-->

## Value Objects
In Java, typically, we can use records to create value objects.

```java
public record EventId(Long id) {
    public EventId {
        if (id == null || id < 0) {
            throw new IllegalArgumentException("Event id cannot be null");
        }
    }

    public static EventId of(Long id) {
        return new EventId(id);
    }
}
```

Now we can create an **EventId** object using **EventId.of(1L)** method.

Now the question is, **why do we need to create a value object?
Why can't we simply use primitive types?**

Let's explore the benefits of using value objects.

## Benefits of using Value Objects
By using value objects, we are defining domain concepts as a first-class citizen.
But in practice, let's see how using value objects improves/simplifies our code.

### No need for defensive programming
Typically, in a web application or REST API, we receive input data from the client.
And, we validate the input data and pass it to the business logic layer.

But sometimes, we might forget to validate the input data or the same method is being called from multiple places.
So, to be safe, developers keep adding validation checks all over the place.

```java
@RestController
class EventController {
    @GetMapping("/api/events/{id}")
    public void getEvent(@PathVariable Long id) {
        if(id == null || id < 0) {
            throw new IllegalArgumentException("Invalid event id: " + id);
        }
        var event = eventService.getEvent(id);
        // ...
    }
}

@RestController
class RegistrationController {
    @GetMapping("/api/events/{id}/registrations")
    public void getEvent(@PathVariable Long eventId) {
        //not validating eventId
        var event = eventService.getEvent(id);
        // ...
    }
}

@Service
class EventService {
    public Event getEvent(Long id) {
        if(id == null || id < 0) {
            throw new IllegalArgumentException("Invalid event id: " + id);
        }
        // ...
    }
}
```

As you can see in the above example, if the method is called from multiple places,
just to be safe, developers keep adding validation checks.

But if we use value objects, the validation logic is centralized in the value object.
**If the value object is constructed successfully, that means it has valid data.**

```java
@RestController
class EventController {
    @GetMapping("/api/events/{id}")
    public void getEvent(@PathVariable Long id) {
        var event = eventService.getEvent(EventId.of(id));
        // ...
    }
}

@RestController
class RegistrationController {
    @GetMapping("/api/events/{id}/registrations")
    public void getEvent(@PathVariable Long eventId) {
        //not validating eventId
        var event = eventService.getEvent(EventId.of(id));
        // ...
    }
}

@Service
class EventService {
    public Event getEvent(EventId id) {
        //no need to validate id
        // ...
    }
}
```

The input validation logic is centralized in the value object.
So, we don't need to validate the input data in the controller or service layer.
The input validation happens in the controller while constructing the value object.
If the input is invalid, then it will throw an exception, and we could have a Global ExceptionHandler to handle it.

{{< box tip >}}
**What if someone passes `null` as `EventId` itself?**

This is where [jSpecify can help you](https://www.youtube.com/watch?v=p3v8wJG3-zo).
{{< /box >}}

### No more accidentally passing invalid data
Imagine we have a method as follows:

```java
public void register(Long eventId, Long userId) {
    //...
}
```

While calling this method, we might accidentally call **register(request.getUserId(), request.getEventId())**.
As the method accepts any **Long** value, it might be possible to call the method with wrong inputs.
But if we use value objects (i.e **UserId** and **EventId**), then we can't accidentally pass invalid data.

```java
public void register(EventId eventId, UserId userId) {
    //...
}
```

Assume **request.getUserId()** returns **UserId** and **request.getEventId()** returns **EventId** type values.
Calling the method as **register(request.getUserId(), request.getEventId())** will be a compiler error.

So, by using Value Objects, you can prevent accidentally passing invalid data.

### Using Value Objects with JPA
You can use Value Objects with JPA as **Embeddable** objects.

```java
//Omitting validation logic for brevity
record EventId(Long id) {}
record Address(String street, String city, String state){}

@Entity
@Table(name = "events")
class Event {
    @EmbeddedId
    @AttributeOverride(name = "id", column = @Column(name = "id", nullable = false))
    private EventId id;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "street", column = @Column(name = "street", nullable = false)),
            @AttributeOverride(name = "city", column = @Column(name = "city")),
            @AttributeOverride(name = "state", column = @Column(name = "state"))
    })
    private Address address;

}
```

You can create a Spring Data JPA repository for `Event` as follows:

```java
interface EventRepository extends JpaRepository<Event, EventId> { //EventId as primary key instead of Long
}
```

Now we can use `EventRepository` as follows:

```java
@Service
class EventService {
    private final EventRepository eventRepository;
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    public Event getEvent(EventId id) {
        return eventRepository.findById(id).orElseThrow(); //using EventId instead of Long
    }

}
```

### Automatic Binding of PathVariable/RequestParam to Value Objects
If you are using Spring MVC, we can create **Converters** to bind input values to Value Objects.

```java
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToEventIdConverter implements Converter<String, EventId> {

    @Override
    public EventId convert(String source) {
        return new EventId(Long.parseLong(source));
    }
}
```

This allows Spring MVC to automatically convert path variables or request parameters like **/{eventId}** from String to **EventId**:

```java
@GetMapping("/{eventId}")
ResponseEntity<Event> findEvent(@PathVariable EventId eventId) {
    // eventId is already an EventId object
}
```

### Binding primitives to Request Bodies with Value Objects
By default, if you marshall an Event object with EventId property to JSON using Jackson, it will produce the following JSON:

```json
{
  "id": {
    "id": 123
  }
}
```

We can use the **@JsonValue** annotation to serialize the value instead of object strcuture.
Similarly, we can use **@JsonCreator** annotation to specify which constructor or factory method to use while deserializing the JSON into an object.

**EventCode Value Object:**

```java
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.NotBlank;

public record EventCode(
        @JsonValue 
        @NotBlank(message = "Event code cannot be null or empty")
        String code
) {
    @JsonCreator
    public EventCode {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Event code cannot be null");
        }
    }

    public static EventCode of(String code) {
        return new EventCode(code);
    }
}
```

**CreateEventRequest Request Payload:**

```java
record CreateEventRequest(
        @Valid EventCode code
        // ... other properties
) {
}
```

Now Spring MVC will automatically bind the **code** property from the JSON payload to **EventCode** object.

```json
{
  "code": "ABSHDJFSD",
  "property-1": "value-1",
  "property-n": "value-n"
}
```

### Binding flattened JSON to Nested Objects
We may want to bind flattened JSON to nested objects.
In those scenarios, we can use **@JsonUnwrapped** and **@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)** annotations 
to map flattened JSON to nested objects.

```java
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EventDetails(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 10000, message = "Description cannot exceed 10000 characters")
        String description,

        @Size(max = 500, message = "Image URL cannot exceed 500 characters")
        @Pattern(regexp = "^https?://.*", message = "Image URL must be a valid HTTP/HTTPS URL")
        String imageUrl) {

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public EventDetails(
            @JsonProperty("title") String title,
            @JsonProperty("description") String description,
            @JsonProperty("imageUrl") String imageUrl
    ) {
        this.title = AssertUtil.requireNotNull(title, "title cannot be null");
        this.description = AssertUtil.requireNotNull(description, "description cannot be null");
        this.imageUrl = imageUrl;
    }

    public static EventDetails of(String title, String description, String imageUrl) {
        return new EventDetails(title, description, imageUrl);
    }
}
```

**CreateEventRequest Request Payload:**

```java
record CreateEventRequest(
        @Valid EventCode code,
        @JsonUnwrapped @Valid EventDetails details
        // ... other properties
) {
}
```

Now Spring MVC will automatically bind the **title**, **description** and **imageUrl** property values
from the JSON payload to **EventDetails** object.

```json
{
  "code": "ABSHDJFSD",
  "title": "Spring Boot Workshop",
  "description": "Learn Spring Boot best practices",
  "imageUrl": "https://example.com/image.jpg",
  "property-1": "value-1",
  "property-n": "value-n"
}
```

## Conclusion
In this article, we explored the benefits of using value objects over primitive types.
We saw how using value objects improves our code by centralizing domain concepts.
We also saw how we can streamline using value objects from Spring controllers to JPA repositories.
