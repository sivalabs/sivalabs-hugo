---
title: "Why I think Go is more verbose than Java"
author: Siva
images: ["/preview-images/go-vs-java.webp"]
type: post
draft: false
date: 2023-01-05T04:59:17+05:30
url: /why-go-is-more-verbose-than-java
categories: [Tech]
tags: [Go, Java]
---
Few months ago I asked on Twitter "why you think Java is complex?" to understand others perspective.

{{< tweet user="sivalabs" id="1509905489911762950" >}}

And, I got many responses(opinions, insights) 
and I compiled all the responses into this blog post [My attempt to understand why people perceive Java as complex](https://www.sivalabs.in/my-attempt-to-understand-why-people-perceive-java-as-complex/).
The intention is purely to understand the other's perspective, not to prove "Java is not verbose".

Back then (April 2022) somebody posted this article on Reddit and the usual thing happened on Reddit.
And, then couple of days back also somebody [posted it on Reddit](https://www.reddit.com/r/java/comments/102cfti/my_attempt_to_understand_why_people_perceive_java/) again, and it is making rounds again one more time.

I am always surprised when someone says Java is more verbose than Go.
If someone compares Java with Python, Ruby, JavaScript/TypeScript and say Java is verbose, yes totally.
Java is way more verbose than Python, Ruby, JavaScript/TypeScript. But I don't think Java is more verbose than Go.

So, I tweeted this :-)

{{< tweet user="sivalabs" id="1610446679970545664" >}}

Of course some would disagree, not at all unexpected.

But to understand where I am coming from, we need to take a step back and understand my point of view.

* I am not comparing which is better or feature rich at the overall language level. I am only talking about verbosity of language syntax because that is what many people are complaining about Java.
* I have started working with Go a couple of years back. My first impressions are:
  * It is a fresh breath of air. No annotations magic, no 10 levels of abstractions. :white_check_mark:
  * Go performance is top-notch. :white_check_mark:
  * Most of the common needs like Json parsers, testing, formatting tools etc are baked into standard library itself. :white_check_mark:
  * Not many types of collections support, no generics...bummer. :thumbsdown:
  * And, I didn't like Go way of error handling at all. Yes, I read "Errors are first class values" and still I don't like it. :rage:

But Go's simplicity stuck with me. The usual Go way is not to over-engineer code with unnecessary abstractions.
In fact my small stint with Go changed the way I think. 
I stopped writing code thinking "okay, I will add this abstraction here so that in future if we need....", instead I start coding for today's known requirements.

And, I kept thinking despite lacking many features that you find in most of the modern languages such as generics, rich collections support etc how Go became so popular and widely adopted??
I kinda understand why people like Go (or I think so) and I wrote a blog post with my thoughts [Code simplicity by Abstraction vs Verbosity](https://www.sivalabs.in/code-simplicity-by-abstraction-vs-verbosity/)

**By now it should be clear that I don't have anything against Go and in fact I like many things about Go.
Having said that I still feel Go is more verbose than Java mainly because of error handling.**

Whether I like it or not Go error handling is what it is, and I am not the only one [who doesn't like Go's error handling](https://github.com/ksimka/go-is-not-good).

There is no point in debating over opinions because everyone is right in their point of view.
So, I just shared two code snippets of how typical transaction handling is done in Java and Go.

Let us take a look at the usual way of transaction handling in Go and Java.

### Transaction handling in Go

```go
func (c CustomerService) createCustomer(customer Customer) error {
    // Get a Tx for making transaction requests.
    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    // Defer a rollback in case anything fails.
    defer tx.Rollback()
    
    err := customerRepository.save(tx, customer)
    if err != nil {
        return err
    }
    err = addressRepository.saveCustomerAddress(tx, customer.Address)
    if err != nil {
        return err
    }
    // Commit the transaction.
    if err = tx.Commit(); err != nil {
        return err
    }
    return nil
}
```

### Transaction handling in Java(SpringBoot and JdbcTemplate)

```java
@Transactional
void createCustomer(Customer customer) {
    customerRepository.save(customer);
    addressRepository.saveCustomerAddress(customer.Address);
}
```

Transaction handling works just fine in both Go and Java cases. 
SpringBoot takes care starting the transaction and commit/rollback depending on any errors occurred.
I know Java is not SpringBoot, but the code would be same even with other frameworks like Quarkus and Micronaut too.
And, Go code will be same/similar even if I use any framework also because of the Go way of error handling.

Let's take another typical Go code reading from database:

```go
func (b postRepo) GetPosts() ([]Post, error) {
	var posts []Post
	query := "select id, title, content, created_time FROM posts"
	rows, err := b.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post = Post{}
		err = rows.Scan(&post.Id, &post.Title, &post.Content, &post.CreatedTime)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return posts, nil
}
```

To my eyes this is super verbose mainly because of error handling.

If Go has error handling like any other programming language giving an option to developer where they want to handle error, 
the same code could have been as follows:

```go
func (b postRepo) GetPosts() ([]Post) {
	var posts []Post
	query := "select id, title, content, created_time FROM posts"
	rows := b.db.Query(query)
	for rows.Next() {
		var post = Post{}
		rows.Scan(&post.Id, &post.Title, &post.Content, &post.CreatedTime)
		posts = append(posts, post)
	}
	return posts
}
```
Sometimes exactly which statement throws error doesn't matter, and it can be treated as an overall failure and I want handle it in same way.
In the above method, it doesn't matter which lines throws error I want to log the error and return empty slice.
If I want to handle a special case like DB lock errors etc then I would specifically catch those errors and act accordingly(maybe do a retry).
But because of the current way of Go's error handling mechanism, there is no way but to add errors checks all over the place.

### 1. Is it unfair comparison? 
Some people feel it is unfair comparison and said I should also include Spring's Transaction handling code to compare.
I respectfully disagree with that.

As an application developer we use programming language and many frameworks/libraries to achieve our goals.
If the chosen framework works as expected with good enough performance, all I care about is the code "I need to write" for my application.
I don't have to dig into Spring's internal transaction handling logic or Gin's internal routing logic.
The comparison should be between the code we need to write.

### 2. How about other aspects?
My comparison was only about "verbosity". When it comes to other aspects I like Go a lot.
* Building a native binary with Go is a breeze. While GraalVM is an option in Java world, it is nowhere as good as Go's support IMO.
* When it comes to build and runtime performance, I find Go applications are much faster with less memory footprint.

> Fun fact: 
> 
> I was [building an application](https://github.com/orgs/sivalabs-bookstore/repositories) with around 7 services using SpringBoot and when I try to run them in Docker I couldn't because of memory/CPU consumption is too high.
> I replaced some services with Go implementation, and they run smoothly with very less memory consumption.

I am not saying Go is more verbose than Java based on my gut feeling or my bias towards Java.
I am simply showing code samples to convey why I feel Go is more verbose than Java.
If you think its incorrect assumption and show some code samples then I am glad to learn and improve my understanding.

# Conclusion
So, it all comes down to tradeoffs. No language is perfect in every aspect, and we have to choose the tech stack which ticks most checkboxes for our specific needs.
Just parroting "Language X is dead or Language Y is verbose" just because you read these memes/jokes on internet doesn't bring any value.
Try it and see for yourself whether those languages/frameworks are as good/bad as they say and make an informed opinion.
