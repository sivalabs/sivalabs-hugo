---
title: "Go for Java/SpringBoot Developers"
author: Siva
images: ["/preview-images/go-for-spring-boot-devs-1.webp"]
type: post
draft: false
toc: true
date: 2023-11-20T04:59:17+05:30
url: /go-for-java-springboot-developers
categories: [GoLang]
tags: [GoLang]
description: In this article, I will share my experience of building a REST API using Go language coming from a Java/Spring Boot developer background.
---
In this article, I will share my experience of building a REST API using Go language coming from a Java/Spring Boot developer background.

Whenever I try to learn a new framework or a language, I try to map the concepts of the new framework/language 
to the one I am already familiar with. This helps me to understand the new framework/language ecosystem faster. 
But this sometimes also becomes a bottleneck to adapt to the new framework/language idioms quickly.

I have been using Java for more than 17 years, and I am a big fan of it.
Within the Java ecosystem, Spring Boot is my go-to framework for building applications.

I worked with Go language on an official project a couple of years ago, and initially I had mixed feelings about it.
But the more I use it, the more I started liking it.

{{< box info >}}
**IMPORTANT**

Before getting into the actual topic, let me make one thing very clear:

**I am not trying to say one is better than the other. 
I am just sharing my experience of learning Go coming from a Java/Spring Boot background.**
{{< /box >}}

## Java/SpringBoot vs Go comparison
Each language and framework has its own pros and cons, and it's up to us to choose the right tool for the job.
There is no silver bullet, and there is no one size fits all solutions.

Sometimes performance is the most important factor, and sometimes developer productivity is the most important factor.
We need to evaluate the pros and cons of each technology and choose the right one for the problem at hand.

