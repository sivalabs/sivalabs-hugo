---
title: 'JCart : Iteration-8'
author: Siva
type: post
date: 2015-12-31T11:37:10+00:00
url: /2015/12/jcart-iteration-8/
post_views_count:
  - 8
categories:
  - Java
tags:
  - jcart

---
In this Iteration#8 we will implement showing the Customer Account and Order History functionality in our ShoppingCart application.

  * Customer MyAccount Page 
    * Profile
    * Order History

Once the customer is logged in our system he can click on MyAccount link at the top of the header and view his profile details and order history.

First let us write the Controller handler method in our CustomerController to show myAccount details.

```java
@Controller
public class CustomerController extends JCartSiteBaseController
{  
  @Autowired private CustomerService customerService;
  ...
  ...  
  
  @RequestMapping(value="/myAccount", method=RequestMethod.GET)
  protected String myAccount(Model model)
  {
    String email = getCurrentUser().getCustomer().getEmail();
    Customer customer = customerService.getCustomerByEmail(email);
    model.addAttribute("customer", customer);
    List<Order> orders = customerService.getCustomerOrders(email);
    model.addAttribute("orders", orders);
    return "myAccount";
  }
}
```

Now create the myAccount.html view to render customer details and customer order history.

```xml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
  xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
  layout:decorator="layout/mainLayout">
<head>
<title>My Account</title>
</head>
<body>
<div layout:fragment="content">
  <div class="single-product-area">
    <div class="zigzag-bottom"></div>
    <div class="container">
      <div role="tabpanel">
        <ul class="customer-tab" role="tablist">
          <li role="presentation" class="active">
          <a href="#profile"
            aria-controls="profile" role="tab" data-toggle="tab">
            Customer Info</a></li>
          <li role="presentation">
          <a href="#orders"
            aria-controls="orders" role="tab" data-toggle="tab">Orders</a>
          </li>
        </ul>
        <div class="tab-content">
          <div role="tabpanel" class="tab-pane fade in active" id="profile">
            <h2>Customer Info</h2>
            <form role="form" action="#" th:object="${customer}"
              method="post">                
              <div class="form-group">
                <label>FirstName</label> 
                <input type="text"
                  class="form-control" th:field="*{firstName}"
                  readonly="readonly" />
              </div>
              <div class="form-group">
                <label>LastName</label> 
                <input type="text" class="form-control"
                  th:field="*{lastName}" readonly="readonly" />
              </div>
              <div class="form-group">
                <label>Email</label> 
                <input type="email" class="form-control"
                  th:field="*{email}" readonly="readonly" />
              </div>
              <div class="form-group">
                <label>Phone</label> 
                <input type="text" class="form-control"
                  th:field="*{phone}" readonly="readonly" />
              </div>
            </form>
          </div>
          <div role="tabpanel" class="tab-pane fade" id="orders">
            <h2>Orders</h2>
            <table cellspacing="0" class="shop_table cart">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr th:each="order,iterStat : ${orders}">
                  <td><span th:text="${iterStat.count}">1</span></td>
                  <td><a href="#" th:text="${order.orderNumber}"
                    th:href="@{/orders/{orderNumber}(orderNumber=${order.orderNumber})}">OrderNumber</a>
                  </td>
                  <td><span th:text="${order.status}">Status</span></td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>

```

Now you can login as customer and click on MyAccount and see the profile. 
When you click on Orders tab you can see the list of orders that customer is placed. 
Also you can click on Order Number to see more details of the Order.
