---
title: How I explained Dependency Injection to My Team
author: Siva
type: post
date: 2012-06-19T02:20:00+00:00
url: /2012/06/how-i-explained-dependency-injection-to-my-team/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/06/how-i-explained-dependency-injection-to.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2908654414494391282
post_views_count:
  - 32
categories:
  - Design Patterns
tags:
  - Best Practices
  - Design Patterns
  - Java
  - Spring

---
Recently our company started developing a new java based web application and after some evaluation process we decided to use Spring.

But many of the team members are not aware of Spring and Dependency Injection principles.  
So I was asked to give a crash course on what is Dependency Injection and basics on Spring.

Instead of telling all the theory about IOC/DI I thought of explaining with an example.

**Requirement:** We will get some Customer Address and we need to validate the address.  
After some evaluation we thought of using Google Address Validation Service.

&nbsp;**Legacy(Bad) Approach:**

Just create an AddressVerificationService class and implement the logic. 

Assume GoogleAddressVerificationService is a service provided by Google which takes Address as a String and Return longitude/latitude. 

<pre>class AddressVerificationService <br />{<br />   public String validateAddress(String address)<br /> {<br /> GoogleAddressVerificationService gavs = new GoogleAddressVerificationService();<br />  String result = gavs.validateAddress(address);  <br />  return result;<br /> }<br />}<br /></pre>

**Issues with this approach:&nbsp;**  
&nbsp;1. If you want to change your Address Verification Service Provider you need to change the logic.  
&nbsp;2. You can&#8217;t Unit Test with some Dummy AddressVerificationService (Using Mock Objects)

&nbsp;Due to some reason Client ask us to support multiple AddressVerificationService Providers and we need to determine which service to use at runtime.

To accomidate this you may thought of changing the above class as below: 

<pre>class AddressVerificationService<br />{<br />//This method validates the given address and return longitude/latitude details.<br /> public String validateAddress(String address)<br /> {<br />  String result = null;<br />  int serviceCode = 2; // read this code value from a config file<br />  if(serviceCode == 1)<br />  {<br />   GoogleAddressVerificationService googleAVS = new GoogleAddressVerificationService();<br />   result = googleAVS.validateAddress(address);<br />  } else if(serviceCode == 2)<br />  {<br />   YahooAddressVerificationService yahooAVS = new YahooAddressVerificationService();<br />   result = yahooAVS.validateAddress(address);<br />  }<br />  return result;<br /> }<br />}<br /></pre>

**Issues with this approach:&nbsp;**  
**  
**  
1. Whenever you need to support a new Service Provider you need to add/change logic using if-else-if.  
&nbsp;2. You can&#8217;t Unit Test with some Dummy AddressVerificationService (Using Mock Objects)

**&nbsp;IOC/DI Approach:&nbsp;**

&nbsp;In the above approaches AddressVerificationService is taking the control of creating its dependencies.  
&nbsp;So whenever there is a change in its dependencies the AddressVerificationService will change.

&nbsp;Now let us rewrite the AddressVerificationService using IOC/DI pattern. 

<pre>class AddressVerificationService<br /> {<br />  private AddressVerificationServiceProvider serviceProvider;<br />  <br />  public AddressVerificationService(AddressVerificationServiceProvider serviceProvider) {<br />   this.serviceProvider = serviceProvider;<br />  }<br />  <br />  public String validateAddress(String address)<br />  {<br />   return this.serviceProvider.validateAddress(address);<br />  }<br /> }<br /> <br /> interface AddressVerificationServiceProvider<br /> {<br />  public String validateAddress(String address);<br /> }<br /> </pre>

Here we are injecting the AddressVerificationService dependency AddressVerificationServiceProvider.

Now let us implement the AddressVerificationServiceProvider with multiple provider services. 

<pre>class YahooAVS implements AddressVerificationServiceProvider<br /> {<br />  @Override<br />  public String validateAddress(String address) {<br />   System.out.println("Verifying address using YAHOO AddressVerificationService");<br />   return yahooAVSAPI.validate(address);<br />  }  <br /> }<br /><br /> class GoogleAVS implements AddressVerificationServiceProvider<br /> {<br />  @Override<br />  public String validateAddress(String address) {<br />   System.out.println("Verifying address using Google AddressVerificationService");<br />   return googleAVSAPI.validate(address);<br />  }<br /> }<br /> </pre>

Now the Client can choose which Service Provider&#8217;s service to use as follows: 

<pre>AddressVerificationService verificationService = null;<br /> AddressVerificationServiceProvider provider = null;<br /> provider = new YahooAVS();//to use YAHOO AVS<br /> provider = new GoogleAVS();//to use Google AVS<br /> <br /> verificationService = new AddressVerificationService(provider);<br /> String lnl = verificationService.validateAddress("HitechCity, Hyderabad");<br /> System.out.println(lnl);<br /> </pre>

For Unit Testing we can implement a Mock AddressVerificationServiceProvider. 

<pre>class MockAVS implements AddressVerificationServiceProvider<br /> {<br />  @Override<br />  public String validateAddress(String address) {<br />   System.out.println("Verifying address using MOCK AddressVerificationService");<br />   return "&lt;response&gt;&lt;longitude&gt;123&lt;/longitude&gt;&lt;latitude&gt;4567&lt;/latitude&gt;";<br />  }<br /> }<br /> <br /> AddressVerificationServiceProvider provider = null;<br /> provider = new MockAVS();//to use MOCK AVS  <br /> AddressVerificationServiceIOC verificationService = new AddressVerificationServiceIOC(provider);<br /> String lnl = verificationService.validateAddress("Somajiguda, Hyderabad");<br /> System.out.println(lnl);<br /> </pre>

With this approach we elemenated the issues with above Non-IOC/DI based approaches.  
&nbsp;1. We can provide support for as many Provides as we wish. Just implement AddressVerificationServiceProvider and inject it.  
&nbsp;2. We can unit test using Dummy Data using Mock Implementation. 

**_<span style="color: red; font-family: 'Trebuchet MS', sans-serif;">So by following Dependency Injection principle we can create interface-based loosely-coupled and easily testable services.</span>_**  
**_<span style="color: red; font-family: 'Trebuchet MS', sans-serif;"><br /></span>_**