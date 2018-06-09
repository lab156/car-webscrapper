#Simple scripts to scrape webpages with automobile selling prices 
q2
*This* info will be utilized to predict car prices with some kind of _linear modeling_.

To backup/migrate the database do a sqldump:

mysqldump -u root -p --opt test> superclasif_db.sql

In this case test is the local database and superclasif_db.sql is the dump filek

On the server do 

mysql -u root -p superclasificados < superclasif_db.sql

Where superclasificados is the name of the database in the server side 
