---
title: SpringBoot application deployment and monitoring series - Part 2 - Build Server Setup using Jenkins
author: Siva
images: ["/preview-images/jenkins-setup.webp"]
type: post
draft: false
date: 2021-03-10T04:59:17+05:30
url: /2021/03/springboot-application-deployment-monitoring-part-2-jenkins-setup/
categories: [SpringBoot]
tags: [SpringBoot, DevOps, Jenkins, Vagrant]
---

This is the 2nd part of our [journey to learn SpringBoot application deployment and monitoring series]({{< relref "2021-02-26-application-deployment-monitoring-series.md" >}}).
We are going to setup [Jenkins](https://www.jenkins.io/) build server and configure Pipelines for **vote-service, bookmark-service and bookmarks-ui** microservices.

In this article we are going to learn:
* Implementing build pipeline using **Jenkins Pipeline as Code**
* Using **Jenkins Shared Libraries**
* Setting up pipelines using **Job DSL** 

You can find the GitHub repositories below:
* **devops-setup** https://github.com/sivaprasadreddy/devops-setup
* **bookmark-service** https://github.com/sivaprasadreddy/bookmark-service
* **vote-service** https://github.com/sivaprasadreddy/vote-service
* **bookmarks-ui** https://github.com/sivaprasadreddy/bookmarks-ui

There are many ways to setup Jenkins server such as 
* [Run jenkins.war](https://www.jenkins.io/doc/book/installing/war-file/) locally or in a VM
* Install [Jenkins as a service](https://www.jenkins.io/doc/book/installing/linux/)
* Run [Jenkins using docker](https://www.jenkins.io/doc/book/installing/docker/)
* Run [Jenkins on Kubernetes](https://www.jenkins.io/doc/book/installing/kubernetes/) with high availability settings

Here, in this article my main focus will be on how to write Jenkins pipelines, some good practices etc...not on Jenkins server configuration itself.
So, we are going to follow a simple approach for Jenkins server setup. 
We will use [Vagrant](https://www.vagrantup.com/) to create a VM, install required softwares and run jenkins as WAR file.

## Create Ubuntu VM using Vagrant

Create directory structure as follows:

```shell
jenkins-setup/
|____provision.sh
|____Vagrantfile
|____install-jenkins.sh
```
We are going to create Ubuntu VM using VirtualBox and Vagrant with following **Vagrantfile**.

The **Vagrantfile** is as follows:

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/bionic64"
  config.vm.hostname = "jenkins-server"
  
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network "forwarded_port", guest: 9999, host: 9999

  config.vm.provider "virtualbox" do |vb|
     vb.name = "jenkins-server"
     vb.memory = "2048"
  end

  config.vm.provision "shell", path: "provision.sh"
end
```

The `Vagrantfile` is very simple and sort of self descriptive. Let me give a brief just in case you are not familiar:
* We are creating VM from `hashicorp/bionic64` base box
* We are giving a private IP `192.168.33.10` to this VM
* We are mapping guest VM's 9999 port on to host 9999 port
* We are allocating 2GB RAM for this VM
* Once the VM is created we are executing **provision.sh** shell script to install the required software.

Now let us see how **provision.sh** looks like:

```shell
#!/usr/bin/env bash

sudo apt-get update

DEVOPSGROUP="devopsteam"
USERNAME="siva"
PASSWORD="secret123"

groupadd ${DEVOPSGROUP}
echo "%${DEVOPSGROUP} ALL=(ALL:ALL) ALL" >> /etc/sudoers
useradd -m -p $(openssl passwd -1 ${PASSWORD}) -s /bin/bash -G ${DEVOPSGROUP} ${USERNAME}

# Install docker
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common --yes
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io --yes
sudo usermod -aG docker ${USERNAME}

# Install ansible
sudo apt-get install software-properties-common
sudo apt-add-repository --yes --update ppa:ansible/ansible
sudo apt install ansible --yes

# Install openjdk-11-jdk
sudo apt-get update
sudo apt-get install openjdk-11-jdk --yes
echo "export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" >> "$HOME/.bashrc"
```

Again this script is self descriptive.

* We are creating a group called **devopsteam** and adding sudo privileges to it.
* We are creating a new use **siva** and assigning to **devopsteam** group.
* We are installing docker and adding user **siva** to **docker** group so that **siva** can perform docker operations.
* We are installing ansible, JDK 11 and configured JAVA_HOME environment variable.

> We have hardcoded the username and password in the script itself which is a bummer. DON'T DO THAT in your real work.
> We can have those values in another file which is not checked into VCS and source them. Also, we can add validation 
> to check the existence of those values before proceeding.

Now go into **jenkins-setup** folder where you have **Vagrantfile** and run **vagrant up**.
It will create the VM and install the required softwares.

Once the VM creation is done, you can ssh into VM from your host: `ssh siva@192.168.33.10`.
We can simply download Jenkins.war file and run using **java -jar** command. 

Instead of running it using adhoc commands let's have **install_jenkins.sh** script as follows:

```shell
#!/usr/bin/env bash

WORKDIR="$HOME/apps"
mkdir -p $WORKDIR
cd $WORKDIR
wget https://get.jenkins.io/war-stable/2.263.4/jenkins.war

nohup java -jar jenkins.war --httpPort=9999 > jenkins.log &
echo "$!" > jenkins.pid
```

We are downloading Jenkins.war and running it using `java -jar` as background process and writing down the PID into jenkins.pid file.

Now you should be able to access Jenkins at either http://192.168.33.10:9999/ or http://localhost:9999/.
After entering the generated password we will be redirected to Plugin installation screen where we can choose to install suggested plugins, 
then create an admin user.

Now we have a working Jenkins server ready to use.

### Install and configure pipeline prerequisites
We need to install some plugins that we are going to use in our pipelines.
* [HTML Publisher](https://plugins.jenkins.io/htmlpublisher/) To publish JaCoCo (or any other HTML) reports
* [Docker Pipeline](https://plugins.jenkins.io/docker-workflow/) To push docker images to DockerHub or any other Docker Registry

Let us configure credentials for Git repository and DockerHub.

* Manage Jenkins --> Manage Credentials --> Under "Stores scoped to Jenkins" global --> Add Credentials
* Select Kind "Username with password", Scope "Global(Jenkins, nodes, items, all child items, etc)"
* Provide username and password for git repository
* Give ID as **github-credentials** and provide description and click on Ok.

In the same way add DockerHub credentials with ID **dockerhub-credentials**.

## Jenkins pipeline for vote-service
Let's create Jenkins pipeline configuration using **Jenkinsfile** (Infrastructure as Code yaaay!!!).

```groovy
#!groovy

def DOCKER_USERNAME = 'sivaprasadreddy'
def DOCKER_IMAGE_NAME = 'vote-service'

node {

    try {
        stage('Checkout') {
            checkout scm
        }

        stage('Build') {
            try {
                sh './mvnw clean verify'
            } finally {
                junit allowEmptyResults: true, testResults: 'target/test-results/test/*.xml'
                junit allowEmptyResults: true, testResults: 'target/test-results/integrationTest/*.xml'
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'target/jacoco/test',
                    reportFiles          : 'index.html',
                    reportName           : "Jacoco Unit Test Report"
                ])
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'target/jacoco/integrationTest',
                    reportFiles          : 'index.html',
                    reportName           : "Jacoco Integration Test Report"
                ])
            }
        }

        stage('Publish Docker Image') {
            sh "./mvnw spring-boot:build-image -DskipTests -Dspring-boot.build-image.imageName=${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
            if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main') {
                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                    echo "Publishing to dockerhub DOCKER_USERNAME=${DOCKER_USERNAME}, APPLICATION_NAME=${DOCKER_IMAGE_NAME}"
                    def appImage = docker.build("${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}")
                    appImage.push()
                    appImage.push('latest')
                }
            } else {
                echo "Skipping Publish Docker Image"
            }
        }

    }
    catch(err) {
        echo "ERROR: ${err}"
        currentBuild.result = currentBuild.result ?: "FAILURE"
    }
}
```
We are checking out the code, running maven build by executing unit and integration tests and publishing the generated JaCoCo reports.
Then we are building a docker image using SpringBoot's buildpacks support and if it is `main` or `master` branch we are pushing it to DockerHub.
Easy-peasy.

Add `Jenkinsfile` to the root of `vote-service` and commit it.

Now head over to Jenkins and click on **New Item**, enter **vote-service** as name and select **Multibranch pipeline** and click OK.

* Under Branch Sources --> Add source --> select Git.
* Project Repository: https://github.com/sivaprasadreddy/vote-service.git
* Credentials: select github-credentials
* Under "Build Configuration" --> Mode: **By Jenkinsfile** and Script Path: **Jenkinsfile**
* Under Scan Multibranch Pipeline Triggers section, select "Periodically if not otherwise run" and set Interval as 5 minutes
* Optionally we can configure Orphaned Item Strategy by selecting "Discard old items", Days to keep old items: 7, Max # of old items to keep: 10

Click on Save.

Now the vote-service pipeline will scan the repository and create a build pipeline for each branch.

Good, we are done with **vote-service** pipeline setup, next setup **bookmark-service** pipeline.

## Jenkins pipeline for bookmark-service
Well, you know the drill right. Copy-paste vote-service's Jenkinsfile into bookmark-service and change any content if necessary.
And luckily there is only one thing to change ie DOCKER_IMAGE_NAME, change it's value to "bookmark-service" and we are done.

We can follow the same procedure to create Multibranch pipeline to setup for bookmark-service as well.

### Is this approach ok?
Hold on for a minute. Don't you see some problems with this approach? I see 2 problems:
1. We are copy-pasting lot of same code with few tweaks here and there.
2. Setting up Job still involves lots of manual steps.

### Solution
Instead of copy-pasting same pipeline code for each project can't we refactor this into some reusable functions?
Of course, we can, that's what [Jenkins Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/) are for.

And, what about manual Pipeline setup? If we have to setup same jobs on a different Jenkins server in a different environment we need to perform lots of manual steps.
To avoid this we can use [Job DSL Plugin](https://plugins.jenkins.io/job-dsl/) and create a Seed Job which configures other jobs.

## Creating Jenkins Shared Library
If you look at our Jenkinsfile we can see that we are performing some actions at different stages which can be refactored as functions, after all it is simply groovy code.
We can create a separate git repository(jenkins-shared-library) and implement our reusable actions as functions.

I have created https://github.com/sivaprasadreddy/jenkins-shared-library in which I have `src/com/sivalabs/JenkinsMavenLib.groovy` as follows:

```groovy
package com.sivalabs

