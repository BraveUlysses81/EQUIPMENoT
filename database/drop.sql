-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2017-04-18 21:42:13.713

DROP schema if exists postgres CASCADE;;
DROP schema if exists wilbur CASCADE;;

-- views
DROP VIEW aircraft_flights_vw;

-- foreign keys
ALTER TABLE AGREEMENT
    DROP CONSTRAINT AGREEMENT_SCHOOL;

ALTER TABLE AIRCRAFT_OWNERSHIP
    DROP CONSTRAINT AIRCRAFTOWNERSHIP_AIRCRAFT;

ALTER TABLE SQUAWK
    DROP CONSTRAINT AIRCRAFT_SQUAWK;

ALTER TABLE CHECKOUT
    DROP CONSTRAINT CHECKOUT_AIRCRAFT;

ALTER TABLE CHECKOUT
    DROP CONSTRAINT CHECKOUT_MEMBERSHIP;

ALTER TABLE CONTACT
    DROP CONSTRAINT CONTACT_AIRPORT;

ALTER TABLE CONTACT
    DROP CONSTRAINT CONTACT_CUSTOMER;

ALTER TABLE CONTACT
    DROP CONSTRAINT CONTACT_SCHOOL;

ALTER TABLE DOCUMENTATION
    DROP CONSTRAINT DOCUMENT_STUDENT;

ALTER TABLE FLIGHT
    DROP CONSTRAINT FLIGHT_AIRCRAFT;

ALTER TABLE FLIGHT
    DROP CONSTRAINT FLIGHT_INVOICE;

ALTER TABLE FLIGHT
    DROP CONSTRAINT FLIGHT_PERSON;

ALTER TABLE FLIGHT
    DROP CONSTRAINT FLIGHT_STUDENT;

ALTER TABLE INVITE
    DROP CONSTRAINT INVITE_LOGIN;

ALTER TABLE LANDING
    DROP CONSTRAINT LANDING_TYPE_LANDING_CODE;

ALTER TABLE LEG
    DROP CONSTRAINT LEG_AIRPORT_ARRIVAL;

ALTER TABLE LEG
    DROP CONSTRAINT LEG_AIRPORT_DEPARTURE;

ALTER TABLE LEG
    DROP CONSTRAINT LEG_FLIGHT;

ALTER TABLE LANDING
    DROP CONSTRAINT LEG_LANDING;

ALTER TABLE INSTRUCTOR_CERTIFICATE
    DROP CONSTRAINT LICENSE_PERSON;

ALTER TABLE MEMBERSHIP
    DROP CONSTRAINT MEMBERSHIP_SCHOOL;

ALTER TABLE AIRCRAFT
    DROP CONSTRAINT MODEL_AIRCRAFT;

ALTER TABLE FLIGHT
    DROP CONSTRAINT PERSON_FLIGHT;

ALTER TABLE PERSON
    DROP CONSTRAINT PERSON_LOGIN;

ALTER TABLE PILOT_CERTIFICATE
    DROP CONSTRAINT PILOT_CERTIFICATE_CATEGORY;

ALTER TABLE PILOT_CERTIFICATE
    DROP CONSTRAINT PILOT_CERTIFICATE_CERTIFICATE_TYPE;

ALTER TABLE PILOT_CERTIFICATE
    DROP CONSTRAINT PILOT_CERTIFICATE_CLASS;

ALTER TABLE PILOT_CERTIFICATE
    DROP CONSTRAINT PILOT_CERTIFICATE_PERSON;

ALTER TABLE AIRCRAFT
    DROP CONSTRAINT SCHOOL_AIRCRAFT;

ALTER TABLE FLIGHT
    DROP CONSTRAINT SCHOOL_FLIGHT;

ALTER TABLE SERVICE
    DROP CONSTRAINT SERVICE_SCHOOL;

ALTER TABLE SERVICE
    DROP CONSTRAINT SERVICE_SERVICETYPE;

ALTER TABLE SQUAWK
    DROP CONSTRAINT SQUAWK_PERSON;

ALTER TABLE MEMBERSHIP
    DROP CONSTRAINT USER_MEMBERSHIP;

ALTER TABLE STUDENT_ENDORSEMENTS
    DROP CONSTRAINT STUDENT_ENDORSEMENTS_MEMBERSHIP;

ALTER TABLE STUDENT_ENDORSEMENTS
    DROP CONSTRAINT STUDENT_ENDORSEMENTS_AIRCRAFT;

ALTER TABLE STUDENT_ENDORSEMENTS
    DROP CONSTRAINT STUDENT_ENDORSEMENTS_PERSON;

-- tables
DROP TABLE AGREEMENT;

DROP TABLE AIRCRAFT;

DROP TABLE AIRCRAFT_MODEL;

DROP TABLE AIRCRAFT_OWNERSHIP;

DROP TABLE AIRPORT;

DROP TABLE CATEGORY;

DROP TABLE CERTIFICATE_TYPE;

DROP TABLE CHECKOUT;

DROP TABLE CLASS;

DROP TABLE CONTACT;

DROP TABLE DOCUMENTATION;

DROP TABLE FLIGHT;

DROP TABLE INSTRUCTOR_CERTIFICATE;

DROP TABLE INVITE;

DROP TABLE INVOICE;

DROP TABLE LANDING;

DROP TABLE LANDING_CODE;

DROP TABLE LEG;

DROP TABLE LOGIN;

DROP TABLE MEMBERSHIP;

DROP TABLE PERSON;

DROP TABLE PILOT_CERTIFICATE;

DROP TABLE SCHOOL;

DROP TABLE SERVICE;

DROP TABLE SERVICE_TYPE;

DROP TABLE SQUAWK;

DROP TABLE STUDENT_ENDORSEMENTS;

-- End of file.

