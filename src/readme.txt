need an react app named 'contract' that will have the following:

products component: it should list all products. Should have the ability to add, edit and delete products. it should have Id, product name, details. 

employees component: it should list all employees. Should have the ability to add, edit and delete employees. it should have Id, employee name, price category, comments

price component: it should have price of all products in document called prices. The add form will take products from firebase and present as dropdown. The product will have prices for 3 categories named price, price2 and price 3. the form should allow that. it should also have date column taking current date. please make complete crud 

entries component: it should have crud for entries. An entry will consist of form which let us select product, 
employee from dropdown based on information from components above. it should display date, need to allow to add quantity mannualy
and should allow change of date before sending that too to database. entries should be stored in way that it could 
be retrieved on monthly, yearly. firebase databases are employees, products, enteries. 

calculate component: It will display information including follows: It should display enteries based on current month and year and should let us select and change month and year. dropdown with employee names is needed. on selecting employee, we get the entries pertaining that employee id during the selected month and year. each entry will be displayed with date, product name, quantity, price and a row total multiplying price to quantity. in the end there should be a total of all row totals to give us exact amount we need to pay the employee.

we should have an option to introduce new price at beginning of any month. so we need to have a way to retain old prices corresponding to the then entries. new price should reflect in current use 

we are using firebase as database. already have following document names in firebase : employees

entries
price
prices
products

Also please make it cute