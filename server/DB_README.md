The Tetris Database is created in mariaDB.
The code for database and tables creation is in the file "database.sql".
The database is composed of 2 tables:
    - users: stores the users' data.
    - scores: stores the scores of the users.
The database is accessed through the server using the "mysql" package.
The database connection is established in the file "modules/modules.js".
You have to modify the credentials in the file "modules/modules.js" to connect to your database.