class JenkinsMavenLib implements Serializable {

    // pipeline global properties
    def steps
    def env
    def params
    def scm
    def currentBuild

    JenkinsMavenLib(steps, scm, env, params, currentBuild) {
        this.steps = steps
        this.scm = scm
        this.env = env
        this.params = params
        this.currentBuild = currentBuild
    }

    def checkout() {
        steps.checkout scm
    }

    def runTests() {
        try {
            steps.sh './mvnw clean verify'
        } finally {
            steps.junit allowEmptyResults: true, testResults: 'target/test-results/test/*.xml'
            steps.junit allowEmptyResults: true, testResults: 'target/test-results/integrationTest/*.xml'
            steps.publishHTML(target:[
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'target/jacoco/test',
                    reportFiles: 'index.html',
                    reportName: "Jacoco Unit Test Report"
            ])
            steps.publishHTML(target:[
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'target/jacoco/integrationTest',
                    reportFiles: 'index.html',
                    reportName: "Jacoco Integration Test Report"
            ])
        }
    }

    def buildSpringBootDockerImage(dockerUsername, dockerImageName) {
        steps.sh "./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=${dockerUsername}/${dockerImageName}:${env.BUILD_NUMBER}"
    }

    def buildDockerImageFromDockerfile(dockerUsername, dockerImageName) {
        steps.docker.build("${dockerUsername}/${dockerImageName}:${env.BUILD_NUMBER}")
    }

