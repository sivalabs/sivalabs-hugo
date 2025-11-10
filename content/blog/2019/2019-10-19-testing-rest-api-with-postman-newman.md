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
I guess most developers are familiar with how to use Postman to send various types (GET, POST, PUT, DELETE, etc.) of HTTP requests
with various types of payloads (form data, JSON, etc.).

<!--more-->


In addition to triggering one API request and verifying the response, I frequently come across some common needs, like:

*   Call an API and assert response
*   Parameterize variables based on the environment
*   Trigger a series of API calls to simulate some user flow
*   Trigger one API request with different inputs and assert expected response
*   Load test by simulating a load on the server by firing a series of requests repeatedly with a certain delay
*   Run a Postman collection to do a Smoke Test from a Build Pipeline

As I am already using Postman to test my REST APIs, I thought of exploring if I can do all these tasks using Postman itself, and it turns out I can.

So, I wanted to share a few Postman tips I've learned.

> I am using Postman to test my REST API implemented using **Spring Boot** and secured with **Spring Security JWT based authentication**.
> You can find the source code of this article at https://github.com/sivaprasadreddy/todo-list/tree/master/todo-api-spring-boot.
>
> The Postman collection files are at https://github.com/sivaprasadreddy/todo-list/tree/master/config/postman

While searching for a way to run a Postman collection programmatically,
I came across [Newman](https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman/),
which is a command-line Collection Runner for Postman. Newman is built on NodeJS, and we can install it globally to use it.

```bash
$ npm install -g newman
$ newman run mycollection.json
```

Or we can use Newman npm package as a library as mentioned here https://www.npmjs.com/package/newman#using-newman-as-a-library.

Ok, enough talk. Let's get to business.

First, open Postman and create a new collection, say "todolist-api".

## 1. Call an API and assert response
We want to make a call to Spring Boot Actuator Health endpoint and verify the HTTP Status Code and assert that the **status** is **UP**.

Add a new request with the URL http://localhost:8080/actuator/health with the GET method.
In the **Headers** tab, add a **Content-Type** header with the value **application/json**.

In **Tests** tab add the following code:

```javascript
pm.test("Check Application Health", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("UP");
});
```

Here, we are using the Postman API to retrieve the response and verify the HTTP status code to be 200.
Also, the expected JSON response from the **/actuator/health** request is to have **{"status": "UP"}**.
So we are asserting that the JSON response field **status** is equal to **UP**.

We can just hit the Send button and see the Response body, and you can also see in the **Test Results** tab that the test has passed.

We can also run all the Requests (I know we have only one for now) by clicking on the Play button next to the Collection name and Run.
It will open up the collection runner window and show all the tests available to run.
We can Select/Deselect requests and click on the Run button to run the tests.

#### Running Postman collection using Newman

In Postman, click on the 3 dots next to the Collection name and export the Collection as a JSON file.
Let's say the collection JSON file name is **todolist.postman_collection.json**.

We can run the collection using Newman as follows:

```bash
$ newman run todolist.postman_collection.json
```

You can see various options you can pass to newman 
at https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman/#options

## 2. Trigger a series of API calls to simulate some user flow
Next, my requirement is that a user should be able to create a new Todo, update the newly created Todo, and finally delete that Todo.
Even before doing all this, users should be authenticated.
As we are using JWT based authentication, upon successful login, the user will get an **access_token**, and
for each subsequent request, the user should send the **access_token** as a Header.

Also, we need to capture the ID of the newly created Todo, which is an auto-generated primary key in the DB,
and use that ID for update and delete todo requests.

Now, add a new Request named **login** with the URL http://localhost:8080/api/auth/login and the POST method with the following JSON Payload:

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

We want to capture this **access_token** and pass it in subsequent requests.
In order to do this, we need to run the requests in an environment so that we can set some variables in one request and reference them in subsequent requests.

In Postman, in the top right corner, there is an Environment dropdown; click on the gear icon and add a new environment called **todo-local-env**.

Now add the following code snippet in the **Tests** tab of the **login** request:


```javascript
pm.test("Authenticate user", function () {
    pm.response.to.have.status(200);
    var jsonData = JSON.parse(responseBody);
    pm.expect(jsonData.access_token).not.eq(undefined);
    postman.clearEnvironmentVariable("TodoApiAccessToken");
    postman.setEnvironmentVariable("TodoApiAccessToken", jsonData.access_token);
});
```

We are verifying whether the request is successful and setting the **TodoApiAccessToken** variable in the selected environment.

Now if you trigger the login request and look at **todo-local-env**, you can find the **TodoApiAccessToken** variable with the **access_token** value.

![Postman Environment Variables](/images/postman-env-vars.webp "Postman Environment Variables")

Now, create another request named **create-todo** with the URL http://localhost:8080/api/todos and the POST method with the following JSON payload:

```json
{
	"text": "Write a new blog post"
}
```

In the **Headers** tab, add a Header with the key **Authorization** and the value **Bearer {{TodoApiAccessToken}}**.
Here we are referring to the environment variable's value using the **{{variable_name}}** syntax.

