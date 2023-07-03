# DeliverUS - Project Requirements

## Introduction
DeliverUS is a made-up company whose business is focused on delivering food from 3rd parties (restaurants) to customers. To this end, we are requested to develop the needed software products which hopefully will boost the company. After interviewing the product owners and some stakeholders, the general objectives and requirements have been agreed, as described in this document.

## General Objective: Manage customer orders to restaurants
The software has to enable customers to order products to restaurants. To this end the following objectives have been identified

* Objective 1: Restaurants management
* Objective 2: Restaurants' products management
* Objective 3: Restaurants' order management
* Objective 4: Customers' order management
* Objective 5: Users management

## Information requirements
### IR-1: Users
DeliverUS expects two types of users: restaurant owners and customers. The following information should be stored: First name, last name, email, phone number, avatar image, address and postal code. For login and authentication purposes, a password, a token and a tokenExpiration date should also be stored.

### IR-2: Restaurants
Owners manage restaurants. The following information should be stored: name, description, address, postal code, url, email, phone number, logo, hero image (it will serve as restaurant background image), shipping costs (default for orders placed to this restaurant), average service time in minutes (which will be computed from the orders record), status. A restaurant status represent if it is accepting orders, currently unavailable, or temporarily/permanently closed.
There are some predefined restaurant categories on the system, so the restaurant will belong to one restaurant category.

### IR-3: Products
Products are sold by restaurants. Each product belongs to one restaurant. The following information should be stored: name, description, price, image, order and availability. The order is intended for sorting purposes that could be defined by the owner so the products are ordered according to his/her interests.

There are some predefined product categories on the system, so the product will belong to one product category.

### IR-4: Orders
Orders are placed by customers. Each order will include a set of products from one particular restaurant. Orders cannot include products from more than one restaurant. The following information should be stored: creation date (when the customer places the order), start date (when a restaurant accepts the order), sent date (when the order leaves the restaurant) and delivery date (when the customer receives the order), total price of the products included, the address where it has to be delivered, and the shipping costs. Thus, each order can be in one of the following states/statuses: 'pending', 'in process', 'sent', 'delivered'.

The system has to store the quantity of each product included in the order and the unitary price of each product at the moment of order placement.

## Class diagram proposed for design
From the information requirements and objectives described, the following class diagram is proposed:

