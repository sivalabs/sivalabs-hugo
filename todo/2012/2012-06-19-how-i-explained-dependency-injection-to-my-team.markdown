---
author: siva
comments: true
date: 2012-06-19 07:50:00+00:00
layout: post
slug: how-i-explained-dependency-injection-to-my-team
title: How I explained Dependency Injection to My Team
wordpress_id: 237
categories:
- Best Practices
- Design Patterns
- Java
- Spring
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
  
**Legacy(Bad) Approach:**  
  
Just create an AddressVerificationService class and implement the logic.   
  
Assume GoogleAddressVerificationService is a service provided by Google which takes Address as a String and Return longitude/latitude.   
  

    
    class AddressVerificationService <br></br>{<br></br>   public String validateAddress(String address)<br></br> {<br></br> GoogleAddressVerificationService gavs = new GoogleAddressVerificationService();<br></br>  String result = gavs.validateAddress(address);  <br></br>  return result;<br></br> }<br></br>}<br></br>

  
**Issues with this approach: **  
1. If you want to change your Address Verification Service Provider you need to change the logic.  
2. You can't Unit Test with some Dummy AddressVerificationService (Using Mock Objects)  
  
Due to some reason Client ask us to support multiple AddressVerificationService Providers and we need to determine which service to use at runtime.  
  
To accomidate this you may thought of changing the above class as below:   
  

    
    class AddressVerificationService<br></br>{<br></br>//This method validates the given address and return longitude/latitude details.<br></br> public String validateAddress(String address)<br></br> {<br></br>  String result = null;<br></br>  int serviceCode = 2; // read this code value from a config file<br></br>  if(serviceCode == 1)<br></br>  {<br></br>   GoogleAddressVerificationService googleAVS = new GoogleAddressVerificationService();<br></br>   result = googleAVS.validateAddress(address);<br></br>  } else if(serviceCode == 2)<br></br>  {<br></br>   YahooAddressVerificationService yahooAVS = new YahooAddressVerificationService();<br></br>   result = yahooAVS.validateAddress(address);<br></br>  }<br></br>  return result;<br></br> }<br></br>}<br></br>

  
**Issues with this approach: **  
**  
**  
1. Whenever you need to support a new Service Provider you need to add/change logic using if-else-if.  
2. You can't Unit Test with some Dummy AddressVerificationService (Using Mock Objects)  
  
** IOC/DI Approach: **  
  
In the above approaches AddressVerificationService is taking the control of creating its dependencies.  
So whenever there is a change in its dependencies the AddressVerificationService will change.  
  
Now let us rewrite the AddressVerificationService using IOC/DI pattern.      
  

    
     class AddressVerificationService<br></br> {<br></br>  private AddressVerificationServiceProvider serviceProvider;<br></br>  <br></br>  public AddressVerificationService(AddressVerificationServiceProvider serviceProvider) {<br></br>   this.serviceProvider = serviceProvider;<br></br>  }<br></br>  <br></br>  public String validateAddress(String address)<br></br>  {<br></br>   return this.serviceProvider.validateAddress(address);<br></br>  }<br></br> }<br></br> <br></br> interface AddressVerificationServiceProvider<br></br> {<br></br>  public String validateAddress(String address);<br></br> }<br></br> 

  
Here we are injecting the AddressVerificationService dependency AddressVerificationServiceProvider.  
  
Now let us implement the AddressVerificationServiceProvider with multiple provider services.      
  

    
     class YahooAVS implements AddressVerificationServiceProvider<br></br> {<br></br>  @Override<br></br>  public String validateAddress(String address) {<br></br>   System.out.println("Verifying address using YAHOO AddressVerificationService");<br></br>   return yahooAVSAPI.validate(address);<br></br>  }  <br></br> }<br></br><br></br> class GoogleAVS implements AddressVerificationServiceProvider<br></br> {<br></br>  @Override<br></br>  public String validateAddress(String address) {<br></br>   System.out.println("Verifying address using Google AddressVerificationService");<br></br>   return googleAVSAPI.validate(address);<br></br>  }<br></br> }<br></br> 

Now the Client can choose which Service Provider's service to use as follows:      
  

    
     AddressVerificationService verificationService = null;<br></br> AddressVerificationServiceProvider provider = null;<br></br> provider = new YahooAVS();//to use YAHOO AVS<br></br> provider = new GoogleAVS();//to use Google AVS<br></br> <br></br> verificationService = new AddressVerificationService(provider);<br></br> String lnl = verificationService.validateAddress("HitechCity, Hyderabad");<br></br> System.out.println(lnl);<br></br> 

  
For Unit Testing we can implement a Mock AddressVerificationServiceProvider.      
  

    
     class MockAVS implements AddressVerificationServiceProvider<br></br> {<br></br>  @Override<br></br>  public String validateAddress(String address) {<br></br>   System.out.println("Verifying address using MOCK AddressVerificationService");<br></br>   return "<response><longitude>123</longitude><latitude>4567</latitude>";<br></br>  }<br></br> }<br></br> <br></br> AddressVerificationServiceProvider provider = null;<br></br> provider = new MockAVS();//to use MOCK AVS  <br></br> AddressVerificationServiceIOC verificationService = new AddressVerificationServiceIOC(provider);<br></br> String lnl = verificationService.validateAddress("Somajiguda, Hyderabad");<br></br> System.out.println(lnl);<br></br> 

  
With this approach we elemenated the issues with above Non-IOC/DI based approaches.  
1. We can provide support for as many Provides as we wish. Just implement AddressVerificationServiceProvider and inject it.  
2. We can unit test using Dummy Data using Mock Implementation.      
  
  
**_So by following Dependency Injection principle we can create interface-based loosely-coupled and easily testable services._**  
**_  
_**
