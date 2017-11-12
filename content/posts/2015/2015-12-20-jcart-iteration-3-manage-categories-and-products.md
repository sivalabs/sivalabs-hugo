---
title: 'JCart Iteration-3 : Manage Categories and Products'
author: Siva
type: post
date: 2015-12-20T05:58:44+00:00
url: /2015/12/jcart-iteration-3-manage-categories-and-products/
post_views_count:
  - 6
categories:
  - Java
tags:
  - jcart

---
In this iteration we will start working on the key requirement of our JCart administration application, ie managing categories and products.

We will create various categories like Birds, Flowers, Vehicles etc. While creating products we will assign it to one of the category.

Managing Categories and Products also looks similar to Manage Roles and Users. But there are few new things we will learn like FileUploading etc.

### Create Spring Data JPA Repositories for Category and Product

<pre class="brush: java">public interface CategoryRepository extends JpaRepository&lt;Category, Integer&gt; {
	Category getByName(String name);
}

public interface ProductRepository extends JpaRepository&lt;Product, Integer&gt; {
	Product findByName(String name);
	Product findBySku(String sku);
	@Query("select p from Product p where p.name like ?1 or p.sku like ?1 or p.description like ?1")
	List&lt;Product&gt; search(String query);
}
</pre>

### Create CatalogService which contains all the catalog related service methods.

<pre class="brush: java">@Service
@Transactional
public class CatalogService {
	@Autowired CategoryRepository categoryRepository;
	@Autowired ProductRepository productRepository;
	
	public List&lt;Category&gt; getAllCategories() {
		
		return categoryRepository.findAll();
	}
	
	public List&lt;Product&gt; getAllProducts() {
		
		return productRepository.findAll();
	}

	public Category getCategoryByName(String name) {
		return categoryRepository.getByName(name);
	}
	
	public Category getCategoryById(Integer id) {
		return categoryRepository.findOne(id);
	}

	public Category createCategory(Category category) {
		Category persistedCategory = getCategoryByName(category.getName());
		if(persistedCategory != null){
			throw new JCartException("Category "+category.getName()+" already exist");
		}
		return categoryRepository.save(category);
	}

	public Category updateCategory(Category category) {
		Category persistedCategory = getCategoryById(category.getId());
		if(persistedCategory == null){
			throw new JCartException("Category "+category.getId()+" doesn't exist");
		}
		persistedCategory.setDescription(category.getDescription());
		persistedCategory.setDisplayOrder(category.getDisplayOrder());
		persistedCategory.setDisabled(category.isDisabled());
		return categoryRepository.save(persistedCategory);
	}

	public Product getProductById(Integer id) {
		return productRepository.findOne(id);
	}
	
	public Product getProductBySku(String sku) {
		return productRepository.findBySku(sku);
	}
	
	public Product createProduct(Product product) {
		Product persistedProduct = getProductBySku(product.getName());
		if(persistedProduct != null){
			throw new JCartException("Product SKU "+product.getSku()+" already exist");
		}
		return productRepository.save(product);
	}
	
	public Product updateProduct(Product product) {
		Product persistedProduct = getProductById(product.getId());
		if(persistedProduct == null){
			throw new JCartException("Product "+product.getId()+" doesn't exist");
		}
		persistedProduct.setDescription(product.getDescription());
		persistedProduct.setDisabled(product.isDisabled());
		persistedProduct.setPrice(product.getPrice());
		persistedProduct.setCategory(getCategoryById(product.getCategory().getId()));
		return productRepository.save(persistedProduct);
	}

	public List&lt;Product&gt; searchProducts(String query) {
		return productRepository.search("%"+query+"%");
	}
}
</pre>

### Let us create CategoryController to handle list all categories, create/update categories actions as follows:

<pre class="brush: java">@Controller
@Secured(SecurityUtil.MANAGE_CATEGORIES)
public class CategoryController extends JCartAdminBaseController
{
	private static final String viewPrefix = "categories/";
	
	@Autowired
	private CatalogService catalogService;
	
