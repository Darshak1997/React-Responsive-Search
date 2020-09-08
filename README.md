# Responsive Search

I have used **React** to display images related to the text entered by the user.

# Steps to run this application

1. Clone this repository.
2. Go the the cloned directoy and run ```npm install``` from the command line
3. Run ```npm run dev```
4. Go to http://localhost:8080/ to run this application

# Assumptions made for the application
1. Since I did not have millions of rows of data, I am calling an API which has millions of rows of data.
2. I have used pagination to display large amount of data.
3. When the user is typing really fast, this system does not search for every entered character since it would increase our reading time and make our system considerably slow. Whenever there is a pause after the query, the system displays related content.
4. If there is no content related to the search query, our system will display a message stating that no content is available for this query.

# Limitations of this application
1. Since I did not have my own database, I have used an API call.
2. If the size of our database becomes huge, then we would have to partition our database. Since, we want to partition our database, we can use MySQL database since it supports JOIN.
3. We can also store our most searched query and it's respective content into a cache, this will give us faster access to the content. We can use Least Recently Used (LRU) caching technique.

