# EQUIPMENoT

This web application is a prototype-in-progress for software to manage music instrument and equipment rentals and sales. It is based around the React framework in conjunction with a PostgreSQL database. The program is currently run off of a Node.js server. The tech stack employed is Node-Express-React-Postgres lovingly referred to as "NERP". The version in this repository is not in a fully operational state, but is currently being deployed out of Amazon Web Services.

At a distance, the application serves to facilitate the operations of a flight school. Students, teachers, administrators and basic pilots can sign up for the service. The signup can be done through invitation from the application, or initiated by an individual. Either way, the user has to confirm their invite through an SMS message to allow them to be added to the database and associated in the future with other objects and tables in the postgres implementation like "people", "equipment" and "location".

Users are created and create their passwords which are stored encrypted through the use of b-crypt. Once in the system, schools and users are able to monitor their progress of certification, flights and aircraft status electonically as opposed to manually. When planes are cleared for departure, aircraft and flight status are changed in the database to reflect their real-world status. These changes are manifested in the user interface, allowing administrators and staff to monitor and keep track of craft and students.

The application also makes use of AWS capabilites to send and receive emails and Twilio's capabilites to send and receive SMS services. These features make the application more appetizing to consumers who are used to depending on their phones to communicate quickly. Logins, signups, and also flight tracking utilize these technologies to automatically add users and update statuses so that record keeping is not as tedious.

A beginners approach has been applied to security. It is a concern that has been addressed through b-crypt's hashing and salting of passwords, to encrypting user information that is stored in AWS S3 buckets. There still exist a few bugs in the code that need to be resolved before it can be considered a minimum viable product...

Ideas exist for this eventually to be ported to a mobile application as well.
