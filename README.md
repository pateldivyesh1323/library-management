# Library-management


### Steps for setting up locally

- Clone the repository

  `git clone https://github.com/pateldivyesh1323/library-management`

- Change your root directory to the repository

  `cd library-management`

- Install dependencies

  `npm install`

- Create .env file and copy contents of .env.sample

  `cp .env.sample .env`

  Make sure to fill all the enviroment variables

- Start the server

  `npm run dev`

  This script will automatically
  - Create tables for your database
  - Generate mock data
  - Start the server

### API Routes

To acceess the protected routes you will first hit register or login endpoint, the endpoint will give a token. Then, add this token to Auth Bearer to access those endpoints.

- Author

  - '/api/authors/login': post : loginAuthor
  - '/api/authors/': post : registerAuthor
  - '/api/authors/': get : getAllAuthors : protectedRoute
  - '/api/authors/me': get : getCurrentAuthor : protectedRoute
  - '/api/authors/:id': get : getOneAuthor : protectedRoute
  - '/api/authors/': put : updateAuthor : protectedRoute
  - '/api/authors/': delete : deleteAuthor : protectedRoute

- Books

  - '/api/books/': get : getAll : protectedRoute
    - /api/books?page=1 : Gives books data according to page no
    - /api/books?sort=min : Sorts the book data ascending to number of likes
    - /api/books?sort=max : Sorts the book data descending to number of likes
  - '/api/books/:id': get : getOne : protectedRoute
  - '/api/books/': post : createNew : protectedRoute
  - '/api/books/:id': put : updateBook : protectedRoute
  - '/api/books/:id': delete : deleteBook : protectedRoute
  - '/api/books/like/:id': put : likeBook : protectedRoute
  - '/api/books/unlike/:id': put : unlikeBook : protectedRoute
 
### Database

- Author
  
  - id: Serially incremented
  - name
  - email: unique
  - phone_no
  - password: encrypted

- Books

  - id: Serially incremented
  - title
  - likes[] : This is array of author id who liked the book
  - author : ID of the book publisher  