	@Autowired private CategoryValidator categoryValidator;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Categories";
	}
	
	@RequestMapping(value="/categories", method=RequestMethod.GET)
	public String listCategories(Model model) {
		List&lt;Category&gt; list = catalogService.getAllCategories();
		model.addAttribute("categories",list);
		return viewPrefix+"categories";
	}
	
	@RequestMapping(value="/categories/new", method=RequestMethod.GET)
	public String createCategoryForm(Model model) {
		Category category = new Category();
		model.addAttribute("category",category);
		
		return viewPrefix+"create_category";
	}

	@RequestMapping(value="/categories", method=RequestMethod.POST)
	public String createCategory(@Valid @ModelAttribute("category") Category category, BindingResult result,
			Model model, RedirectAttributes redirectAttributes) {
		categoryValidator.validate(category, result);
		if(result.hasErrors()){
			return viewPrefix+"create_category";
		}
		Category persistedCategory = catalogService.createCategory(category);
		logger.debug("Created new category with id : {} and name : {}", persistedCategory.getId(), persistedCategory.getName());
		redirectAttributes.addFlashAttribute("info", "Category created successfully");
		return "redirect:/categories";
	}
	
	@RequestMapping(value="/categories/{id}", method=RequestMethod.GET)
	public String editCategoryForm(@PathVariable Integer id, Model model) {
		Category category = catalogService.getCategoryById(id);
		model.addAttribute("category",category);
		return viewPrefix+"edit_category";
	}
	
	@RequestMapping(value="/categories/{id}", method=RequestMethod.POST)
	public String updateCategory(Category category, Model model, RedirectAttributes redirectAttributes) {
		Category persistedCategory = catalogService.updateCategory(category);
		logger.debug("Updated category with id : {} and name : {}", persistedCategory.getId(), persistedCategory.getName());
		redirectAttributes.addFlashAttribute("info", "Category updated successfully");
		return "redirect:/categories";
	}

}
</pre>

### Next create the thymeleaf views for category management as follows:

**jcart-admin/src/main/resources/templates/categories/categories.html**

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
      &lt;head&gt;
        &lt;title&gt;Categories&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        
    	&lt;div layout:fragment="content"&gt;
	        &lt;div class="row"&gt;
            &lt;div class="col-md-12"&gt;
              &lt;div class="box"&gt;
                &lt;div class="box-header"&gt;
                  &lt;h3 class="box-title"&gt;List of Categories&lt;/h3&gt;
                  &lt;div class="box-tools"&gt;
                    &lt;div class="input-group" style="width: 150px;"&gt;
                    	&lt;a class="btn btn-sm btn-default" th:href="@{/categories/new}"&gt;
								&lt;i class="fa fa-plus-circle"&gt;&lt;/i&gt; New Category&lt;/a&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
                &lt;div class="box-body table-responsive no-padding"&gt;
                  &lt;table class="table table-hover"&gt;
                    &lt;tr&gt;
                      &lt;th style="width: 10px"&gt;#&lt;/th&gt;
                      &lt;th&gt;Name&lt;/th&gt;
                      &lt;th&gt;Description&lt;/th&gt;
                      &lt;th&gt;Edit&lt;/th&gt;
                    &lt;/tr&gt;
                    &lt;tr th:each="cat,iterStat : ${categories}"&gt;
                      &lt;td th:text="${iterStat.count}"&gt;1&lt;/td&gt;
                      &lt;td th:text="${cat.name}"&gt;Category Name&lt;/td&gt;
                      &lt;td th:text="${cat.description}"&gt;Category Description&lt;/td&gt;
                      &lt;td&gt;&lt;a th:href="@{/categories/{id}(id=${cat.id})}" class="btn btn-sm btn-default"&gt;
							&lt;i class="fa fa-edit"&gt;&lt;/i&gt; Edit&lt;/a&gt;&lt;/td&gt;
                    &lt;/tr&gt;
                    
                  &lt;/table&gt;
                &lt;/div&gt;
                
              &lt;/div&gt;
              &lt;/div&gt;
              &lt;/div&gt;              
    	&lt;/div&gt;    	
    &lt;/body&gt;    
&lt;/html&gt;
</pre>