    def publishDockerImage(dockerUsername, dockerImageName, additionalTags = []) {
        steps.docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
            def appImage = steps.docker.image("${dockerUsername}/${dockerImageName}:${env.BUILD_NUMBER}")
            appImage.push()
            additionalTags.each {
                appImage.push("$it")
            }
        }
    }
}
```

In order to reuse these share library functions in our pipeline, first we need to configure Shared Library in Jenkins server.

* Go to **Manage Jenkins -> Configure System**
* In **Global Pipeline Libraries** Section
    * Library Name: jenkins-shared-library
    * Default version: master
    * Check "Allow default version to be overridden", "Include @Library changes in job recent changes"
    * Retrieval method: "Modern SCM"
    * Source Code Management: Git, Project Repository: "https://github.com/sivaprasadreddy/jenkins-shared-library.git"

Now let's update our Jenkinsfile to use shared library.

```groovy
#!groovy
@Library('jenkins-shared-library')
import com.sivalabs.JenkinsMavenLib

def dockerUsername = 'sivaprasadreddy'
def dockerImageName = 'vote-service'

def project = new JenkinsMavenLib(this, scm, env, params, currentBuild)

node {

    try {
        stage("Checkout") {
            project.checkout()
        }
        stage("Build") {
            project.runTests()
        }
        stage("Publish Docker Image") {
            project.buildSpringBootDockerImage(dockerUsername, dockerImageName)
            if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main') {
                def tags = ["latest"]
                project.publishDockerImage(dockerUsername, dockerImageName, tags)
            }
        }
    }
    catch(err) {
        echo "ERROR: ${err}"
        currentBuild.result = currentBuild.result ?: "FAILURE"
    }
}
```

Nice, looks better than earlier version. Looks like a high-level function to me delegating the low-level tasks 
into private functions so that I can only dig into whatever is interested to me.

In fact, we can even make it more concise if we have stage definition also in shared library function as follows:

```groovy
def checkout() {
    steps.stage("Checkout") {
        steps.checkout scm
    }
}
```

In this way our Jenkinsfile could become even more concise as follows:

```groovy
#!groovy
@Library('jenkins-shared-library')
import com.sivalabs.JenkinsMavenLib

