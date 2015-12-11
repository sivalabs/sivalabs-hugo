---
author: siva
comments: true
date: 2015-12-07 13:17:45+00:00
layout: post
Url: jcart-configuring-https-ssltls
title: 'JCart: Configuring HTTPS SSL/TLS'
wordpress_id: 545
tags:
- jcart
- SpringBoot
---

So far our JCart application is running on Tomcat default port **8080** using **HTTP** protocol. In this article we will configure to use HTTPS by using Self Signed Certificate. For real projects you would have to buy certificate from a Trusted Authority.

I would like to run ShoppingCart site on **https://host:8443** and if anyone tries to access it from **http://host:8080** it should redirect to **https://host:8443**.
Similarly I would like to run Administration site on **https://host:9443** and if anyone tries to access it from **http://host:9090** it should redirect to https://host:9443.

With SpringBoot it is really very simple. See [http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-configure-ssl](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-configure-ssl)



<blockquote>You can simply follow this article [https://www.drissamri.be/blog/java/enable-https-in-spring-boot/](https://www.drissamri.be/blog/java/enable-https-in-spring-boot/) which describes what exactly we are trying to do. Thanks to Driss Amri. **Give credit where credit is due :-)**</blockquote>





_Just for the sake of completion I will mention the steps here._

First we need to generate Self Signed SSL certificate using the following command:


    
{{< highlight java >}}
keytool -genkey -alias jcartadmintomcat -storetype PKCS12 -keyalg RSA -keysize 2048 -keystore jcartadminkeystore.p12 -validity 3650
{{< /highlight >}}
    



It will ask you a series of questions. I gave **jcartadmin** as keystore password.


    
    
    Enter keystore password:
     Re-enter new password:
     What is your first and last name?
     [Unknown]:
     What is the name of your organizational unit?
     [Unknown]:
     What is the name of your organization?
     [Unknown]:
     What is the name of your City or Locality?
     [Unknown]:
     What is the name of your State or Province?
     [Unknown]:
     What is the two-letter country code for this unit?
     [Unknown]:
     Is CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
     [no]: yes
    



Once the keystore **jcartadminkeystore.p12** is generated copy it to **jcart-admin/src/main/resources** directory.

Now configure HTTPS in the **jcart-admin/src/main/resources/application-default.properties** as follows:


    
    
    server.port=9443
    server.ssl.key-store=classpath:jcartadminkeystore.p12
    server.ssl.key-store-password=jcartadmin
    server.ssl.keyStoreType=PKCS12
    server.ssl.keyAlias=jcartadmintomcat
    



To redirect from HTTP to HTTPS let us configure **TomcatEmbeddedServletContainerFactory ** bean in our **WebConfig.java**


    
{{< highlight java >}}
    
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{

	@Value("${server.port:9443}") private int serverPort;	
	....
	
	@Bean
	public EmbeddedServletContainerFactory servletContainer() 
	{
		TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory() 		{
			@Override
			protected void postProcessContext(Context context) {
				SecurityConstraint securityConstraint = new SecurityConstraint();
				securityConstraint.setUserConstraint("CONFIDENTIAL");
				SecurityCollection collection = new SecurityCollection();
				collection.addPattern("/*");
				securityConstraint.addCollection(collection);
				context.addConstraint(securityConstraint);
			}
		};

		tomcat.addAdditionalTomcatConnectors(initiateHttpConnector());
		return tomcat;
	}

	private Connector initiateHttpConnector() {
		Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
		connector.setScheme("http");
		connector.setPort(9090);
		connector.setSecure(false);
		connector.setRedirectPort(serverPort);

		return connector;
	}
}
{{< /highlight >}}    



Now you can start the Admin application and access **https://localhost:9443**. If you try to access **http://localhost:9090** then it should automatically redirect to **https://localhost:9443**. We can follow the same approach for generating keystore for ShoppingCart site as well.
