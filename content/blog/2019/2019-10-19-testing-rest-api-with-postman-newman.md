---
title: Testing REST APIs using Postman and Newman
author: Siva
images:
  - /preview-images/postman.webp
type: post
date: 2019-10-20T02:29:17.000Z
url: /blog/testing-rest-apis-with-postman-newman/
categories:
  - Testing
tags:
  - postman
  - newman
  - testing
aliases:
  - /testing-rest-apis-with-postman-newman/
---

[**Postman**](https://www.getpostman.com/) is the most popular tool for testing REST APIs.
I guess most of the developers are familiar with how to use Postman to send various types (GET, POST, PUT, DELETE, etc) of HTTP requests 
with various types of payloads (form data, JSON etc).

<!--more-->


In addition to triggering one API request and verifying the response, I frequently come across some common needs like

* Call an API and assert response
* Parameterize variables based on the environment
* Trigger a series of API calls to simulate some user flow
* Trigger one API request with different inputs and assert expected response
* Load test by simulating load on the server by firing a series of requests repeatedly with a certain delay
* Run Postman collection to do Smoke Test from Build Pipeline

As I am already using Postman to test my REST APIs, I thought of exploring if I can do all these tasks using Postman itself and it turns out I can.

So, I wanted to share a few Postman tips I learned.

> I am using Postman to test my REST API implemented using **SpringBoot** and secured with **Spring Security JWT based authentication**.
You can find the source code of this article at https://github.com/sivaprasadreddy/todo-list/tree/master/todo-api-spring-boot. 
>
> The Postman collection files are at https://github.com/sivaprasadreddy/todo-list/tree/master/config/postman

While searching for is there a way to run postman collection programmatically 
I come across [Newman](https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman/) 
which is a command-line Collection Runner for Postman. Newman is built on NodeJS and we can install it globally to use it.

```bash
$ npm install -g newman
$ newman run mycollection.json
```

Or we can use Newman npm package as a library as mentioned here https://www.npmjs.com/package/newman#using-newman-as-a-library.

Ok, enough talk. Lets get to the business.

First, open Postman and create a new collection, say "todolist-api".

## 1. Call an API and assert response
We want to make a call to SpringBoot Actuator Health endpoint and verify the HTTP Status Code and assert **status** is **UP**.

Add a new request with URL http://localhost:8080/actuator/health with GET method.
In the **Headers** tab add **Content-Type** header with **application/json** value.

In **Tests** tab add the following code:

```javascript
pm.test("Check Application Health", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("UP");
});
```

Here we are using Postman API to retrieve the response and verify the HTTP status code to be 200.
Also, the expected JSON response from **/actuator/health** request is to have **{"status": "UP"}**. 
So we are asserting whether the JSON response field **status** is equal to **UP**.

We can just hit Send button and see the Response body and you can also see in **Test Results** tab that test is passed.

We can also run all the Requests (I know we have only one right now) by clicking on the Play button next to Collection name and Run.
It will open up the collection runner window and show all the tests available to run. 
We can Select/Deselect requests and click on Run button to run the tests.

#### Running Postman collection using Newman

In Postman click on 3 dots next to Collection name and export the Collection as a json file.
Let's say the collection json file name is **todolist.postman_collection.json**.

We can run the collection using Newman as follows:

```bash
$ newman run todolist.postman_collection.json
```

You can see various options you can pass to newman 
at https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman/#options

## 2. Trigger a series of API calls to simulate some user flow
Next, my requirement is user should be able to create a new Todo, update the newly created Todo and finally delete that Todo.
Even before doing all these users should be authenticated. 
As we are using JWT based authentication, upon successful login user will get an **access_token** and 
for each subsequent request user should send **access_token** as a Header.

Also, we need to capture the ID of newly created Todo, which is Auto generated primary key in DB, 
and use that ID for update todo and delete todo requests.

Now, add a new Request named **login** with URL http://localhost:8080/api/auth/login and POST method with following JSON Payload:

```json
{
	"username": "admin@gmail.com",
	"password": "admin"
}
```

If you hit Send button you can see the response as follows:

```json
{
    "access_token": "some long sequence of alphanumeric chars",
    "expires_in": 604800
}
```

![Postman Collection](/images/postman-collection.webp "Postman Collection")

We want to capture this **access_token** and pass it in the subsequent request. 
In order to do this, we need to run the requests in an environment so that we can set some variables in one request and reference them in further requests.

In Postman on the top right corner there is Environment dropdown, click on the gear icon and add a new environment called **todo-local-env**.

Now add the following code snippet in **Tests** tab of **login** request:


```javascript
pm.test("Authenticate user", function () {
    pm.response.to.have.status(200);
    var jsonData = JSON.parse(responseBody);
    pm.expect(jsonData.access_token).not.eq(undefined);
    postman.clearEnvironmentVariable("TodoApiAccessToken");
    postman.setEnvironmentVariable("TodoApiAccessToken", jsonData.access_token);
});
```

We are verifying whether the request is successful or not and setting the **TodoApiAccessToken** variable in the selected environment.

Now if you trigger the login request and see **todo-local-env**, you can find **TodoApiAccessToken** variable with the **access_token** value.

![Postman Environment Variables](/images/postman-env-vars.webp "Postman Environment Variables")

Now, create another request named **create-todo** with URL http://localhost:8080/api/todos and POST method with following JSON payload:

```json
{
	"text": "Write a new blog post"
}
```

In **Headers** tab add the Header with key **Authorization** and value as **Bearer {{TodoApiAccessToken}}**.
Here we are referring to the environment variable value using **{{variable_name}}** syntax.

In **Tests** tab add the following snippet:

```javascript
pm.test("Create New Todo", function () {
    pm.response.to.have.status(201);
    var jsonData = JSON.parse(responseBody);
    postman.clearEnvironmentVariable("todo_id");
    postman.setEnvironmentVariable("todo_id", jsonData.id);
});
```

Here we are capturing the new Todo's **id** value and setting environment variable **todo_id**.

Next, add the **update-todo** Request with URL http://localhost:8080/api/todos/{{todo_id}} and PUT method with following JSON payload:

```json
{
	"text": "Write a new blog post - updated"
}
```

We can add following snippet in **update-todo** request **Tests** tab:

```javascript
pm.test("Update Existing Todo", function () {
    pm.response.to.have.status(200);
});
```

Finally, we can add **delete-todo-by-id** request with URL http://localhost:8080/api/todos/{{todo_id}} and DELETE method.
add following snippet in **delete-todo-by-id** request **Tests** tab:

```javascript
pm.test("Delete Todo by Id", function () {
    pm.response.to.have.status(200);
    postman.clearEnvironmentVariable("todo_id");
});
```

Now we can run the entire collection as mentioned earlier which will 
[run all the requests in the order they appear in collection](https://learning.getpostman.com/docs/postman/collection_runs/starting_a_collection_run/).

> IMPORTANT: We should select the environment, **todo-local-env** in our case, to get the environment variables sharing to work. 

#### Running collection using Newman with environment
In order to run the collection using newman we need to export the collection and also our environment as well.

Click on **Manage Environments** gear icon on the top right corner and click on **Download Environment** icon for **todo-local-env** which will be downloaded as a json file. 

Lets name it as **todo-local-env.postman_environment.json**.

```bash
$ newman run todolist.postman_collection.json -e todo-local-env.postman_environment.json
```

### Organizing user flows 

We have created multiple requests (login, create-todo, update-todo, delete-todo) and run the collection as a single flow.
But in our real applications, there will be many different users flows with different behavior.

We can create folders within our collection representing the logical user flow and place the appropriate requests in that folder. 

Then, we can run the requests of a specific directory using newman as follows:

```bash
$ newman run todolist.postman_collection.json -e todo-local-env.postman_environment.json --folder todo-crud
```

## 3. Parameterize variables based on the environment
So far I am running my application locally and is accessible at http://localhost:8080/.
I could run my application in a docker container which is accessible at http://localhost:18080/.

Now if want to run my postman collection against the docker container instance I need to change base URL for all requests.
Instead of changing the URLs or any environment-specific parameters while switching between environments 
we can configure those values in different environments and use those values in request configurations.

Now click on **Manage Environments**, select **todo-local-env** and add a variable **base_url** with value **http://localhost:8080**.

Now change all the URLs from **http://localhost:8080/some-path** to **{{base_url}}/some-path**.

Next create a new environment called **todo-docker-env** and add variable **base_url** with value **http://localhost:18080**.

Now we can simply select the desired environment and run the collection. 

## 4. Trigger API request with different inputs and assert expected responses
We may also need to call an API endpoint with different inputs and verify responses such as perform login 
with valid and invalid credentials and assert the expected responses.

We can use **data files** to pass different inputs so that we don't have to change the request configuration.
We can pass data using JSON or CSV files.

For example, we can pass credentials using CSV file as follows:

**todo-credentials.csv**

```csv
email,password,expected_http_code
admin@gmail.com,admin.200
dummy@gmail.com,secret,401
```

The first row is a header with variable names.
We can use the placeholders in URL path or in the body as follows:

```json
{
	"username": "{{email}}",
	"password": "{{password}}"
}
```

In **Tests** tab we can refer data values using **data.variableName** as follows:

```javascript
pm.test("Authenticate user", function () {
    pm.response.to.have.status(data.expected_http_status_code);
}); 
```


```bash
$ newman run todolist.postman_collection.json -e local.postman_environment.json --folder authentication --data todo-credentials.csv
```

## 5. Load testing
I was trying to do a simple load testing of my API and I know I can use **Gatling** to do it.
But I just want a simple and quick solution. Turns out Postman provides that feature as well.

```bash
$ newman run todolist.postman_collection.json -e local.postman_environment.json -n 100 --delay-request 500
```

* The **-n** flag represents the **number of iterations to run**.
* The **--delay-request** represents **delay (in ms) between requests**.

## 6. Run Postman collection to do Smoke Test from Build Pipeline
We can create a Postman collection to perform smoke test after deploying the application.
We can simply install newman npm package and run the collection in our build pipeline.

You can checkout 

* [Integration with Travis CI](https://learning.getpostman.com/docs/postman/collection_runs/integration_with_travis/)
* [Integration with Jenkins](https://learning.getpostman.com/docs/postman/collection_runs/integration_with_jenkins/)

Thank you reading the article, your feedback is welcome. 
If you find this article useful please share it.