**jcart-admin/src/main/resources/templates/categories/create_category.html**

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
      &lt;head&gt;
        &lt;title&gt;Categories - New&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        
    	&lt;div layout:fragment="content"&gt;
	        
              &lt;div class="box box-warning"&gt;
                &lt;div class="box-header with-border"&gt;
                  &lt;h3 class="box-title"&gt;Create New Category&lt;/h3&gt;
                &lt;/div&gt;
                &lt;div class="box-body"&gt;
                  &lt;form role="form" th:action="@{/categories}" th:object="${category}" method="post"&gt;
                  	&lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
							th:class="text-red"&gt;Incorrect data&lt;/p&gt;
                    
                    &lt;div class="form-group" th:classappend="${#fields.hasErrors('name')}? 'has-error'"&gt;
                      &lt;label&gt;Name&lt;/label&gt;
                      &lt;input type="text" class="form-control" name="name" th:field="*{name}" 
							placeholder="Enter Category Name"/&gt;
                      &lt;p th:if="${#fields.hasErrors('name')}" th:errors="*{name}" 
							th:class="text-red"&gt;Incorrect data&lt;/p&gt;
                    &lt;/div&gt;
                    
                    &lt;div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'"&gt;
                      &lt;label&gt;Description&lt;/label&gt;
                      &lt;textarea class="form-control" rows="3" name="description" 
							th:field="*{description}" placeholder="Enter Category Description"&gt;&lt;/textarea&gt;
                      &lt;p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" 
							th:class="text-red"&gt;Incorrect data&lt;/p&gt;
                    &lt;/div&gt;
					
					&lt;div class="form-group" th:classappend="${#fields.hasErrors('displayOrder')}? 'has-error'"&gt;
                      &lt;label&gt;Display Order&lt;/label&gt;
                      &lt;input type="number" class="form-control" name="displayOrder" 
								th:field="*{displayOrder}" placeholder="Enter display order number"/&gt;
                      &lt;p th:if="${#fields.hasErrors('displayOrder')}" th:errors="*{displayOrder}" 
							th:class="text-red"&gt;Incorrect data&lt;/p&gt;
                    &lt;/div&gt;
					    				
					&lt;div class="box-footer"&gt;
	                    &lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
	                &lt;/div&gt;
                  &lt;/form&gt;
                &lt;/div&gt;
              &lt;/div&gt;
    	&lt;/div&gt;
    	
    &lt;/body&gt;
    
&lt;/html&gt;
</pre>

**jcart-admin/src/main/resources/templates/categories/edit_category.html**

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
      &lt;head&gt;
        &lt;title&gt;Categories - Edit&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
    	        
    	&lt;div layout:fragment="content"&gt;
	        
              &lt;div class="box box-warning"&gt;
                &lt;div class="box-header with-border"&gt;
                  &lt;h3 class="box-title"&gt;Edit Category&lt;/h3&gt;
                &lt;/div&gt;
                &lt;div class="box-body"&gt;
                  &lt;form role="form" th:action="@{/categories/{id}(id=${category.id})}" 
						th:object="${category}" method="post"&gt;
                  &lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
						th:class="text-red"&gt;Incorrect data&lt;/p&gt;
                    
                    &lt;div class="form-group"&gt;
                      &lt;label&gt;Name&lt;/label&gt;
                      &lt;input type="text" class="form-control" name="name" 
						th:field="*{name}" readonly="readonly"/&gt;
                    &lt;/div&gt;
                    
                    &lt;div class="form-group"&gt;
                      &lt;label&gt;Description&lt;/label&gt;
                      &lt;textarea class="form-control" rows="3" name="description" 
						th:field="*{description}" placeholder="Enter Category Description"&gt;&lt;/textarea&gt;
                    &lt;/div&gt;
					
					&lt;div class="form-group"&gt;
                      &lt;label&gt;Display Order&lt;/label&gt;
                      &lt;input type="number" class="form-control" name="displayOrder" 
							th:field="*{displayOrder}" placeholder="Enter display order number"/&gt;
                    &lt;/div&gt;
    				
					&lt;div class="box-footer"&gt;
	                    &lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
	                &lt;/div&gt;
                  &lt;/form&gt;
                &lt;/div&gt;
              &lt;/div&gt;
    	&lt;/div&gt;
    	
    &lt;/body&gt;
    
&lt;/html&gt;
</pre>

Now you can run the application and test Category related functionality be performing adding new categories or editing existing categories.

## Product Management

While storing the product details in our database we store the product image on disk and store the path in products.image_url column.
  
So we will create a ProductForm class to hold the uploaded image **(org.springframework.web.multipart.MultipartFile)** and then convert that into **Product** JPA entity.

Create **ProductForm** class as follows:

<pre class="brush: java">package com.sivalabs.jcart.admin.web.models;

import java.math.BigDecimal;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;
import com.sivalabs.jcart.entities.Category;
import com.sivalabs.jcart.entities.Product;

public class ProductForm 
{
	private Integer id;
	@NotEmpty
	private String sku;
	@NotEmpty
	private String name;
	private String description;
	@NotNull
	@DecimalMin("0.1")
	private BigDecimal price = new BigDecimal("0.0");
	private String imageUrl;
	private MultipartFile image;
	private boolean disabled;
	@NotNull
	private Integer categoryId;
	