def dockerUsername = 'sivaprasadreddy'
def dockerImageName = 'vote-service'

def project = new JenkinsMavenLib(this, scm, env, params, currentBuild)

node {
    try {
        project.checkout()
        project.runTests()
        project.buildSpringBootDockerImage(dockerUsername, dockerImageName)
        project.publishDockerImage(dockerUsername, dockerImageName)
    }
    catch(err) {
        echo "ERROR: ${err}"
        currentBuild.result = currentBuild.result ?: "FAILURE"
    }
}
```

However there is a catch. This works fine with **Scripted Pipelines** but not with **Declarative Pipelines**.
We can't have **stage** definitions in shared library functions while using with Declarative pipeline script.
That's why I have the core functionality only in shared library functions so that these functions can be used from scripted and declarative pipelines as well.

For example we can have Declarative pipeline using those shared library functions as follows:

```groovy
#!groovy
@Library('jenkins-shared-library')
import com.sivalabs.JenkinsMavenLib

def project = new JenkinsMavenLib(this, scm, env, params, currentBuild)

pipeline {
    agent any

    stages {
        stage("Checkout") {
            steps {
                script {
                    project.checkout()
                }
            }
        }
        stage("Test") {
            steps {
                script {
                    project.runTests()
                }
            }
        }
    }
}
```
While using Declarative pipelines we need to put shared library function invocations inside `script { }` blocks.

Now we can create pipelines for **bookmark-service** and **bookmarks-ui** services also using shared libraries.
Yeah, still there is a bit of copy-pasting but comparatively better than before. 

> If you want to improve it further I would suggest you to take a look at [Jenkins Templating Engine](https://www.jenkins.io/blog/2019/05/09/templating-engine/).
> If you want to try out JTE check https://boozallen.github.io/sdp-docs/jte/1.7.1/index.html

As we solved problem# 1, next move on to problem#2.

## Setting up pipelines using Job DSL Seed Job

As mentioned earlier setting up a pipeline for a job involves some manual step where 
we need to provide git url, Branch configuration, Orphaned Item Strategy etc. Imagine if you have to do this for 50 services.
Imagine you have one Jenkins server for non-prod environments, and a separate Jenkins server for prod environment and you have to configure same jobs again...lots of tedious work.

We can use Jenkins **Job DSL Plugin** to automate the process of configuring pipelines using a Seed Job.

First install [Job DSL Plugin](https://plugins.jenkins.io/job-dsl/) and 
explore the Job DSL API https://jenkinsci.github.io/job-dsl-plugin/# to know what are all the things we can automate using DSL.

In our case we want to automate setting up pipelines for **vote-service**, **bookmark-service** and **bookmarks-ui**.

Let's write simple groovy script using Job DSL to setup jobs as follows:

```groovy
gihubCredentialsId = 'github-credentials'
repos = [
  ['1234567890','vote-service', 'https://github.com/sivaprasadreddy/vote-service.git'],
  ['1234567891','bookmark-service', 'https://github.com/sivaprasadreddy/bookmark-service.git'],
  ['1234567892','bookmarks-ui', 'https://github.com/sivaprasadreddy/bookmarks-ui.git']
]

for (repo in repos) {
  multibranchPipelineJob(repo[1]) {
      branchSources {
          git {
              id(repo[0])
              remote(repo[2])
              credentialsId(gihubCredentialsId)
          }
      }
    triggers {
      periodicFolderTrigger {
        interval("15")
      }
    }
      orphanedItemStrategy {
          discardOldItems {
              daysToKeep(7)
              numToKeep(10)
          }
      }
  }
}
```
If you take a look at the script it is nothing but DSL representation of what manual steps we did while setting up **vote-service**.

Now we can create a Seed Job as follows:

* Click on **New Item** -> Enter name as **SeedJob** and Select **FreeStyle project** and click ok.
* Go to Build --> Add build step --> Process Job DSLs --> Select "Use the provided DSL script" and put the above seed job script in DSL Script textarea.
* Save and click on **Build Now**.

It should create the pipelines for all **vote-service, bookmark-service and bookmarks-ui** services.

Automate everything....yay...

This SeedJob groovy script is doing very simple thing by looping through our repositories metadata and setting up pipelines.
You can even take one step further by using Git API get all the repositories of your Org/User account and 
setup pipelines instead of manually configuring each repository statically.  

## Summary 
I hope we learned few good practices about using Jenkins pipelines such as using Shared Libraries, Jod DSL.
We have automated the pipeline setup for all **vote-service, bookmark-service and bookmarks-ui** services. 

In next article we are going to focus on running the services using docker-compose.
