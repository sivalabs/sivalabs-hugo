---
title: Fullstack developer, T-shaped developer and everything in-between
author: Siva
images: ["/preview-images/team.webp"]
type: post
draft: true
date: 2020-11-29T04:59:17+05:30
url: /2020/11/fullstack-developer-and-tshaped-developer-and-everything-in-between/
categories:
  - Thoughts
tags: [Thoughts]
---

In software development circles "Fullstack Developer" is one thing that we keep hearing quite often.
So, what do we mean by "Fullstack Developer"?? 
For many people, a "Fullstack Developer" is someone who can work all aspects of an application including Front-End and Back-End.
In the recent times, people start including Infrastructure/DevOps also part of "Fullstack Developer" package.

Some people define a "Fullstack Developer" is a T-shaped developer where they have expert level knowledge on few technologies and good enough knowledge on many other things.
IMO, this is a decent definition of "Fullstack Developer" and this is how I imagine when someone say there are "Fullstack Developer". 

Conspiracy:
Deep down somehow I feel "Fullstack Developer" is a term coined by some super smart people who want developers to work on everything voluntarily by giving special title.
The interesting thing is you can't deny the reasons they give, such as we don't want to work in silos, 
we should be able to take a story and implement it end-to-end with full context on what the story is about etc.
I fully agree with these reasons because they are all valid reasons. I wish what they say openly in public is what is really on their minds. 

Who wants to work on both FrontEnd and Back-End?

Who want to become a "Fullstack Developer"?

Couple of days ago I came across this interesting tweet:

{{< tweet user="sivalabs" id="1332565384906629120" >}}

To which I replied:

{{< tweet user="sivalabs" id="1332611594686058496" >}}

Ohhhh... that's a big list of buzzwords, isn't it!!!

There is more...

{{< tweet user="sivalabs" id="1332624250230898688" >}}

As always I see mixed responses on Twitter. Many people can correlate their experience with me as it is a pretty standard tech stack for a typical Java/SpringBoot application.
Some people misunderstood it as if "I am an Intern, and I am saying I know all these technologies" or "I am saying an Intern should know all these technologies".
I wish people read both question and answer before commenting, but who has time.

But, I got curious and think of are these too many things for a person to learn?? I would say No.

First of all, I am not an intern and I have total of 14+ years of experience, and I have learned all those technologies over the course of 14 years.

For a typical SpringBoot application using "Java 11, SpringBoot, JPA/Hibernate, JUnit, Postgesql, Gradle/Maven, IntellijIDEA" shouldn't be a surprise.

I don't think a software developer needs to explicitly tell they use Git and probably they might be using GitHub/BitBucket/GitLab..it shouldn't be a surprise either.

I use Markdown for writing project README files, personal notes etc. I have used Markdown/Asciidoctor for writing my SpringBoot : Learn By Example book.
Even the blog that you are reading now is built using GoHugo and Markdown.

Postman is the most popular tool used by API developers for testing. I am so fascinated by Postman's features, and I wrote an article on how to use Postman effectively.

Docker has changed the way we build and run applications for sure. 
For the last 5 years I have been using Docker and docker-compose for various purposes like running applications locally, running integration tests and running SpringBoot app as Container on AWS ECS.
If you are relying on Docker for running integration tests then most likely you might have been using Testcontainers...if not then you should be.
While using AWS services like S3, SQS etc it is quite common to use Localstack docker container for running integration tests. 
After writing the same boilerplate Localstack configuration again and again, I got tired and even created a SpringBoot Localstack Starter.

Jenkins is the most popular build server and I have been using Jenkins before Jenkinsfile was a thing.
Then came along the Infrastructure As Code movement, Build Pipelines, and I learned how to write Jenkins pipelines using both scripted and declarative approaches. 
Again, I got tired of writing same Jenkinsfile again and again, so I learned about Jenkins Shared Libraries. I have created small reusable Shared Library to use with Maven based projects too.
Out of curiosity, I even learned how to run Jenkins server with multiple agents and using Docker containers as Agents. 

In the recent years many companies leveraging cloud platforms for their infrastructure instead of managing their own datacenters and AWS is the most popular cloud platform.
Until last year I am not familiar with AWS very much and I started learning AWS concepts for an official project work.
It was really overwhelming...VPCs, subnets, route tables, internet gateway, security groups, interface adopters, regions, availability zones, Load balancers, AutoScaling Groups etc.
It took 3 months to get some basic understanding of these concepts. Once I got some idea of these core AWS concepts and practiced what I learned through AWS Admin Console.
After that I learned some basics of infrastructure provisioning using CloudFormation, didn't like CloudFormation much. Then tried Terraform, felt it is better than CloudFormation.

Recently for our last projects we evaluated Terraform, Pulumi and CDK for infrastructure provisioning and picked Pulumi as most of the team members liked it.
I have implemented the Pulumi based infrastructure code to provision AWS ECS Cluster, S3 bucket, SQS queues, RDS and deploy SpringBoot app as docker container.

I am certainly not a DevOps expert to create a highly scalable, multi-region fault-tolerant architecture on AWS with DR support, but I can say I know my way around AWS now.

Front-End development is the most difficult part for me. When I started my career it was simply HTML, CSS, JavaScript and jQuery.
But today's front-End development is totally different. From time to time I try to keep myself update at-least on basics on modern web development stuff.
When AngularJS 1 was hot I got excited and learned a bit about, wrote few posts as well. 

After that learned some basics of ReactJS, ReactRouter, Redux. Personally I like VueJS more than ReactJS as VueJS looks to me like best of AngularJS and ReactJS.
For a short period I worked with NodeJS(Express) and it didn't feel difficult to learn.

For one of our client we were building SpringBoot based microservices and deploying on Pivotal CloudFoundry (PCF).
I have created a small NodeJS based utility using InquireJS to deploy different services in different org/space.
I liked it so much that I thought of automating SpringBoot application creation as per my needs and created a Yeoman Based SpringBoot application Generator, and I have blogged about it as well.