	// setters & getters
	
	public Product toProduct() {
		Product p = new Product();
		p.setId(id);
		p.setName(name);
		p.setDescription(description);
		p.setDisabled(disabled);
		p.setPrice(price);
		p.setSku(sku);
		Category category = new Category();
		category.setId(categoryId);
		p.setCategory(category );
		return p;
	}
	
	public static ProductForm fromProduct(Product product)
	{
		ProductForm p = new ProductForm();
		p.setId(product.getId());
		p.setName(product.getName());
		p.setDescription(product.getDescription());
		p.setDisabled(product.isDisabled());
		p.setPrice(product.getPrice());
		p.setSku(product.getSku());
		p.setCategoryId(product.getCategory().getId());
		return p;
	}
}
</pre>

We will use apache commons-io library to store/read the files from disk, so add the following maven dependency in jcart-admin/pom.xml

<pre class="brush: html">&lt;dependency&gt;
	&lt;groupId&gt;commons-io&lt;/groupId&gt;
	&lt;artifactId&gt;commons-io&lt;/artifactId&gt;
	&lt;version&gt;2.3&lt;/version&gt;
&lt;/dependency&gt;
</pre>

SpringBoot (SpringMVC) supports Servlet 3 javax.servlet.http.Part API for uploading files. for more details see Handling Multipart File Uploads <a href="http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-multipart-file-upload-configuration" target="_blank">http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-multipart-file-upload-configuration</a>

### Implement the ProductController to handle product related actions.

<pre class="brush: java">@Controller
@Secured(SecurityUtil.MANAGE_PRODUCTS)
public class ProductController extends JCartAdminBaseController
{
	private static final String viewPrefix = "products/";
	@Autowired
	private CatalogService catalogService;
	
	@Autowired private ProductFormValidator productFormValidator;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Products";
	}
	
	@ModelAttribute("categoriesList")
	public List&lt;Category&gt; categoriesList()
	{
		return catalogService.getAllCategories();
	}
	
	@RequestMapping(value="/products", method=RequestMethod.GET)
	public String listProducts(Model model) {
		model.addAttribute("products",catalogService.getAllProducts());
		return viewPrefix+"products";
	}

	@RequestMapping(value="/products/new", method=RequestMethod.GET)
	public String createProductForm(Model model) {
		ProductForm product = new ProductForm();
		model.addAttribute("product",product);
		return viewPrefix+"create_product";
	}

	@RequestMapping(value="/products", method=RequestMethod.POST)
	public String createProduct(@Valid @ModelAttribute("product") ProductForm productForm, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {
		productFormValidator.validate(productForm, result);
		if(result.hasErrors()){
			return viewPrefix+"create_product";
		}
		Product product = productForm.toProduct();
		Product persistedProduct = catalogService.createProduct(product);
		productForm.setId(product.getId());
		this.saveProductImageToDisk(productForm);
		logger.debug("Created new product with id : {} and name : {}", persistedProduct.getId(), persistedProduct.getName());
		redirectAttributes.addFlashAttribute("info", "Product created successfully");
		return "redirect:/products";
	}
	
	@RequestMapping(value="/products/{id}", method=RequestMethod.GET)
	public String editProductForm(@PathVariable Integer id, Model model) {
		Product product = catalogService.getProductById(id);
		model.addAttribute("product",ProductForm.fromProduct(product));
		return viewPrefix+"edit_product";
	}
	
	@RequestMapping(value="/products/images/{productId}", method=RequestMethod.GET)
	public void showProductImage(@PathVariable String productId, HttpServletRequest request, HttpServletResponse response) {
		try {
			FileSystemResource file = new FileSystemResource(WebUtils.IMAGES_DIR +productId+".jpg");
			response.setContentType("image/jpg");
			org.apache.commons.io.IOUtils.copy(file.getInputStream(), response.getOutputStream());
			response.flushBuffer();
		} catch (IOException e) {
			e.printStackTrace();
		}	      
	}
	
	@RequestMapping(value="/products/{id}", method=RequestMethod.POST)
	public String updateProduct(@Valid @ModelAttribute("product") ProductForm productForm, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {
		productFormValidator.validate(productForm, result);
		if(result.hasErrors()){
			return viewPrefix+"edit_product";
		}
		Product product = productForm.toProduct();
		Product persistedProduct = catalogService.updateProduct(product);
		this.saveProductImageToDisk(productForm);
		logger.debug("Updated product with id : {} and name : {}", persistedProduct.getId(), persistedProduct.getName());
		redirectAttributes.addFlashAttribute("info", "Product updated successfully");
		return "redirect:/products";
	}
	
	private void saveProductImageToDisk(ProductForm productForm) {
		MultipartFile file = productForm.getImage();
		if (file!= null && !file.isEmpty()) {
			String name = WebUtils.IMAGES_DIR + productForm.getId() + ".jpg";
			try {
				byte[] bytes = file.getBytes();
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(name)));
				stream.write(bytes);
				stream.close();
			} catch (Exception e) {
				throw new JCartException(e);
			}
		}
	}
}
</pre>

