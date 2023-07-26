---
title: GoLang from a Java developer perspective
author: Siva
images: ["/preview-images/golang.webp"]
type: post
date: 2020-07-02T04:59:17+05:30
url: /golang-from-a-java-developer-perspective/
categories:
  - GoLang
tags: [GoLang, Java]
---

Gone are the days we can call ourselves as Java developer, .NET developer, Python developer etc.
Nowadays we might need to work with multiple languages to some extent such as Python for scripting, Go for CLI utilities etc.

Out of personal interest I started learning [Go Language](https://golang.org/) 3 months ago and I am using Go for our current application. In this article I would like to share my first impression on Go language.

## 1. Happy Beginning

Few years ago I thought of switching from WordPress to a static generator for my blog and tried [Jekyll](https://jekyllrb.com/) and [Hugo](https://gohugo.io/).
Hugo is really blazing fast and I learned that Hugo is built using GoLang. So, I already have a good opinion on Go.

Also, I keep hearing lot of good things about Go and in the recent years many developers prefer Go over Java for MicroServices development. Although that hype seems to be settled down lately.

### Go is a simple language

Go is a very simple language to learn. Go doesn't include too many features, so it is easy to learn compared to other languages. I would say in a week you can be comfortably program in Go. You can learn about Go **datatypes, control structures, collections, functions, error handling** in a couple of days and get familiar with **go modules, structs, interfaces, pointers** and **Go routines/channels** in another 4 or 5 days.

I find the following resources very helpful to get started with Go:

- https://golangbot.com/learn-golang-series/
- https://gobyexample.com/
- https://www.callicoder.com/categories/golang/
- https://quii.gitbook.io/learn-go-with-tests/

### Batteries included

In a typical application development we do things like **reading/writing files**, **parsing JSON data**, **work with databases**, **create HTTP REST APIs** etc. Go language has built-in support for all of these. In addition to this, Go also includes support for unit testing, HTTP testing in the standard library itself.

### Out of the box tooling

Go provides nice tooling support for code formatting, test code coverage checks, benchmarking etc.

- [Go Tooling in Action](https://www.youtube.com/watch?v=uBjoTxosSys)
- [gofmt](https://golang.org/cmd/gofmt/)
- [Go Test Coverage](https://blog.golang.org/cover)
- [Go Test Benchmarks](https://golang.org/pkg/testing/#hdr-Benchmarks)

## 2. WTF Moments

Nowadays we have many wonderful programming languages like Java, Kotlin, Python, JavaScript, Go, Rust to name a few. If I have to select a programming language for a real application(not pet projects) I would at least expect some features that are available in most of the programming languages. So, I expected some of the commonly used features in Go and I am very surprised to know that Go doesn't have them.

### Very very limited collections

- Storing a collection of unique values is such a very common requirement and most of the languages provides **Set** collection to support that. Go doesn't have any built-in support for **Set** type collection. As there is no **Set** datatype in Go, we mostly ended up using map to store the values as keys.

- Getting all the keys or values from a map is also a very common use-case. Go doesn't have any **map.keys()** or **map.values()** to support that. You have to iterate the map and collect the keys/values in a slice.

- Slices are similar to Lists, but not exactly Lists. If you think you can check whether a slice has an element by **mySlice.contains(value)**, think again. There is no **.contains()** method on slice, you have to loop over slice elements and check.

- The **map** datatype by definition stores key-value pairs, so you might think at least **map** might have **.containsKey()** method. Sorry. To check if a key exists in map you have to write the following code:

```go
if val, ok := mymap["foo"]; ok {
    //do something here
}
```

{{< figure src="/images/why-cat.webp" alt="But, Why?"  width="350" height="300" >}}

### Error handling

There is no concept of Exceptions in Go unlike in Java or Ruby etc. In Go, a function can return multiple values. A common pattern is to return a pair of (result, error) from a function.

The following code demonstrate how errors are handled in idiomatic Go.

```go
func doSomething(n int) (int, error) {
  if n == -1 {
    return 0, errors.New("Are you crazy?!!")
  }
  return n * n, nil
}

func iWishIGetPaidByLinesOfCode() {
  square, err := doSomething(3)
  if err != nil {
    log.Error("You think each function returning a value and error is cool. "+ err.Error())
  }
  //do something useful with square
}
```

Ok, instead of throwing Exceptions and handling them in Catch blocks we are returning the errors as first class values. After all the code doesn't look that bad, isn't.

Let's take a little more complex example of reading a file line by line and insert the data into database.

```go
db, err := getDbConnection()
if err != nil {
  log.Fatal(err)
  return
}
defer db.Close()
data, err := ioutil.ReadFile("test.txt")
if err != nil {
    fmt.Println("File reading error", err)
    return
}
for _, line := range data.lines() { //just assume there is .lines() which returns slice of strings
  stmt, err := db.Prepare("INSERT INTO users(name) VALUES(?)")
  if err != nil {
    log.Error(err)
    return
  }
  res, err := stmt.Exec(line)
  if err != nil {
    log.Error(err)
    return
  }
  lastId, err := res.LastInsertId()
  if err != nil {
    log.Error(err)
    return
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    log.Error(err)
    return
  }
  log.Printf("ID = %d, affected = %d\n", lastId, rowCnt)
}
```

When I take a glance at this code all I see is error checks with the actual business logic stuffed somewhere in between.

Yes, you can argue that handling errors are part of actual workflow. But there must be a better way of dealing with the errors.

I believe the language should give the developer a provision to define the scope of successful or failure of an operation and let the developer handle each error individually or as a whole as they seems fit.

In the above example, suppose if I don't care whether the whole method failed due to reading file, talking to database or while getting LastInsertId I consider it as a failure and just log the error and return. Then I want to implement the same functionality as follows:

```go
func loadUsers() {
  try {
    db := getDbConnection()
    defer db.Close()
    data := ioutil.ReadFile("test.txt")
    for _, line := range data.lines() {
      stmt := db.Prepare("INSERT INTO users(name) VALUES(?)")
      res := stmt.Exec(line)
      lastId := res.LastInsertId()
      rowCnt := res.RowsAffected()
      log.Printf("ID = %d, affected = %d\n", lastId, rowCnt)
    }
  } catch(err) {
    log.Error("Something terrible happened. Error: "+err.Error())
    return err
  }
}
```

If I want to handle DB connection errors differently I would handled them as follows:

```go
func loadUsers() {
  var db *sql.DB

  try {
    db = getDbConnection()
    defer db.Close()
    }
  } catch(err) {
    log.Error("DB connection Error: "+err.Error())
    return err
  }

  try {
    data := ioutil.ReadFile("test.txt")
    for _, line := range data.lines() {
      stmt := db.Prepare("INSERT INTO users(name) VALUES(?)")
      res := stmt.Exec(line)
      lastId := res.LastInsertId()
      rowCnt := res.RowsAffected()
      log.Printf("ID = %d, affected = %d\n", lastId, rowCnt)
    }
  } catch(err) {
    log.Error("Something terrible happened. Error: "+err.Error())
    return err
  }
}
```

In Go most of the standard library functions return a value and error and while writing idiomatic Go code your code is full of error checks. That might look perfectly fine for many, but for my personal taste that's terrible.

### Funky Date Formatting

Kidnap a software developer and put a gun to his/her head and tell them to format a date object to print **year-month-day** in only one try.

{{< figure src="/images/go-date-format.webp" alt="Go Date Formatting" >}}

I believe most of the developers will bet their life to **dateObject.format("yyyy-mm-dd")**. This notation is so common in many programming languages. But in Go, we need format date object (time.Time) using **dateObject.Format("2006-01-02")**.

In Go we need to use the magical date **Mon Jan 2 15:04:05 MST 2006** for [formatting/parsing dates](https://programming.guide/go/format-parse-string-time-date-example.html).

### Go feels low-level and verbose

As of now Go doesn't have support for **Generics** or **Streams**. Lack of support for Generics and Streams combined with lack of decent collection types and operations result in writing lot of boilerplate code. Add error handling into this mix and voila...

I really wish I get paid by number of lines of code while working on Go projects :-)

{{< figure src="/images/money-tears.gif"  width="350" height="300" >}}

## 3. Retrospection and Realization

After going through all these WTF moments, I started thinking how come Go is so popular!!?? A programming language simply doesn't become that popular without having some good reasons (of course the hipster developers want to work on something new for every six months...that's a different story). There must be something really good about Go which makes it so popular. So, I started thinking what I am missing??!!!.

Sometimes people use programming languages/tools for totally different purposes than what their creators originally created for.
So, I thought of hearing from the Go Lang creators and I found this wonderful talk by Rob Pike.

{{< youtube rFejpH_tAHM >}}

After watching the talk I kind of got answers to some of my questions.

### Go is designed to be simple

It seems Go is not created to compete with any existing popular languages. So, they(Go creators) are not in the race of providing all the features of popular languages plus some more. They want to create a simple programming language with minimal features. Sometimes the simplicity may result in verbosity.

For example, lets take a look at the following Java/Spring code.

```java
@Transactional
public void creteUser(User user) {
  this.validateUser(user);
  this.userRepository.save(user);
  this.addressRepository.save(user.getAddress());
}
```

This method looks simple, isn't it. But to fully understand this method's runtime behaviour one needs to know Spring's magic.
First, the **@Transactional** annotation start a DB transaction if it is not already a part of an existing transaction. Then, if the method completes normally the DB transaction gets committed automatically, of if there is any **RuntimeException** occurs DB transaction gets rolled back automatically. Any of these details are not visible in the code.

Lets look at Go version of the same method.

```go
function createUser(user User) {
  db, err := getConnection()
  if err != nil {
    log.Fatal(err)
  }

  ctx := context.Background()
  tx, err := db.BeginTx(ctx, nil)
  if err != nil {
    log.Fatal(err)
  }

  _, err = tx.ExecContext(ctx, "INSERT INTO users (name, gender) VALUES (...)")
  if err != nil {
    tx.Rollback()
    return
  }

  _, err = tx.ExecContext(ctx, "INSERT INTO addresses (street, city) VALUES (...)")
  if err != nil {
    tx.Rollback()
    return
  }

  err = tx.Commit()
  if err != nil {
    log.Fatal(err)
  }
}
```

Anyone with little bit of programming background can understand (at least conceptually) what is going on in here.
Yes, it is verbose, but clear. No background magic going on here. Sometimes a bit of verbosity is better than smart and clever code.

### Go is designed to solve specific problems

I believe usually programming languages are created by its creator to solve a specific type of problems that they are facing. I don't think Rob Pike or other Go creators were writing any e-commerce web applications, or fancy REST API and they created Go to solve those web app development challenges. To my guess they might have been working on building low-latency, high-performance servers, low level protocol implementations etc using C++ or some other low level programming languages and they were not happy with C++. At least that's what I understood from their talks.

So, comparing Go with Java or Ruby might be apples to oranges comparison. If I want to build a web application may be I am more productive with SpringBoot or Ruby On Rails than Go.

When I try to learn a new language I looks for sample applications on Github to learn how people usually do something in that language. When I search for Go sample projects, most of the projects are like **Docker, Kubernetes, CLI clients** etc and I hardly find any typical web applications. That doesn't mean you can't use Go for web apps or REST API, but it may not be right tool for those type of applications especially if productivity is a key factor.

## 4. Summary

While learning a new language we might unknowingly compare with our favourite programming language and keep comparing whether the new language is having all the features of our current favourite language. If we keep comparing everything then it is hard to see the beauty of the new language. We should explore the new language and learn its strengths and weaknesses.

While learning Go, I keep comparing it with Java, SpringBoot combo which is the best tech stack in my opinion. I shouldn't have compared Go with Java + SpringBoot.

Also, we shouldn't hang on to little things like **Funky Date Formatting** :-) How hard it is to remember **01 is for month, 02 is for day, 03 is for hour** etc. May be it is better than **"yyyy-mm-dd"** format. How many times we get confuse about does **MM** represents Month or Minutes??!! With Go's notation there is no such confusion.

Java has vast collection library, generics, streams, huge ecosystem of frameworks and libraries. While using Java + SpringBoot I can simply add a bunch of starter which mostly take care of boilerplate code and start working on business logic.

I really get surprised when people keep saying Java is old, java is verbose, Java is all about creating Factories, Builders etc etc. Yes, the frameworks(Spring) might have Factories, Builders etc but I don't even remember when was the last time I had to create Factory in my business application. If anyone think Java is same as it was in EJB 1.x days then please do yourself a favour and take another look at Java.

To summarize, I like Go, but it's not in my top 3 favourites. I choose Java over Go for most of the applications. But if I ever want to create a CLI application then I don't even think for a second, I will just use Go with [Cobra](https://github.com/spf13/cobra).