IMO, Java/SpringBoot and Go took very different approaches to improve the developer productivity. 
I already discussed some of them in detail in my previous article [Code simplicity by Abstraction vs Verbosity](https://www.sivalabs.in/code-simplicity-by-abstraction-vs-verbosity/).

If I have to compare Java/SpringBoot and Go, I would say like this:

**Java/SpringBoot:**

* Java has a very matured ecosystem with a lot of libraries and tools available.
* SpringBoot is a very opinionated framework, and it offers a lot of features out of the box.
* Spring Boot greatly improves developer productivity by providing many commonly needed features out of the box. 
* Spring Boot has a steep learning curve, and it takes a lot of time to master it.
* Spring Boot consumes more resources (CPU, Memory) compared to Go.
  With GraalVM native image support, this is changing rapidly. 
  However, there are many libraries that are not compatible with GraalVM native image yet and native compilation is currently taking a lot of time.

**Go:**

* Go is a very simple language with a small set of features.
* Go is a very opinionated language, and it forces you to do things in a certain way like formatting, unused variables, etc.
* Go has a rich standard library and toolchain (formatting, testing, benchmarking, cross-platform compilation, etc) support.
* Go is verbose, and it takes more lines of code to achieve the same thing compared to Java. IMO, this is mainly due to error handling approach in Go.
* Go consumes fewer resources (CPU, Memory) compared to Java/SpringBoot.
* In my opinion, the biggest advantage for Go is its simplicity. While the Go code looks more verbose, it's very easy to understand and maintain.

Go community prefers using only the necessary libraries and integrating them instead of using an all-in-one framework like **Spring Boot** or **Django**.

**Personally, I felt Go is more verbose and requires writing more lines of code compared to Java/SpringBoot.
But it also results in a less cognitive load while working with Go code.**

OTOH, once you understand the magic behind Spring Boot, it is super productive to build applications.
Spring Boot already solved a lot of common application needs like **configuration management**, **logging**, **minoring**, etc.
You can also find Spring Boot integrations with almost everything under the sun, which greatly helps to build applications quickly.

As I mentioned earlier, I am not trying to convince you one is better than the other.
If you are planning to build an application in Go coming from a Java/Spring Boot background, I hope this article might help you.

I am not going to teach Go language basics of how to declare variables, functions, etc.
There are many good resources available to learn the Go language basics.

* [GOLANGBOT Golang tutorial series](https://golangbot.com/learn-golang-series/)
* [CALLICODER Go Tutorials](https://www.callicoder.com/categories/golang/)
* [Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests/)
* [Go by Example](https://gobyexample.com/)

## What are we going to build?
Go doesn't have a Spring Boot like framework. Usually, Go developers prefer to use the necessary libraries to build applications.
We are going to follow the same in this tutorial.

We are going to build a REST API in Go using the following libraries:

* [Gin Web Framework](https://gin-gonic.com/) - Web framework
* [Viper](https://github.com/spf13/viper) - Configuration library
* [zap](https://github.com/uber-go/zap) - Logging library
* [pgx](https://github.com/jackc/pgx) - PostgreSQL driver and toolkit for Go
* [golang-migrate](https://github.com/golang-migrate/migrate) - Database Migrations

Let's get started.

## Install Go and Tools
You can download and install Go from https://go.dev/doc/install.
Once installed, add the Go bin directory to your **PATH** environment variable.

```shell
export GOPATH=$HOME/go
export PATH="$PATH:$GOPATH/bin"
```

You can use **VS Code**, **IntelliJ IDEA Ultimate with Go Plugin**, **GoLand**, or any other IDE of your choice for Go development.

## Project Setup
We are going to build a REST API for a simple bookmarking application exposing the CRUD endpoints.

Let's create a new project directory and initialize a Go module.

```shell
$ mkdir bookmarks
$ cd bookmarks
$ go mod init github.com/sivaprasadreddy/bookmarks
```

Here **github.com/sivaprasadreddy/bookmarks** is the module name/path.
This can be any valid name like just **bookmarks**, but the common practice is to use the project's source code repository name as module name.

Go doesn't have a central repository like **Maven Central** or **NPM Registry**.
Go modules are downloaded from the source code repository directly.
So, it's a good practice to use the source code repository name as the module name.

When you run the **go mod init** command, it will create a **go.mod** file with the following content:

```go
module github.com/sivaprasadreddy/bookmarks

go 1.21
```

Now, in the project root directory, create a file called **main.go** with the following content:

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello World!")
}
```

In Go, the entry point of the application is the **main()** function in the **main** package.

Now, let's run the application using the following command:

```shell
$ go run main.go
Hello World!
```

You can also build the application and use the binary to run the application as follows:

```shell
$ go build
$ ./bookmarks
Hello World!
```

You can also use **go build -o binary-name** to specify a different binary name.

## Run application as a server
Go standard library provides **net/http** module which you can use to build a HTTP server.
Update the **main.go** file as follows:

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := &http.ServeMux{}
	mux.HandleFunc("/hello", hello)
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func hello(w http.ResponseWriter, r *http.Request) {
	_, err := fmt.Fprintln(w, "Hello World!")
	if err != nil {
		log.Println("Error processing the request")
	}
}
```

Here we are using the **http.ServeMux** to register the request handlers and start the server on port 8080.

Though it's just a simple example, there are many things to note here:
* In Go, the visibility of a function or field of a struct is based on the first letter of the identifier. 
  If the first letter is in uppercase, it is exported and visible outside the package. 
  If the first letter is in lowercase, it is private and not visible outside the package.
  So, the **hello** function is not exported and is not visible outside the **main** package.
* Go functions can return multiple values. 
  In the above example, the **fmt.Fprintln()** function returns two values, the number of bytes written and an error.
  We are ignoring the number of bytes written and checking only the error.
* A common convention is returning the error as the last value from the function.
* Go doesn't have exceptions. So, you need to handle the errors explicitly. 

Now, let's run the application using **go run main.go** and access the URL [http://localhost:8080/hello](http://localhost:8080/hello) in the browser.
You should see the response **Hello World!**.

## Live Reload
Let's change the response text from **Hello World!** to **Hello Go!**.
To pick up the code changes, we need to restart the application. 
During the development, it would be annoying to restart the application for every code change.

There are few ways to achieve live reload in Go applications.
* [Air](https://github.com/cosmtrek/air) - Live reload for Go apps
* [Go development with hot reload using Taskfile](https://dev.to/vitorvargas/go-development-with-hot-reload-using-taskfile-5cdj)

I prefer to use Air. You can install Air using the following command:

```shell
$ go install github.com/cosmtrek/air@latest
$ air -v
```

We can create a default air configuration file using **air init** which will create a file called **.air.toml** 
in the project root directory with sensible defaults. 
Then you can simply run the command **air** to start the application.

```shell
$ air init
$ air
```

Now, go ahead and change the response text from **Hello World!** to **Hello Go!** and save the file.
Refresh your browser, and you should see the updated response.

## Using Gin Web Framework
While Go standard library package **net/http** is good enough to build simple HTTP servers, its features are limited.
So, we are going to use the [Gin Web Framework](https://github.com/gin-gonic/gin) which provides a lot of useful features such as 
**routing**, **JSON Validation**, **Error management**, etc.

There are few other lightweight alternatives also like [Echo](https://echo.labstack.com/), [Fiber](https://gofiber.io/), [Chi](https://github.com/go-chi/chi), etc.
But I prefer to use **Gin** as it is the most popular one and feature rich.

Let's add the **Gin** dependency to our project using the following command:

```shell
$ go get -u github.com/gin-gonic/gin
```

Update the **main.go** file as follows:

```go
package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func main() {
	r := gin.Default()
	r.GET("/hello", hello)
	log.Fatal(r.Run(":8080"))
}

func hello(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello World",
	})
}
```

Here we are using the **gin.Default()** to create a Gin router and attached a handler function to handle **GET /hello** requests.
In the handler, we are returning a JSON response using the **c.JSON()** method.

Before starting the application, run **go mod tidy** command.
It adds any missing module requirements necessary to build the current module's packages and dependencies.
If there are any not used dependencies **go mod tidy** will remove those from **go.mod** accordingly.

If you take a look at the **go.mod** file, you can see the dependencies added in two sections.
The first **require** section includes the **direct dependencies** which are used by our application code.
The second **require** section includes the **indirect dependencies** used by the packages.

It will also create or update **go.sum** file which contains checksums for the exact contents of each dependency at the time it is added to your module.
You can think of it as **package-lock.json** file in Node.js.

```shell
$ go mod tidy
$ air
```

## Application Configuration Management using Viper
Any non-trivial application has some configuration such as database connection details, API keys, etc.
In Spring Boot this is a solved problem. You can configure your properties in **application.properties** or **application.yml** file 
and bind them to your objects by annotating them with **@ConfigurationProperties**.

In Go, there are many [3rd party libraries](https://awesome-go.com/configuration/) available for configuration management.
Some of the popular ones are [godotenv](https://github.com/joho/godotenv), [Viper](https://github.com/spf13/viper), [envconfig](https://github.com/kelseyhightower/envconfig), etc.
Among them, I like **Viper** as it is very flexible and feature-rich.

Let's add the **Viper** dependency to our project using the following command:

```shell
$ go get -u github.com/spf13/viper
```

I would like to have a default configuration file and be able to override the properties via environment variables.
Viper supports this out of the box and can also work with different file formats like json, yaml, etc.

I prefer to use **JSON** for configuration files. 
So, let's create a file called **config.json** in the project root directory with the following content:

```json
{
  "environment": "dev",
  "server_port": 8080,
  "logging": {
    "filename": "bookmarks.log",
    "level": "debug"
  },
  "db": {
    "host": "localhost",
    "port": 15432,
    "username": "postgres",
    "password": "postgres",
    "database": "postgres"
  }
}
```

Now, let's create a file called **config.go** in the **internal/config** directory with the following content:

```go
package config

import (
	"github.com/spf13/viper"
	"log"
	"strings"
)

type AppConfig struct {
	Environment string   `mapstructure:"environment"`
	ServerPort  int      `mapstructure:"server_port"`
	Logging     Logging  `mapstructure:"logging"`
	Db          DbConfig `mapstructure:"db"`
}

type Logging struct {
	FileName string `mapstructure:"filename"`
	Level    string `mapstructure:"level"`
}

type DbConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	UserName string `mapstructure:"username"`
	Password string `mapstructure:"password"`
	Database string `mapstructure:"database"`
}

func GetConfig(configFilePath string) (AppConfig, error) {
	log.Printf("Config File Path: %s\n", configFilePath)
	conf := viper.New()
	conf.SetConfigFile(configFilePath)
	replacer := strings.NewReplacer(".", "_")
	conf.SetEnvKeyReplacer(replacer)
	conf.AutomaticEnv()

	err := conf.ReadInConfig()
	if err != nil {
		log.Printf("error reading config file: %v\n", err)
	}
	var cfg AppConfig

	err = conf.Unmarshal(&cfg)
	if err != nil {
		log.Printf("configuration unmarshalling failed!. Error: %v\n", err)
		return cfg, err
	}
	return cfg, nil
}
```

* Go doesn't have classes. Instead, it has **structs** which are used to define data structures.
* We have created a struct called **AppConfig** which represents the application configuration.
* We are using the **mapstructure** tags to map the json property paths to the **AppConfig** struct fields.
* We have configured viper in such a way that we can replace **db.host** property value with **DB_HOST** environment variable.
* The **AutomaticEnv()** method will automatically read in environment variables.
* We are using the **conf.Unmarshal()** method to unmarshal(bind) the configuration values into the **AppConfig** struct.
* Finally, the method name **GetConfig()** is exported and visible outside the **config** package.

{{< box info >}}
**Go internal packages**

One important thing to remember is, in Go some package names have special meaning.
If you name a package as **internal**, it means that the package is only visible to the other packages inside the same module.
See [Internal packages](https://golang.org/doc/go1.4#internalpackages) for more details.
{{< /box >}}

Now, let's update the **main.go** file as follows:

```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"log"
	"net/http"
)

func main() {
	cfg, err := config.GetConfig("config.json")
	if err != nil {
		log.Fatal(err)
	}
	r := gin.Default()
	r.GET("/hello", hello)
	log.Fatal(r.Run(fmt.Sprintf(":%d", cfg.ServerPort)))
}

func hello(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello World",
	})
}
```

Instead of hard coding the port number, we are using the value from **AppConfig** struct.

Now if you change the port number in **config.json** file, you might expect air to automatically restart the application.
But you need to add the **json** extension to the **include_ext** array in **.air.toml** file as follows:

```toml
  include_ext = ["go", "tpl", "tmpl", "html", "json"]
```

Now you need to restart the application manually for air to pick up the new configuration from **.air.toml** file.

Okay, we have the configuration management in place. Let's move on to the next topic.

## Logging using zap
Again, in Spring Boot this is a solved problem.
Spring Boot by default automatically configures the logging using **Slf4j** and **Logback**.
If you want to switch to a different logging implementation like log4j2, then it is simply a matter of excluding the default logging implementation and adding the new one.
And, you can configure the logging using **application.properties** or **application.yml** file.

Go also has a standard library package called **log** which can be used for logging.
However, it is very basic and doesn't have many features. 
There are many 3rd party logging libraries available for Go like [zap](https://github.com/uber-go/zap), [zerolog](https://github.com/rs/zerolog), etc.
Inspiring from these libraries, Go 1.21 introduced a new package called **slog** to support structured logging.

**Zap** is a very popular logging library and provides a lot of features. 
So, we are going to use it in our application.

We are going to configure logging to log to a file and also to the console.
Also, we are going to use [lumberjack](https://github.com/natefinch/lumberjack) library for log rotation.

Let's add the **zap** and **lumberjack** dependencies to our project using the following commands:

```shell
$ go get -u go.uber.org/zap
$ go get -u gopkg.in/natefinch/lumberjack.v2
```

Now, let's create a file called **logger.go** in the **internal/logger** directory with the following content:

```go
package config

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

type Logger struct {
	*zap.SugaredLogger
}

func NewLogger(cfg AppConfig) *Logger {
	logFile := cfg.Logging.FileName
	logLevel, err := zap.ParseAtomicLevel(cfg.Logging.Level)
	if err != nil {
		logLevel = zap.NewAtomicLevelAt(zap.InfoLevel)
	}
	hook := lumberjack.Logger{
		Filename:   logFile,
		MaxSize:    1024,
		MaxBackups: 30,
		MaxAge:     7,
		Compress:   true,
	}

	encoder := getEncoder()
	core := zapcore.NewCore(
		encoder,
		zapcore.NewMultiWriteSyncer(zapcore.AddSync(os.Stdout), zapcore.AddSync(&hook)),
		logLevel)
	options := []zap.Option{
		zap.AddCaller(),
		zap.AddStacktrace(zap.ErrorLevel),
	}
	if cfg.Environment != "prod" {
		options = append(options, zap.Development())
	}
	sugaredLogger := zap.New(core, options...).With(zap.String("env", cfg.Environment)).Sugar()
	return &Logger{sugaredLogger}
}

func getEncoder() zapcore.Encoder {
	return zapcore.NewJSONEncoder(zapcore.EncoderConfig{
		TimeKey:        "ts",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		FunctionKey:    zapcore.OmitKey,
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	})
}
```

Though it looks like a lot of code, it's pretty much configuring the encoder what details to include in the log.
Also, we used log filename and loglevel from the **AppConfig** struct.

Now update the **main.go** to use the **logger** as follows:

```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"log"
	"net/http"
)

func main() {
	cfg, err := config.GetConfig("config.json")
	if err != nil {
		log.Fatal(err)
	}
	logger := config.NewLogger(cfg)
	logger.Infof("Application is running on %d", cfg.ServerPort)
	r := gin.Default()
	r.GET("/hello", hello)
	log.Fatal(r.Run(fmt.Sprintf(":%d", cfg.ServerPort)))
}

func hello(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello World",
	})
}
```

Now, if you run the application, you should see the following log message in the console and also in the **bookmarks.log** file.

```shell
{"level":"info","ts":"2023-11-18T12:11:51.091+0530","caller":"bookmarks/main.go:17","msg":"Application is running on 8080","env":"dev"}
```

Next, let's setup database integration.

## Database Integration using pgx
Go standard library provides **database/sql** package to access relational databases.
We are going to use PostgreSQL as our database, and we are going to use [pgx](https://github.com/jackc/pgx) driver.

You can use the following **docker-compose.yml** file to start the PostgreSQL database:

```yaml
version: '3.8'
services:

  bookmarks-db:
    image: postgres:16-alpine
    container_name: bookmarks-db
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    ports:
      - "15432:5432"
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 10s
      timeout: 5s
      retries: 5
```

Start the database container using **docker compose up -d** command, 
connect to the database and create **bookmarks** table and sample data using the following script:

```sql
create table bookmarks
(
    id         bigserial primary key,
    title      varchar   not null,
    url        varchar   not null,
    created_at timestamp
);

INSERT INTO bookmarks (title, url, created_at) 
VALUES ('SivaLabs Blog', 'https://sivalabs.in', CURRENT_TIMESTAMP);
```

Let's add the **pgx** dependency to our project using the following command:

```shell
$ go get -u github.com/jackc/pgx/v5
```

First, let's create a file called **db.go** in the **internal/config** directory with the following content:

```go
package config

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"log"
)

func GetDb(config AppConfig) *pgx.Conn {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Db.Host, config.Db.Port, config.Db.UserName, config.Db.Password, config.Db.Database)
	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		log.Fatal(err)
	}
	return conn
}
```

Nothing groundbreaking here. We are passing the **AppConfig** struct and creating a connection string using the database configuration.
Then we are using the **pgx.Connect()** method to create a connection to the database.
If it fails to connect to the database, we are logging the error and exiting the application.

Next, in **main.go** file let's create a struct to represent a **Bookmark** as follows:

```go
type Bookmark struct {
	ID        int
	Title     string
	Url       string
	CreatedAt time.Time
}
```

Now, in the **main.go** file, let's implement a function to fetch all the bookmarks from the database as follows:

```go
func getAll(ctx context.Context, db *pgx.Conn) ([]Bookmark, error) {
	query := `select id, title, url, created_at FROM bookmarks`
	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookmarks []Bookmark
	for rows.Next() {
		var bookmark = Bookmark{}
		err = rows.Scan(&bookmark.ID, &bookmark.Title, &bookmark.Url, &bookmark.CreatedAt)
		if err != nil {
			return nil, err
		}
		bookmarks = append(bookmarks, bookmark)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return bookmarks, nil
}
```

Those of us who got habituated to using **Spring Data JPA** and simply calling **bookmarkRepository.findAll()** method might find this code a bit verbose.
It took me a while to get used to this style of coding in Go.

* We are using the **pgx.Conn** object to execute the query and get the result set.
* We are using the **rows.Next()** method to iterate over the result set.
* We are using the **rows.Scan()** method to map the result set to the **Bookmark** struct.
* We are using the **rows.Err()** method to check for any errors while iterating over the result set.
* We are using the **defer** keyword to close the result set at the end of the function execution.
* We are returning the **[]Bookmark** slice and an error from the function.
* A bunch of error checks and handling them by returning **nil** value for **[]Bookmark** and the error value.

Verbose, but understandable.

I think the following picture would fit here.

{{< figure src="/images/java-is-verbose.webp" >}}

Sorry, can't resist adding this meme. 😄

Now, let's update the **main.go** file to add a handler to GET **/api/bookmarks** endpoint as follows:

```go
package main

import (
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"log"
	"net/http"
	"time"
)

func main() {
	cfg, err := config.GetConfig("config.json")
	if err != nil {
		log.Fatal(err)
	}
	logger := config.NewLogger(cfg)
	db := config.GetDb(cfg)

	r := gin.Default()
	r.GET("/api/bookmarks", getAllBookmarks(db, logger))
	log.Fatal(r.Run(fmt.Sprintf(":%d", cfg.ServerPort)))
}

func getAllBookmarks(db *pgx.Conn, logger *config.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		bookmarks, err := getAll(ctx, db)
		if err != nil {
			logger.Errorf("Error fetching bookmarks from db: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failing to fetch bookmarks",
			})
		}
		c.JSON(http.StatusOK, bookmarks)
	}
}

// Bookmark struct
// func getAll(ctx context.Context, db *pgx.Conn) ([]Bookmark, error) 
```

Here, the key part to understand is the **getAllBookmarks** function.
Usually we create gin handler function with signature as **func(c \*gin.Context)** and 
attach it as handler using **r.GET("/api/bookmarks", getAllBookmarks)**.

However, we need to pass the **db** and **logger** objects to the handler function.
So, we are creating a function called **getAllBookmarks** taking **db** and **logger** objects as parameters which returns a function with the signature **func(c *gin.Context)**.
Then we are attaching the handler using **r.GET("/api/bookmarks", getAllBookmarks(db, logger))**.

Now, let's run the application and access the URL [http://localhost:8080/api/bookmarks](http://localhost:8080/api/bookmarks), 
and you should be able to the response with one bookmark.

It's working, but we are stuffing everything in **main.go** file.
No separation of concerns, and passing **db**, **logger** as inputs to all the functions doesn't look good.

Let's refactor the code to make it a little bit better.

## Refactoring the code
Before refactoring the code, let's understand a couple of things.

In Go, there is no concept of classes. Instead, it has **structs** which are used to define data structures.
We can define methods on structs as follows:

```go
type BookmarkRepository {
	db *pgx.Conn
    logger *config.Logger
}

func (b BookmarkRepository) GetAll(ctx context.Context) ([]Bookmarks, error) {
	b.logger.Infof("Fetching all bookmarks")
	b.db.Query(...)
}

var bookmarkRepo = BookmarkRepository{db: db, logger: logger}
bookmarks, err := bookmarkRepo.GetAll(ctx)
```

Here, we are defining a struct called **BookmarkRepository** with two fields **db** and **logger**.
Then we are defining a method called **GetAll** on the **BookmarkRepository** struct.
The **(b BookmarkRepository)** before the method name is called **receiver** through which you can access the fields of the struct.

Next, we may not want to directly expose our **BookmarkRepository** struct to the outside world.
So, we can create an interface and define the methods on the interface as follows:

```go
type BookmarkRepository interface {
	GetAll(ctx context.Context) ([]Bookmark, error)
}
```

Then you can create an unexported struct (with lowercase first letter) which implements the interface.
In Go, you don't explicitly declare this struct as implementing the interface.
If the struct has all the methods defined in the interface, then it is automatically considered as implementing the interface.

```go
type bookmarkRepo struct {
	db     *gorm.DB
	logger *config.Logger
}

func NewBookmarkRepository(db *gorm.DB, logger *config.Logger) BookmarkRepository {
	return bookmarkRepo{
		db:     db,
		logger: logger,
	}
}

func (r bookmarkRepo) GetAll(ctx context.Context) ([]Bookmark, error) {
	r.db.Query(...)
}

// --------- usage ------------
var db = ...
var logger = ...
var bookmarkRepo = NewBookmarkRepository(db, logger)
bookmarks, err := bookmarkRepo.GetAll(ctx)
```

Now, let's refactor the code to use this approach.

Create a file called **repository.go** in the **internal/domain** directory with the following content:

```go
package domain

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"time"
)

type Bookmark struct {
	ID        int
	Title     string
	Url       string
	CreatedAt time.Time
}

type BookmarkRepository interface {
	GetAll(ctx context.Context) ([]Bookmark, error)
	GetByID(ctx context.Context, id int) (*Bookmark, error)
	Create(ctx context.Context, b Bookmark) (*Bookmark, error)
	Update(ctx context.Context, b Bookmark) error
	Delete(ctx context.Context, id int) error
}

type bookmarkRepo struct {
	db     *pgx.Conn
	logger *config.Logger
}

func NewBookmarkRepository(db *pgx.Conn, logger *config.Logger) BookmarkRepository {
	return bookmarkRepo {
		db:     db,
		logger: logger,
	}
}

func (r bookmarkRepo) GetAll(ctx context.Context) ([]Bookmark, error) {
	query := `select id, title, url, created_at FROM bookmarks`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookmarks []Bookmark
	for rows.Next() {
		var bookmark = Bookmark{}
		err = rows.Scan(&bookmark.ID, &bookmark.Title, &bookmark.Url, &bookmark.CreatedAt)
		if err != nil {
			return nil, err
		}
		bookmarks = append(bookmarks, bookmark)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return bookmarks, nil
}

func (r bookmarkRepo) GetByID(ctx context.Context, id int) (*Bookmark, error) {
	panic("implement me")
}

func (r bookmarkRepo) Create(ctx context.Context, b Bookmark) (*Bookmark, error) {
	panic("implement me")
}

func (r bookmarkRepo) Update(ctx context.Context, b Bookmark) error {
	panic("implement me")
}

func (r bookmarkRepo) Delete(ctx context.Context, id int) error {
	panic("implement me")
}
```

In the similar way, let's refactor API handlers also.

Create a file called **handler.go** in the **internal/api** directory with the following content:

```go
package api

import (
  "github.com/gin-gonic/gin"
  "github.com/sivaprasadreddy/bookmarks/internal/config"
  "github.com/sivaprasadreddy/bookmarks/internal/domain"
  "net/http"
)

type BookmarkController struct {
  repo   domain.BookmarkRepository
  logger *config.Logger
}

func NewBookmarkController(repo domain.BookmarkRepository, logger *config.Logger) BookmarkController {
  return BookmarkController{
    repo:   repo,
    logger: logger,
  }
}

func (p BookmarkController) GetAll(c *gin.Context) {
  p.logger.Info("Finding all bookmarks")
  ctx := c.Request.Context()
  bookmarks, err := p.repo.GetAll(ctx)
  if err != nil {
    if err != nil {
      p.logger.Errorf("Error :%v", err)
    }
    c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
      "error": "Unable to fetch bookmarks",
    })
    return
  }
  c.JSON(http.StatusOK, bookmarks)
}
```

Finally, let's update the **main.go** file to use these changes as follows:

```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sivaprasadreddy/bookmarks/internal/api"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"github.com/sivaprasadreddy/bookmarks/internal/domain"
	"log"
)

func main() {
	cfg, err := config.GetConfig("config.json")
	if err != nil {
		log.Fatal(err)
	}
	logger := config.NewLogger(cfg)
	db := config.GetDb(cfg)
	repo := domain.NewBookmarkRepository(db, logger)
	handler := api.NewBookmarkController(repo, logger)

	logger.Infof("Application is running on %d", cfg.ServerPort)
	r := gin.Default()
	r.GET("/api/bookmarks", handler.GetAll)
	log.Fatal(r.Run(fmt.Sprintf(":%d", cfg.ServerPort)))
}
```

Now, this looks much better. However, coming from a Spring Boot background, 
you might be wondering where is my **Dependency Injection** and other cool **AOP** stuff?

In Go, there is no built-in support for Dependency Injection.
There are some 3rd party libraries available for Dependency Injection like [wire](https://github.com/google/wire).
But Go community prefers to keep things simple and create the structs and glue them together manually like we did above.

We are almost done with the refactoring, but I would like to go one step further.
I would like to keep the logic in **main.go** as minimal as possible and delegate the application initialization and starting the server to a separate package.

Let's create a file called **app.go** in the **cmd** directory with the following content:

```go
package cmd

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sivaprasadreddy/bookmarks/internal/api"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"github.com/sivaprasadreddy/bookmarks/internal/domain"
	"log"
)

type App struct {
	Router *gin.Engine
	Cfg    config.AppConfig
}

func NewApp(cfg config.AppConfig) *App {
	logger := config.NewLogger(cfg)
	db := config.GetDb(cfg)

	repo := domain.NewBookmarkRepository(db, logger)
	handler := api.NewBookmarkController(repo, logger)

	router := gin.Default()

	router.GET("/api/bookmarks", handler.GetAll)

	return &App{
		Cfg:    cfg,
		Router: router,
	}
}

func (app App) Run() {
	log.Fatal(app.Router.Run(fmt.Sprintf(":%d", app.Cfg.ServerPort)))
}
```

* We created a struct called **App** which holds the key components of our application, i.e, **Gin Router** and **AppConfig**.
* We created a function called **NewApp()** which takes **AppConfig** as input, initialize the application and returns the **App** struct.
* We created a method called **Run** which starts the application.

Now, let's update the **main.go** file to use this as follows:

```go
package main

import (
	"github.com/sivaprasadreddy/bookmarks/cmd"
	"github.com/sivaprasadreddy/bookmarks/internal/config"
	"log"
)

func main() {
	cfg, err := config.GetConfig("config.json")
	if err != nil {
		log.Fatal(err)
	}
	app := cmd.NewApp(cfg)
	app.Run()
}
```

Now, we are talking. This looks much better.

We have come a long way and have the complete code structure in place.
Now, let's move on to the next topic of using database migrations to setup the database instead of manually making database changes.

## Database Migrations using golang-migrate
In Spring Boot, we can use [Flyway](https://flywaydb.org/) or [Liquibase](https://www.liquibase.org/) to manage database migrations.
All you have to do is place the migration scripts in the expected location, and the framework will take care of the rest.

In Go there are few libraries available for database migrations.
Among them, [golang-migrate](https://github.com/golang-migrate/migrate) is a popular one and has support for many databases.
Let's use it in our application.

Let's add the **golang-migrate** dependency to our project using the following command:

```shell
$ go get -u github.com/golang-migrate/migrate/v4
```

While using **golang-migrate**, we will create **up** and **down** migrations to support undoing the changes.

Let's create **db/migrations** directories in the project root directory.
Then create a file called **000001_init_schema.up.sql** in the **db/migrations** directory with the following content:

```sql
create table bookmarks
(
    id         bigserial primary key,
    title      varchar   not null,
    url        varchar   not null,
    created_at timestamp
);
```

Then create a file called **000001_init_schema.down.sql** in the **db/migrations** directory with the following content:

```sql
drop table bookmarks;
```

You can create more migration scripts to insert sample data, etc.

Before implementing the logic to apply db migrations, first we need to learn a little bit about including non-Go files in Go binaries.

### Embedding non-go files in the binary
In Java, when you build the jar/war file, by default, all the static resources that you put in **src/main/resources** will be bundled into the jar/war file.
But in Go, by default only compiled go code will be part of the binary.
Before Go 1.16, you need to use some 3rd party libraries to package non-go files into the binary.
Go 1.16 introduced a new feature called [Embedding](https://golang.org/pkg/embed/) which makes it easy to include non-go files in the binary.

We are going to use this feature to include the migration scripts in the binary.
Having everything related to the application in the binary makes it easy to deploy and run the application.

Create a file called **migrations.go** in the **db** directory with the following content:

```go
package db

import "embed"

//go:embed migrations/*.sql
var MigrationsFS embed.FS
```

Here, we are using the **//go:embed** directive to embed the SQL migration scripts in **MigrationsFS**.

Now, let's update the **internal/config/db.go** file to run the migrations as follows:

```go
package config

import (
  "context"
  "fmt"
  "github.com/golang-migrate/migrate/v4"
  _ "github.com/golang-migrate/migrate/v4/database/postgres"
  "github.com/golang-migrate/migrate/v4/source/iofs"
  "github.com/jackc/pgx/v5"
  "github.com/sivaprasadreddy/bookmarks/db"
)

func GetDb(config AppConfig, logger *Logger) *pgx.Conn {
  connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
    config.Db.Host, config.Db.Port, config.Db.UserName, config.Db.Password, config.Db.Database)
  conn, err := pgx.Connect(context.Background(), connStr)
  if err != nil {
    logger.Fatal(err)
  }
  applyDbMigrations(config, logger)
  return conn
}

func applyDbMigrations(config AppConfig, logger *Logger) {
  d, err := iofs.New(db.MigrationsFS, "migrations")
  if err != nil {
    logger.Fatalf("Error while loading db migrations from sources: %v", err)
  }
  databaseURL := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
    config.Db.UserName, config.Db.Password, config.Db.Host, config.Db.Port, config.Db.Database)
  m, err := migrate.NewWithSourceInstance("iofs", d, databaseURL)
  if err != nil {
    logger.Fatalf("Error while loading db migrations: %v", err)
  }
  err = m.Up()
  if err != nil && !errors.Is(err, migrate.ErrNoChange) {
    logger.Fatalf("Error while applying db migrations: %v", err)
  }
  logger.Infof("Database migrations applied successfully")
}
```

We have loaded the migration scripts from **migrations** directory of **MigrationsFS** and applied them to the database.
Note that we also need to import the **postgres** driver to use it with **golang-migrate**.
By default, Go doesn't allow declaring unused variables or imports. 
So, we have to use the **_** to import the package to avoid the error.

Also, notice that we are passing **config.Logger** to the **GetDb()** function.
So, we need to pass it from **app.go** file **NewApp(cfg config.AppConfig)** function as well.

Now, connect to the database and delete the **bookmarks** table and run the application.
You should see the **bookmarks** table got created and also there is **schema_migrations** table created by **golang-migrate** to keep track of the applied migrations.
This is similar to Flyway's **flyway_schema_history** table, but not quite the same though.

## Implement Create Bookmark API
We have already implemented the API to fetch all the bookmarks.
Now, let's implement the API to create a new bookmark.

Let's update the **internal/domain/repository.go** file to update the **Create()** method as follows:

```go
func (r bookmarkRepo) Create(ctx context.Context, b Bookmark) (*Bookmark, error) {
	query := "insert into bookmarks(title, url, created_at) values($1, $2, $3) RETURNING id"
	var lastInsertID int
	err := r.db.QueryRow(ctx, query, b.Title, b.Url, b.CreatedAt).Scan(&lastInsertID)
	if err != nil {
		r.logger.Errorf("Error while inserting bookmark: %v", err)
		return nil, err
	}
	b.ID = lastInsertID
	return &b, nil
}
```
Now, let's add a handler to create a new bookmark in **internal/api/handler.go** file as follows:

```go
type CreateBookmarkRequest struct {
	Title string `json:"title" binding:"required"`
	Url   string `json:"url" binding:"required,url"`
}

func (p BookmarkController) Create(c *gin.Context) {
	ctx := c.Request.Context()
	var model CreateBookmarkRequest
	if err := c.ShouldBindJSON(&model); err != nil {
        // you can extract error details as follows
        /*for _, err := range err.(validator.ValidationErrors) {
            fmt.Println(err.Field())
            fmt.Println(err.Tag())
            fmt.Println(err.Kind())
            fmt.Println(err.Type())
            fmt.Println(err.Value())
        }*/
		p.respondWithError(c, http.StatusBadRequest, err, "Invalid request payload")
		return
	}
	p.logger.Infof("Creating bookmark for URL: %s", model.Url)
	bookmark := domain.Bookmark{
		ID:        0,
		Title:     model.Title,
		Url:       model.Url,
		CreatedAt: time.Now(),
	}

	savedBookmark, err := p.repo.Create(ctx, bookmark)
	if err != nil {
		p.respondWithError(c, http.StatusInternalServerError, err, "Failed to create bookmark")
		return
	}
	c.JSON(http.StatusCreated, savedBookmark)
}

func (p BookmarkController) respondWithError(c *gin.Context, code int, err error, errMsg string) {
	if err != nil {
		p.logger.Errorf("Error :%v", err)
	}
	c.AbortWithStatusJSON(code, gin.H{
		"error": errMsg,
	})
}
```

We have created a struct called **CreateBookmarkRequest** to represent the request payload.
We have added **json** tags to map the request payload to the struct fields.
Also, we have added **binding** tags to validate the request payload.
Gin uses [validator](https://pkg.go.dev/gopkg.in/go-playground/validator.v9) package for validation.
You can extract the error details as shown in the commented code.

Then we have added a utility method called **respondWithError** to handle the error response to avoid the repetition.

Finally, we have to attach the handler to the router in **cmd/app.go** file as follows:

```go
router.POST("/api/bookmarks", handler.Create)
```

Now, let's run the application and create a new bookmark using the following curl command:

```shell
curl --location --request POST 'http://localhost:8080/api/bookmarks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Google",
    "url": "https://google.com"
}'
```

You should see the following response:

```json
{
    "ID": 1,
    "Title": "Google",
    "Url": "https://google.com",
    "CreatedAt": "2021-09-18T12:11:51.091+05:30"
}
```

Notice that the keys are nothing but the Bookmark struct field names.
We can customize the response by using the **json** tags as follows:

```go
type Bookmark struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Url       string    `json:"url"`
	CreatedAt time.Time `json:"createdAt"`
}
```

Now, you should see the following response:

```json
{
    "id": 1,
    "title": "Google",
    "url": "https://google.com",
    "createdAt": "2021-09-18T12:11:51.091+05:30"
}
```

## Implementing other API endpoints
We have implemented the API to fetch all the bookmarks and create a new bookmark.
The remaining API endpoints are pretty much similar to these API implementations.
So, I am going to leave it as an exercise for you to implement the remaining API endpoints.
You can find the complete code in the [GitHub repository](https://github.com/sivaprasadreddy/go-for-spring-boot-developers/tree/main/bookmarks-go).

## Dockerizing the Go application
Spring Boot has a built-in support for creating Docker images using **Buildpacks**.
You can also use **jib** or **Dockerfile** to create Docker images.

We can dockerize our Go application using the following **Dockerfile**:
    
```dockerfile 
FROM golang:1.21-buster as builder
# Create and change to the app directory.
WORKDIR /app
# Copy go.mod and if present go.sum.
COPY go.* ./
# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download
# Copy local code to the container image.
COPY . ./
# Build the Go app
RUN GO111MODULE=on GOOS=linux CGO_ENABLED=0 go build -v -o server

######## Start a new stage from scratch #######
FROM gcr.io/distroless/base-debian10
WORKDIR /

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/server ./server
COPY --from=builder /app/config.json ./config.json

# Run the templates service on container startup.
CMD ["/server"]
```

Notice that we are using a multi-stage build to create the Docker image.
In the first stage, we are using the official golang image to build the application and generate the binary.
In the second stage, we are using the distroless image to run the application.
We copied the binary and **config.json** file from the first stage to the second stage.
Finally, starting the application using the binary.

We can override the default configuration properties defined in **config.json** file using environment variables.
For example, if you want to override the server port, then you can pass the **SERVER_PORT** environment variable to the container.
You can pass database connection properties using **DB_HOST**, **DB_PORT**, **DB_USERNAME**, **DB_PASSWORD**, **DB_DATABASE** environment variables.

## Conclusion
If you are coming from a Spring Boot background, then you might find it a little bit difficult to get used to the Go way of doing things.
Especially, Spring Boot has a lot of features and abstractions built-in to make the developer's life easy.
But in Go, you have to implement or integrate various libraries yourself.

However, once the skeleton is ready, you can focus on implementing the business logic with very less cognitive load.
As there is no annotations magic and ten layers of abstractions, it is very easy to understand the code.

While Go code is verbose, it is also very readable and easy to understand.
If you stuck with a problem, you can debug the code and understand what is going on.

Also, Go application consumes very less memory and starts very fast.
In a containerized environment, this is very important.

There are still many things I haven't covered in this article like **graceful shutdown**, **monitoring**, **testing**, etc.
But I hope this article will help you to get started with Go.

You can find the complete code in the [GitHub repository](https://github.com/sivaprasadreddy/go-for-spring-boot-developers).
In the repository, you can also find the implementation of the following:
* Remaining API endpoints 
* Graceful shutdown 
* Repository implementation using [GORM](https://gorm.io/) 
* Testing using [testcontainers-go](https://golang.testcontainers.org/)