The left over things are preparing thymeleaf views for product management screens.

**jcart-admin/src/main/resources/templates/products/products.html**

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;
&lt;head&gt;
&lt;title&gt;Products&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div layout:fragment="content"&gt;
		&lt;div class="row"&gt;
			&lt;div class="col-md-12"&gt;
				&lt;div class="box"&gt;
					&lt;div class="box-header"&gt;
						&lt;h3 class="box-title"&gt;List of Products&lt;/h3&gt;
						&lt;div class="box-tools"&gt;
							&lt;div class="input-group" style="width: 150px;"&gt;
								&lt;a class="btn btn-sm btn-default" th:href="@{/products/new}"&gt;&lt;i
									class="fa fa-plus-circle"&gt;&lt;/i&gt; New Product&lt;/a&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					&lt;div class="box-body table-responsive no-padding"&gt;
						&lt;table class="table table-hover"&gt;
							&lt;tr&gt;
								&lt;th style="width: 10px"&gt;#&lt;/th&gt;
								&lt;th&gt;Name&lt;/th&gt;
								&lt;th&gt;Description&lt;/th&gt;
								&lt;th&gt;Edit&lt;/th&gt;
							&lt;/tr&gt;
							&lt;tr th:each="product,iterStat : ${products}"&gt;
								&lt;td th:text="${iterStat.count}"&gt;1&lt;/td&gt;
								&lt;td th:text="${product.name}"&gt;Product Name&lt;/td&gt;
								&lt;td th:text="${product.description}"&gt;Product Description&lt;/td&gt;
								&lt;td&gt;&lt;a th:href="@{/products/{id}(id=${product.id})}"
									class="btn btn-sm btn-default"&gt;&lt;i class="fa fa-edit"&gt;&lt;/i&gt;Edit&lt;/a&gt;
								&lt;/td&gt;
							&lt;/tr&gt;

						&lt;/table&gt;
					&lt;/div&gt;

				&lt;/div&gt;
			&lt;/div&gt;
		&lt;/div&gt;

	&lt;/div&gt;

&lt;/body&gt;

&lt;/html&gt;
</pre>

**jcart-admin/src/main/resources/templates/products/create_product.html**

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;      
&lt;head&gt;
	&lt;title&gt;Products - New&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;	
	&lt;div layout:fragment="content"&gt;
		
		  &lt;div class="box box-warning"&gt;
			&lt;div class="box-header with-border"&gt;
			  &lt;h3 class="box-title"&gt;Create New Product&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body"&gt;
			  &lt;form role="form" th:action="@{/products}" th:object="${product}" 
					method="post" enctype="multipart/form-data"&gt;
				&lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
					th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('name')}? 'has-error'"&gt;
				  &lt;label&gt;Name&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="name" th:field="*{name}" 
					placeholder="Enter Product Name"/&gt;
				  &lt;p th:if="${#fields.hasErrors('name')}" th:errors="*{name}" 
					th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('sku')}? 'has-error'"&gt;
				  &lt;label&gt;SKU&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="sku" 
						th:field="*{sku}" placeholder="Enter Product SKU"/&gt;
				  &lt;p th:if="${#fields.hasErrors('sku')}" th:errors="*{sku}" 
					 th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('price')}? 'has-error'"&gt;
				  &lt;label&gt;Price&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="price" 
					 th:field="*{price}" placeholder="Enter Product Price"/&gt;
				  &lt;p th:if="${#fields.hasErrors('price')}" th:errors="*{price}" 
					th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'"&gt;
				  &lt;label&gt;Description&lt;/label&gt;
				  &lt;textarea class="form-control" rows="3" name="description" 
					th:field="*{description}" placeholder="Enter Role Description"&gt;&lt;/textarea&gt;
				  &lt;p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" 
						th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('image')}? 'has-error'"&gt;
				  &lt;label for="image"&gt;Image&lt;/label&gt;
				  &lt;input type="file" class="form-control" name="image" th:field="*{image}"/&gt;
				  &lt;p th:if="${#fields.hasErrors('image')}" th:errors="*{image}" 
					th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				  &lt;p class="help-block"&gt;Select JPG Image&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('categoryId')}? 'has-error'"&gt;
					&lt;label&gt;Category&lt;/label&gt;
					&lt;div&gt;
						&lt;select class="form-control" th:field="*{categoryId}"&gt;
						  &lt;option th:each="cat : ${categoriesList}" 
								  th:value="${cat.id}" 
								  th:text="${cat.name}"&gt;Category&lt;/option&gt;
						&lt;/select&gt;
					&lt;p th:if="${#fields.hasErrors('categoryId')}" th:errors="*{categoryId}"
						th:class="text-red"&gt;Incorrect data&lt;/p&gt;
					&lt;/div&gt;
					
				&lt;/div&gt;
				
				&lt;div class="box-footer"&gt;
					&lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
				&lt;/div&gt;
			  &lt;/form&gt;
			&lt;/div&gt;
		  &lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;
    
