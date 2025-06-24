---
title: Creating Yeoman based SpringBoot Generator
author: Siva
images: ["/preview-images/yeoman-logo.webp"]
type: post
date: 2020-01-29T04:59:17+05:30
url: /creating-yeoman-based-springboot-generator/
categories:
  - SpringBoot
tags: [SpringBoot, Yeoman]
---

I have been working with Spring and [SpringBoot](https://spring.io/projects/spring-boot) for many years and 
I needed to create lot of Spring(Boot) applications for various reasons like 
[blog posts](https://sivalabs.in/categories/springboot/), [sample apps](https://github.com/sivaprasadreddy/spring-boot-tutorials), 
[book sample code](https://github.com/sivaprasadreddy/beginning-spring-boot-2) and for my personal learning as well. 
So, I needed some tool/mechanism to quickly create Spring(Boot) application with most commonly used configuration.

<!--more-->


I know we have the most popular [SpringBoot Initializer](http://start.spring.io/) to create SpringBoot applications. 
But, it generates the application with only selected starter dependencies added and nothing more.

Most of the times I needed to configure some common properties in **application.properties** file, additional libraries like 
**Testcontainers**, Zalando's **Problem Spring Web** etc. So, I thought of automating this repetitive work in some way.

As a first attempt I tried to automate this by creating various [Maven archetypes](https://github.com/sivaprasadreddy/maven-archetype-templates) 
with various combination of technologies. It helped me to some extent but I had to refactor few things after generating the application. 
Also, I couldn't find a way to include some dependencies/configuration conditionally based on user input.

As a second attempt I tried to extend [SpringBoot Initializer](https://github.com/sivaprasadreddy/spring-initializr-extensions) 
by adding new features. I felt it was okayish but not productive enough. In addition to that I need to host it somewhere and 
make sure it is running all the times.

And then I thought of creating a [Yeoman](https://yeoman.io/) based generator. 
First, I came to know about Yeoman when AngularJS 1.x was hot and there was an amazing Yeoman generator for 
creating AngularJS applications. Later I stumbled upon [JHipster](https://www.jhipster.tech/) which blew my mind. 
JHipster is amazing and what you can build with JHipster in just 30 minutes is phenomenal. 
However, there are certain JHipster features that does not fit for my personal preferences such as:

- I like **jar** packaging
- I like to use **spring-boot-starter-\*** than configuring individual libraries
- I like to have an option to generate application **without spring-security**
- I prefer **Flyway** over **Liquibase**
- I like to have only minimum and required configuration ie **no AsyncConfiguration, LocaleConfiguration, CacheConfiguration, Logstash Logging** etc.
- I like **.properties** over **.yml**

So, I decided to write my own SpringBoot Generator using Yeoman and 
I started creating [generator-springboot](https://github.com/sivaprasadreddy/generator-springboot).
And, I have implemented the generator to generate a SpringBoot application with following features:

* SpringBoot REST API with jar type packaging
* Generate CRUD operations along with Unit and Integration Tests
* CORS configuration
* Swagger UI Integration
* Spring Data JPA integration with option to select databases like MySQL, Postgresql, MariaDB etc
* Flyway or Liquibase data migration support
* SpringBoot Actuator configuration
* Integration with Config Server, Service Registry, Sleuth, Zipkin
* TestContainers integration
* JUnit 5
* Docker configuration
* Jenkinsfile


I thought of writing an article on how to create a Yeoman based generator so that others can also create their own generators if interested.

First of all there is wonderfully written [Official Documentation](https://yeoman.io/authoring/) on how to create our own Yeoman generator. 
I strongly recommend to go through it.

### How Yeoman Generators work?
To put it simply, Yeoman generator works as follows:

- Create template file(s) with placeholders
- Prompt user for inputs
- Generate files by replacing the placeholders with user provided values

Okay, enough talk. Let's get to the business.

## Create SpringBoot Yeoman Generator

There are some fundamental concepts to be understood which explained clearly in the documentation and repeating it over here is redundant.
So, once again I strongly recommend going through this official documentation to get some basic understanding of concepts https://yeoman.io/authoring/index.html.

Create a directory called **generator-springboot** and create the following files and directories inside generator-springboot as follows:

```bash
+- generator-springboot/
   +- package.json
   +- generators/
      +- app/
         +- index.js
```

**package.json**

```json
{
  "name": "generator-springboot",
  "version": "0.0.1",
  "description": "A Yeoman generator for generating SpringBoot microservices",
  "files": ["generators"],
  "main": "index.js",
  "keywords": [
    "yeoman-generator",
    "java",
    "spring",
    "spring-boot",
    "microservice"
  ],
  "dependencies": {
    "yeoman-generator": "^4.0.1"
  }
}
```

**generators/app/index.js**

```js
"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  method1() {
    this.log("method 1 just ran");
  }

  method2() {
    this.log("method 2 just ran");
  }
};
```

During the development we can symlink to the npm package to run the generator.
From the root of your generator project (**generator-springboot/** folder), type:

```bash
generator-springboot> npm link
```

And then run the generator as follows:

```bash
generator-springboot> yo springboot
```

It will execute both method1() and method2() and print the log statements on console.

As we have not explicitly mentioned any priority to the methods method1() and method2() ran with default priority as follows:

```js
"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  default: {
    method1() {
        this.log("method 1 just ran");
    }

    method2() {
        this.log("method 2 just ran");
    }
  }
};
```

Yeoman defines the following priorities so that we can hook up our custom logic at appropriate priority executions.

The available priorities are (in running order):

1. **initializing** - Your initialization methods (checking current project state, getting configs, etc)
2. **prompting** - Where you prompt users for options (where you’d call this.prompt())
3. **configuring** - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
4. **default** - If the method name doesn’t match a priority, it will be pushed to this group.
5. **writing** - Where you write the generator specific files (routes, controllers, etc)
6. **conflicts** - Where conflicts are handled (used internally)
7. **install** - Where installations are run (npm, bower)
8. **end** - Called last, cleanup, say good bye, etc

Now let's create **pom.xml** template **pom.xml.tpl** and **src/main/java/com/mycompany/demo/Application.java** file in **generators/app/templates** folder as follows:

**generators/app/templates/pom.xml.tpl**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mycompany</groupId>
    <artifactId><%= appName %></artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name><%= appName %></name>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```
Notice we have the placeholders with syntax **<%= variableName %>**.

**generators/app/templates/src/main/java/com/mycompany/demo/Application.java**

```java
package com.mycompany.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

Update **generators/app/index.js** as follows:

```js
"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.log("Generating SpringBoot Application");
  }

  prompting() {
    const prompts = [
      {
        type: "string",
        name: "appName",
        message: "What is the application name?",
        default: "myservice"
      }
    ];

    return this.prompt(prompts).then(answers => {
      this.appName = answers.appName;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("pom.xml.tpl"),
      this.destinationPath(this.appName + "/pom.xml"),
      {
        appName: this.appName
      }
    );

    this.fs.copy(
      this.templatePath("src"),
      this.destinationPath(this.appName + "/src")
    );
  }

  end() {
    this.log(`Application ${this.appName} generated successfully`);
  }
};
```

As per the priorities order first **initializing()** block gets executed, then **prompting()** then **writing()** and finally **end()**.
In **prompting()** we are asking user to provide application name and store it in **appName** variable for later use.

In **writing()** we are generating **pom.xml** file using the **pom.xml.tpl** template by replacing the **appName** placeholder with the user provided value. Also, we are copying the entire **src** directory.

Instead of storing each user input in separate variable and passing them explicitly to replace placeholders we can store all the user provided input values in a JSON object and pass it as follows:

```js
"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.configOptions = this.options.configOptions || {};
  }

  initializing() {
    this.log("Generating SpringBoot Application");
  }

  prompting() {
    const prompts = [
      {
        type: "string",
        name: "appName",
        message: "What is the application name?",
        default: "myservice"
      },
      {
        type: "list",
        name: "appType",
        message: "Do you want to use WebMVC or WebFlux?",
        choices: [
          {
            value: "webmvc",
            name: "WebMVC"
          },
          {
            value: "webflux",
            name: "WebFlux"
          }
        ],
        default: "webmvc"
      }
    ];

    return this.prompt(prompts).then(answers => {
      Object.assign(this.configOptions, answers);
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("pomm.xml.tpl"),
      this.destinationPath(this.configOptions.appName + "/pom.xml"),
      this.configOptions
    );

    this.fs.copy(
      this.templatePath("src"),
      this.destinationPath(this.configOptions.appName + "/src")
    );
  }

  end() {
    this.log(
      `Application ${this.configOptions.appName} generated successfully`
    );
  }
};
```

We have added one more prompt of type **list** to select the **appType**.

Notice that we are initializing **configOptions** in the constructor and adding the user provided propmt answers into configOptions. Later we are simply passing the configOptions object which will contain all the placeholders.

Now, we can conditionally include either **webmvc** and **webflux** starter in **pom.xml.tpl** based on the user selection as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mycompany</groupId>
    <artifactId><%= appName %></artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name><%= appName %></name>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <%_ if (appType === 'webmvc') { _%>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <%_ } _%>
        <%_ if (appType === 'webflux') { _%>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>
        <%_ } _%>
    </dependencies>
</project>
```

Over the time the number of inputs we need from user may grow. Instead of adding prompt questions in the same **index.js** file we can create separate **prompt.js** file and add all prompts in that file.

Create **generators/app/prompt.js** as follows:

```js
module.exports = {
  prompting
};

function prompting() {
  const done = this.async();
  const prompts = [
    {
      type: "string",
      name: "appName",
      message: "What is the application name?",
      default: "myservice"
    },
    {
      type: "list",
      name: "appType",
      message: "Do you want to use WebMVC or WebFlux?",
      choices: [
        {
          value: "webmvc",
          name: "WebMVC"
        },
        {
          value: "webflux",
          name: "WebFlux"
        }
      ],
      default: "webmvc"
    }
  ];

  this.prompt(prompts).then(answers => {
    Object.assign(this.configOptions, answers);
    done();
  });
}
```

Update **generators/app/index.js** as follows:

```js
const prompts = require('./prompts');

module.exports = class extends Generator {

    ...
    ...
    get prompting() {
        return prompts.prompting;
    }
}
```

Sometimes we might want to ask more questions based on previous prompt answer.
We can conditionally prompt user using **when** as follows:

```js
const prompts = [
    ...
    ...
    {
        type: 'confirm',
        name: 'sql',
        message: 'Do you want to use Spring Data Jpa?',
        default: true
    },
    {
        when: response => response.sql === true,
        type: 'list',
        name: 'databaseType',
        message: 'Which type of database you want to use?',
        choices: [
            {
                value: 'postgresql',
                name: 'Postgresql'
            },
            {
                value: 'mysql',
                name: 'MySQL'
            },
            {
                value: 'mariadb',
                name: 'MariaDB'
            }
        ],
        default: 'postgresql'
    }
]
```

### Composing with Sub-generator

We may want to add more and more features to our generator. Instead of adding all those features to a single generator we can create sub-generators and invoke them from main generator using **this.composeWith(...)**.

Suppose we have main generator **app** and 3 other sub-generators **microservice**, **config-server** and **service-registry**.

```bash
+- generator-springboot/
   +- package.json
   +- generators/
      +- app/
         +- index.js
      +- microservice/
         +- index.js
      +- config-server/
         +- index.js
      +- service-registry/
         +- index.js
```

Now from main app generator we can invoke sub-generators as follows:

**generator-springboot/generators/app/index.js**

```js
"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  prompting() {
    const prompts = [
      {
        type: "list",
        name: "appType",
        message: "Which type of application you want to generate?",
        choices: [
          {
            value: "microservice",
            name: "SpringBoot MicroService"
          },
          {
            value: "config-server",
            name: "Spring Cloud Config Server"
          },
          {
            value: "service-registry",
            name:
              "Spring Cloud Eureka Server for Service Registry and Discovery"
          }
        ],
        default: "microservice"
      }
    ];
    return this.prompt(prompts).then(answers => {
      this.appType = answers.appType;
    });
  }

  default() {
    this.composeWith(require.resolve("../" + this.appType));
  }
};
```

Now when you run the main generator and select the **appType**, it will invoke the respective sub-generator.

### Invoking sub-generator directly

We can create sub-generators to add more features to an existing yeoman generated application.
For example, once we create a SpringBoot application we can use a entity sub-generator to generate a JPA entity.

We can invoke sub-generator directly as follows:

```bash
myservice> yo springboot:entity Product
```

### Using user configuration

We can save the user selected options so that we can use them later while running sub-generators.
For example, if user selected to use FlywayDB migration tool then while running Entity generator we can check which DB migration option is selected and generate DB migration scripts accordingly.

We can save the user configuration in main generator as follows:

**generators/app/index.js**

```js
module.exports = class extends Generator {

    ...
    ...
    configuring() {
        Object.assign(this.configOptions, constants);
        this.config.save(this.configOptions);
    }
}
```

**this.config.save()** method will store the user configuration in **.yo-rc.json** file.

**.yo-rc.json**

```json
{
  "generator-springboot": {
    "appName": "myservice",
    "packageName": "com.mycompany.myservice",
    "sql": true,
    "databaseType": "postgresql",
    "dbMigrationTool": "flywaydb",
    "features": [],
    "buildTool": "gradle",
    "packageFolder": "com/mycompany/myservice",
    "...": "...",
    "...": "..."
  }
}
```

We can also use **this.config.set()** to specify one key-value pair or an object of multiple keys/values.
Note that **save()** method is automatically called whenever we call **this.config.set()**.

Now we can use **this.config.getAll()** to load the configuration from **.yo-rc.json** file.

**generators/entity/index.js**

```js
module.exports = class extends Generator {
    ...
    ...
    writing() {
        const userConfig = this.config.getAll();
        if(userConfig.dbMigrationTool === "flywaydb") {
            //do something
        }
    }
}
```

We can also pass **Arguments** and **Options** to the generator. For example for entity sub-generator we want to pass mandatory **entityName** as an argument and optional **table-name** as an argument.

**generators/entity/index.js**

```js
module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.configOptions = this.options.configOptions || {};

        this.argument("entityName", {
            type: String,
            required: true,
            description: "Entity name"
        });

        this.option('table-name', {
            type: String,
            desc: "Table name"
        })
    }

    writing() {
        const entityName = this.options.entityName;
        const tableName = this.options.tableName;
        ....
        ...
    }
}
```

Now we can invoke entity sub-generator from within the generated application directory as follows:

```bash
myservice> yo springboot:entity Person --table-name persons
```

### Testing Yeoman generator

We can also unit test yeoman generators by using **mocha**, **yeoman-test** and **yeoman-assert** packages.

**package.json**

```json
{
  "name": "generator-springboot",
  "version": "0.0.6",
  "description": "A Yeoman generator for generating SpringBoot microservices",
  ...
  ...
  "scripts": {
    "test": "npm run test:unit -- test/**/*.spec.js test/*.spec.js --no-insight",
    "test:unit": "mocha --timeout 30000 --slow 0 --reporter spec"
  },
  ...
  ...
  "devDependencies": {
    "fs-extra": "7.0.1",
    "mocha": "6.1.4",
    "sinon": "7.2.5",
    "yeoman-assert": "3.1.1",
    "yeoman-test": "1.9.1"
  }
}

```

We can write unit test to invoke a generator using **yeoman-test** as follows:

**generator-springboot/test/microservice.spec.js**

```js
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("SpringBoot Microservice Generator", () => {
  describe("Generate minimal microservice with Maven", () => {
    before(done => {
      helpers
        .run(path.join(__dirname, "../generators/microservice"))
        .withPrompts({
          appName: "mymicroservice",
          packageName: "com.mycompany.mymicroservice",
          packageFolder: "com/mycompany/mymicroservice",
          sql: false,
          buildTool: "maven"
        })
        .on("end", done);
    });

    it("creates expected default files for minimal microservice", () => {
      assert.file("pom.xml");
    });
  });
});
```
Of course here I am doing a simple sanity check of whether pom.xml is generated or not. We can test much more if we want to.

Now we can run tests using `npm run test`.

I think we have covered sufficient ground to start building a Yeoman generator.

For reference please checkout my github repository https://github.com/sivaprasadreddy/generator-springboot.