In the **Tests** tab, add the following snippet:

```javascript
pm.test("Create New Todo", function () {
    pm.response.to.have.status(201);
    var jsonData = JSON.parse(responseBody);
    postman.clearEnvironmentVariable("todo_id");
    postman.setEnvironmentVariable("todo_id", jsonData.id);
});
```

Here we are capturing the new Todo's **id** value and setting the environment variable **todo_id**.

Next, add the **update-todo** Request with the URL http://localhost:8080/api/todos/{{todo_id}} and the PUT method with the following JSON payload:

```json
{
	"text": "Write a new blog post - updated"
}
```

We can add the following snippet in the **update-todo** request's **Tests** tab:

```javascript
pm.test("Update Existing Todo", function () {
    pm.response.to.have.status(200);
});
```

Finally, we can add a **delete-todo-by-id** request with the URL http://localhost:8080/api/todos/{{todo_id}} and the DELETE method.
Add the following snippet in the **delete-todo-by-id** request's **Tests** tab:

```javascript
pm.test("Delete Todo by Id", function () {
    pm.response.to.have.status(200);
    postman.clearEnvironmentVariable("todo_id");
});
```

Now we can run the entire collection as mentioned earlier, which will
[run all the requests in the order they appear in the collection](https://learning.getpostman.com/docs/postman/collection_runs/starting_a_collection_run/).

> IMPORTANT: We should select the environment, **todo-local-env** in our case, for the environment variable sharing to work.

#### Running collection using Newman with environment
In order to run the collection using Newman, we need to export the collection and also our environment.

Click on the **Manage Environments** gear icon in the top right corner and click on the **Download Environment** icon for **todo-local-env**, which will be downloaded as a JSON file.

Let's name it **todo-local-env.postman_environment.json**.

```bash
$ newman run todolist.postman_collection.json -e todo-local-env.postman_environment.json
```

### Organizing user flows 

We have created multiple requests (login, create-todo, update-todo, delete-todo) and have run the collection as a single flow.
But in our real applications, there will be many different user flows with different behaviors.

We can create folders within our collection representing a logical user flow and place the appropriate requests in that folder.

Then, we can run the requests of a specific folder using Newman as follows:

```bash
$ newman run todolist.postman_collection.json -e todo-local-env.postman_environment.json --folder todo-crud
```

## 3. Parameterize variables based on the environment
So far, I have been running my application locally, and it is accessible at http://localhost:8080/.
I could run my application in a Docker container, which is accessible at http://localhost:18080/.

Now, if I want to run my Postman collection against the Docker container instance, I need to change the base URL for all requests.
Instead of changing the URLs or any environment-specific parameters when switching between environments, we can configure those values in different environments and use those values in the request configurations.

Now click on **Manage Environments**, select **todo-local-env**, and add a variable **base_url** with the value **http://localhost:8080**.

Now change all the URLs from **http://localhost:8080/some-path** to **{{base_url}}/some-path**.

Next, create a new environment called **todo-docker-env** and add a variable **base_url** with the value **http://localhost:18080**.

Now we can simply select the desired environment and run the collection. 

## 4. Trigger API request with different inputs and assert expected responses
We may also need to call an API endpoint with different inputs and verify responses, such as performing a login with valid and invalid credentials and asserting the expected responses.

We can use **data files** to pass different inputs so that we don't have to change the request configuration.
We can pass data using JSON or CSV files.

For example, we can pass credentials using a CSV file as follows:

**todo-credentials.csv**

```csv
email,password,expected_http_code
admin@gmail.com,admin.200
dummy@gmail.com,secret,401
```

The first row is a header with variable names.
We can use the placeholders in the URL path or in the body as follows:

```json
{
	"username": "{{email}}",
	"password": "{{password}}"
}
```

In the **Tests** tab, we can refer to data values using **data.variableName** as follows:

```javascript
pm.test("Authenticate user", function () {
    pm.response.to.have.status(data.expected_http_status_code);
}); 
```


```bash
$ newman run todolist.postman_collection.json -e local.postman_environment.json --folder authentication --data todo-credentials.csv
```

## 5. Load testing
I was trying to do some simple load testing of my API, and I know I can use **Gatling** to do it.
But I just wanted a simple and quick solution. It turns out Postman provides that feature as well.

```bash
$ newman run todolist.postman_collection.json -e local.postman_environment.json -n 100 --delay-request 500
```

* The **-n** flag represents the **number of iterations to run**.
* The **--delay-request** represents the **delay (in ms) between requests**.

## 6. Run Postman collection to do Smoke Test from Build Pipeline
We can create a Postman collection to perform a smoke test after deploying the application.
We can simply install the Newman npm package and run the collection in our build pipeline.

You can checkout 

* [Integration with Travis CI](https://learning.getpostman.com/docs/postman/collection_runs/integration_with_travis/)
* [Integration with Jenkins](https://learning.getpostman.com/docs/postman/collection_runs/integration_with_jenkins/)

Thank you for reading the article; your feedback is welcome.
If you find this article useful, please share it.