![DeliverUS-EntityDiagram drawio (3)](https://user-images.githubusercontent.com/19324988/155700850-bb7817fb-8818-440b-97cb-4fbd33787f20.png)

## Business rules
* BR1: If an order total price is greater than 10€ the shipping costs will be 0€ (free shipping).
* BR2: An order can only include products from one restaurant
* BR3: Once an order is placed, it cannot be modified.

## Functional requirements
### Customer functional requirements:
As a customer, the system has to provide the following functionalities:
#### FR1: Restaurants listing
Customers will be able to query all restaurants.
#### FR2: Restaurants details and menu
Customers will be able to query restaurants details and the products offered by them.
#### FR3: Add, edit and remove products to a new order
A customer can add several products, and several units of a product to a new order. Before confirming, customer can edit and remove products.
#### FR4: Confirm or dismiss new order
If an order is confirmed, it is created with the state _pending_. Shipping costs must follow BR1: _Orders greater than 10€ don't have service fee_. An order is automatically related to the customer who created it.
If an order is dismissed, nothing is created.
#### FR5: Listing my confirmed orders
A Customer will be able to check his/her confirmed orders, sorted from the most recent to the oldest.
#### FR6: Show order details
A customer will be able to look his/her orders up. The system should provide all details of an order, including the ordered products and their prices.
#### FR7: Show top 3 products
Customers will be able to query top 3 products from all restaurants. Top products are the most popular ones, in other words the best sellers.
#### FR8: Edit/delete order
If the order is in the state 'pending', the customer can edit or remove the products included or remove the whole order. The delivery address can also be modified in the state 'pending'.

If the order is in the state 'sent' or 'delivered' no edition or removal is allowed.


### Owner functional requirements:
As a restaurant owner, the system has to provide the following functionalities:
#### FR1: Add, list, edit and remove Restaurants
Restaurants are related to an owner, so owners can perform these operations to the restaurants owned by him. If an owner creates a Restaurant, it will be automatically related (owned) to him. If a restaurant is removed, all its products must be removed as well.
#### FR2: Add, list, edit and remove Products
An owner can create, read, update and delete the products related to any of his owned Restaurants.
#### FR3: List orders of a Restaurant.
An owner will be able to inspect orders of any of the restaurants owned by him. The order should include products related.
#### FR4: To change the state of an order
An owner can change the state of an order. States can change from: _pending_ to _in process_, from _in process_ to _sent_, and finally from _sent_ to _delivered_.
#### FR5: To Show a dashboard including some business analytics:
 #yesterdayOrders, #pendingOrders, #todaysServedOrders, #invoicedToday (€)


## Non-functional requirements
### Portability
The system has to provide users the possibility to be accessed and run through the most popular operating systems for mobile and desktop devices.

### Security
Backend should include basic measures to prevent general security holes to be exploited such as: sql injection, contentSecurityPolicy, crossOriginEmbedderPolicy, crossOriginOpenerPolicy, crossOriginResourcePolicy, dnsPrefetchControl, expectCt, frameguard, hidePoweredBy, helmet.hsts, ieNoOpen, noSniff, originAgentCluster, permittedCrossDomainPolicies, referrerPolicy, xssFilter.

For login and authentication purposes, a password, a token and a tokenExpiration (token authentication strategy) date should also be stored for users.

Note: This subject does not focus on security topics, but we will use libraries made by cybersecurity experts that will help us to include these measures. In Node.js ecosystem, Sequelize includes data sanitization and other measures to prevent SQL injection attacks and we will use the helmet package for the rest of potential security holes when publishing REST services.

### Scalability
The system should use a stack of technologies that could be deployed in more than one machine, horizontal scalability ready.

## Proposed architecture
Once that requirements have been analyzed by our company's software architects, the following general architecture is proposed:
1. Client-server architecture model.
2. Front-end and backend independent developments.
3. One front-end development for each type of user (Customer and Owners).

Moreover, these architects propose the following technological stack:
1. Backend:
   1. Relational database, Mariadb server. It may be deployed on a machine other than where the rest of subsystems are deployed.
   2. DeliverUS backend application logic developed in Node.js application server that publishes functionalities as RESTful services helped by Express.js framework.
2. Front-end:
   1. React-native based clients for both front-ends, deployable as Android, iOS or web Apps.
   1. DeliverUS-Owner App for the functionalities intended for restaurants' owners.
   3. DeliverUS-Customer App for the functionalities intended for customers.



# IISSI-2 Software Engineering grade group project:
Students will group together to develop the course project. The size and complexity of the project to be developed is intended for groups from 3 to 4 students.

During lab sessions, teachers will conduct and instruct students about the development of the backend and frontend of the DeliverUS App requirements related to owner functionalities. Specifically:
* Lab 1, 2 and 3: Backend required developments to support owner frontend app and some common functionalities.
* Lab 4, 5, 6, 7 and 8: Frontend app for owners.

Students will be provided with:
* A backend template that includes the implementation of labs 1, 2 and 3
* A frontend implementation of the DeliverUS app for owners.
* A frontend template for the DeliverUS app for customers.

Students are required to:
* Complete the backend template provided to include the required functionalities for customers.
* Complete the frontend template provided to develop the customer frontend App.

# Backend deployment steps:
1. Accept the assignment of your github classroom if you have not done it before. Once you accepted it, you will have your own copy of this project template.
2. Clone your private repository at your local development environment by opening VScode and clone it by opening Command Palette (Ctrl+Shift+P or F1) and `Git clone` this repository, or using the terminal and running
```PowerShell
git clone <url>
```

It may be necessary to setup your github username by running the following commands on your terminal:
```PowerShell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

In case you are asked if you trust the author, please select yes.

3. Setup your environment file. As explained in labs, it is needed to create a copy of the `.env.example` file, name it `.env` and include your environment variables, specially your database username and password.

4. Install dependencies. Run `npm install` to download and install packages to the current project folder.

5. Check and run mariaDB server.
* Windows:
  * If installed as service run `services.msc` and start the mariadb service
  * If installed as binary, locate your mariaDB binary and start.
* MacOS:
```Powershell
mysql.server start
```
6. Run migrations and seeders. You can use the previously configured task by opening the command palette Command Palette (Ctrl+Shift+P or F1) `Tasks: run task` and select `Rebuild database`
7. Run `npm start`