&lt;/html&gt;
</pre>

**jcart-admin/src/main/resources/templates/products/edit_product.html**

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;      
&lt;head&gt;
	&lt;title&gt;Products - Edit&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    	        
	&lt;div layout:fragment="content"&gt;		
		  &lt;div class="box box-warning"&gt;
			&lt;div class="box-header with-border"&gt;
			  &lt;h3 class="box-title"&gt;Edit Product&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body"&gt;
			  &lt;form role="form" th:action="@{/products/{id}(id=${product.id})}" 
					th:object="${product}" method="post"  enctype="multipart/form-data"&gt;
				&lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
					th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				
				&lt;div class="form-group"&gt;
				  &lt;label&gt;Name&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="name" th:field="*{name}" readonly="readonly"/&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group"&gt;
				  &lt;label&gt;SKU&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="sku" th:field="*{sku}" readonly="readonly"/&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('price')}? 'has-error'"&gt;
				  &lt;label&gt;Price&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="price" th:field="*{price}" 
					placeholder="Enter Product Price"/&gt;
				  &lt;p th:if="${#fields.hasErrors('price')}" th:errors="*{price}" 
					th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'"&gt;
				  &lt;label&gt;Description&lt;/label&gt;
				  &lt;textarea class="form-control" rows="3" name="description" th:field="*{description}" 
					placeholder="Enter Role Description"&gt;&lt;/textarea&gt;
				  &lt;p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" 
					 th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('image')}? 'has-error'"&gt;
				  &lt;label for="image"&gt;Image&lt;/label&gt;
				  &lt;input type="file" class="form-control" name="image" th:field="*{image}"/&gt;
				  &lt;p th:if="${#fields.hasErrors('image')}" th:errors="*{image}" th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				  &lt;p class="help-block"&gt;Select JPG Image&lt;/p&gt;
				  &lt;p&gt;
					&lt;img alt="" src="image.jpg" th:src="@{'/products/images/{imageUrl}.jpg'(imageUrl=${product.id})}" 
						height="200" width="250"/&gt;
				  &lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('categoryId')}? 'has-error'"&gt;
					&lt;label&gt;Category&lt;/label&gt;
					&lt;div&gt;
						&lt;select class="form-control" th:field="*{categoryId}"&gt;
						  &lt;option th:each="cat : ${categoriesList}" 
								  th:value="${cat.id}" 
								  th:text="${cat.name}"&gt;Category&lt;/option&gt;
						&lt;/select&gt;
					&lt;p th:if="${#fields.hasErrors('categoryId')}" th:errors="*{categoryId}" 
						th:class="text-red"&gt;Incorrect data&lt;/p&gt;
					&lt;/div&gt;
					
				&lt;/div&gt;
									
				&lt;div class="box-footer"&gt;
					&lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
				&lt;/div&gt;
			  &lt;/form&gt;
			&lt;/div&gt;
		  &lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;    
&lt;/html&gt;
</pre>

> That&#8217;s a lot of code snippets, I know it is difficult to read that much of code on blog!!
  
> I would encourage you to checkout the code from github repo into your IDE.

Though initially we consider to implement multi language and multi currency support we are postponing these requirements as they are not high priority for this first release.

Next we will start building the consumer facing ShoppingCart application in Iteration-4.