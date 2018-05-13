-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2017-04-14 00:41:34.116

CREATE SCHEMA IF NOT EXISTS wilbur;

-- tables
-- Table: AGREEMENT
CREATE TABLE AGREEMENT (
    AGREEMENT_ID int  NOT NULL,
    SCHOOL_ID int  NOT NULL,
    agreement_html text  NOT NULL,
    agreement_type varchar(255)  NULL,
    CONSTRAINT AGREEMENT_pk PRIMARY KEY (AGREEMENT_ID)
);

-- Table: AIRCRAFT
CREATE TABLE AIRCRAFT (
    AIRCRAFT_ID serial  NOT NULL,
    registration_nbr varchar(255)  NOT NULL,
    SCHOOL_ID int  NULL,
    dual_only boolean  NULL DEFAULT false,
    year int  NOT NULL,
    hobbs decimal(10,2)  NULL,
    tach decimal(10,2)  NOT NULL,
    ifr_certificate boolean  NULL DEFAULT false,
    night_certificate boolean  NULL DEFAULT false,
    hundred_hr_inspection decimal(10,2)  NULL,
    pitot_static_inspection date  NULL,
    transponder_certification date  NULL,
    elt_certification date  NULL,
    vor_check date  NULL,
    gps_database_update date  NULL,
    glass_cockpit boolean  NULL,
    gps boolean  NULL,
    auto_pilot boolean  NULL,
    airbags boolean  NULL,
    parachute boolean  NULL,
    AIRCRAFT_MODEL_ID int  NOT NULL,
    currency_days int  NULL,
    picture_url varchar(510)  NULL,
    aircraft_status varchar(255)  DEFAULT 'flight_line',
    CONSTRAINT AIRCRAFT_ak_1 UNIQUE (registration_nbr) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT aircraft_status CHECK (aircraft_status in ('grounded', 'flight_line', 'active')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT AIRCRAFT_pk PRIMARY KEY (AIRCRAFT_ID)
);

-- Table: AIRCRAFT_MODEL
CREATE TABLE AIRCRAFT_MODEL (
    AIRCRAFT_MODEL_ID serial  NOT NULL,
    faa_type_designation varchar(255)  NULL,
    category varchar(255)  NULL,
    class varchar(255)  NULL,
    make varchar(255)  NULL,
    model_id varchar(255)  NULL,
    popular_name varchar(255)  NULL,
    engine varchar(255)  NULL,
    turbo boolean  NULL,
    complex boolean  NULL,
    aerobatic boolean  NULL,
    tailwheel boolean  NULL,
    warbird boolean  NULL,
    biplane boolean  NULL,
    classic boolean  NULL,
    CONSTRAINT AIRCRAFT_MODEL_pk PRIMARY KEY (AIRCRAFT_MODEL_ID)
);

-- Table: AIRCRAFT_OWNERSHIP
CREATE TABLE AIRCRAFT_OWNERSHIP (
    OWNERSHIP_ID serial  NOT NULL,
    AIRCRAFT_ID int  NOT NULL,
    start_date date  NULL,
    end_date date  NULL,
    CONSTRAINT AIRCRAFT_OWNERSHIP_pk PRIMARY KEY (OWNERSHIP_ID)
);

-- Table: AIRPORT
CREATE TABLE AIRPORT (
    AIRPORT_ID serial  NOT NULL,
    airport_code varchar(255)  NOT NULL,
    airport_name varchar(255)  NOT NULL,
    lat varchar(255)  NULL,
    lon varchar(255)  NULL,
    control_tower boolean  NULL,
    CONSTRAINT AIRPORT_pk PRIMARY KEY (AIRPORT_ID)
);

-- Table: CATEGORY
CREATE TABLE CATEGORY (
    CATEGORY varchar(255)  NOT NULL,
    CONSTRAINT CATEGORY_pk PRIMARY KEY (CATEGORY)
);

-- Table: CERTIFICATE_TYPE
CREATE TABLE CERTIFICATE_TYPE (
    CERTIFICATE_TYPE varchar(100)  NOT NULL,
    CONSTRAINT CERTIFICATE_TYPE_pk PRIMARY KEY (CERTIFICATE_TYPE)
);

-- Table: CHECKOUT
CREATE TABLE CHECKOUT (
    CHECKOUT_ID serial  NOT NULL,
    MEMBERSHIP_ID int  NOT NULL,
    AIRCRAFT_ID int  NOT NULL,
    currency_end_date date  NULL,
    ifr_checkout boolean  NOT NULL DEFAULT false,
    CONSTRAINT CHECKOUT_ID PRIMARY KEY (CHECKOUT_ID)
);

-- Table: CLASS
CREATE TABLE CLASS (
    CLASS varchar(100)  NOT NULL,
    CONSTRAINT CLASS_pk PRIMARY KEY (CLASS)
);

-- Table: CONTACT
CREATE TABLE CONTACT (
    CONTACT_ID serial  NOT NULL,
    address varchar(255)  NULL,
    city varchar(255)  NULL,
    state varchar(255)  NULL,
    country varchar(255)  NULL,
    zip varchar(255)  NULL,
    phone varchar(255)  NULL,
    airnc varchar(255)  NULL,
    contact_type varchar(255)  NULL DEFAULT 'home',
    primary_contact boolean  NOT NULL DEFAULT true,
    fax varchar(255)  NULL,
    emergency_first_name varchar(255)  NULL,
    emergency_last_name varchar(255)  NULL,
    emergency_phone varchar(255)  NULL,
    AIRPORT_ID int  NULL,
    SCHOOL_ID int  NULL,
    PERSON_ID int  NULL,
    CONSTRAINT contact_type CHECK (contact_type in ('home', 'work', 'other')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT CONTACT_pk PRIMARY KEY (CONTACT_ID)
);

-- Table: DOCUMENTATION
CREATE TABLE DOCUMENTATION (
    DOCUMENT_ID serial  NOT NULL,
    PERSON_ID int  NOT NULL,
    medical_class varchar(255) NULL,
    medical_date date  NULL,
    rental_agreement boolean  NULL,
    faa_written_test_exp date  NULL,
    renters_insurance boolean  NULL,
    guardian_release_form boolean  NULL,
    photo_id boolean  NULL,
    passport boolean  NULL,
    birth_certificate boolean  NULL,
    tsa_endorsement boolean  NULL,
    background_check boolean  NULL,
    FIRC date  NULL,
    CONSTRAINT medical_class CHECK (medical_class in ('none', 'one', 'two', 'three')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT DOCUMENTATION_pk PRIMARY KEY (DOCUMENT_ID)
);

-- Table: FLIGHT
CREATE TABLE FLIGHT (
    FLIGHT_ID serial  NOT NULL,
    flight_creation_time timestamp DEFAULT current_timestamp NOT NULL,
    AIRCRAFT_ID int  NOT NULL,
    VA_pre_post boolean  NULL,
    No_show varchar(255)  NULL,
    beginning_tach decimal(10,2)  NULL,
    end_tach decimal(10,2)  NULL,
    billable_ground_hrs decimal(10,2)  NULL,
    cross_country boolean  NULL,
    SCHOOL_ID int  NULL,
    INVOICE_ID int  NULL,
    CUSTOMER_ID int  NULL,
    dispatch_time timestamp  NULL,
    DISPATCHED_BY int  NULL,
    INSTRUCTOR_ID int  NULL,
    sms_release_id varchar(255)  NULL,
    sms_complete_id varchar(255)  NULL,
    flight_status varchar(255) DEFAULT 'pinned' NOT NULL,
    flight_type varchar(255)  NULL,
    CONSTRAINT flight_status CHECK (flight_status in ('pinned', 'dispatched', 'in_flight', 'completed', 'closed', 'cancelled')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT flight_type CHECK (flight_type in ('checkout', 'flight_review', 'checkride', 'solo', 'renter', 'charter', 'intro_flight', 'training_flight', 'override')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT FLIGHT_pk PRIMARY KEY (FLIGHT_ID)
);

-- Table: INSTRUCTOR_CERTIFICATE
CREATE TABLE INSTRUCTOR_CERTIFICATE (
    INSTRUCTOR_CERTIFICATE_ID serial  NOT NULL,
    single_engine_instructor boolean  NOT NULL,
    instrument_instructor boolean  NOT NULL,
    multi_engine_instructor boolean  NOT NULL,
    basic_ground_instructor boolean  NOT NULL,
    advanced_ground_instructor boolean  NOT NULL,
    instrument_ground_instructor boolean  NOT NULL,
    helicopter_instructor boolean  NOT NULL,
    sport_pilot_instructor boolean  NOT NULL,
    PERSON_ID int  NOT NULL,
    CONSTRAINT INSTRUCTOR_CERTIFICATE_pk PRIMARY KEY (INSTRUCTOR_CERTIFICATE_ID)
);

-- Table: INVITE
CREATE TABLE INVITE (
    INVITE_ID serial  NOT NULL,
    onboarding_status varchar(255) DEFAULT 'open' NOT NULL,
    invite_sent boolean DEFAULT false NOT NULL,
    password varchar(255) NULL,
    SCHOOL_ID int  NULL,
    LOGIN_ID int  NULL,
    CONSTRAINT onboarding_status CHECK (onboarding_status in ('open', 'pending', 'responded', 'accepted')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT INVITE_pk PRIMARY KEY (INVITE_ID)
);

-- Table: INVOICE
CREATE TABLE INVOICE (
    INVOICE_ID serial  NOT NULL,
    invoice_no varchar(255)  NULL,
    flight_id varchar(255)  NOT NULL,
    CONSTRAINT INVOICE_ak_1 UNIQUE (flight_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT INVOICE_pk PRIMARY KEY (INVOICE_ID)
);

-- Table: LANDING
CREATE TABLE LANDING (
    LANDING_ID serial  NOT NULL,
    LEG_ID int  NULL,
    LANDING_CODE varchar(50)  NULL,
    CONSTRAINT LANDING_ak_1 UNIQUE (LEG_ID) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT LANDING_pk PRIMARY KEY (LANDING_ID)
);

-- Table: LANDING_CODE
CREATE TABLE LANDING_CODE (
    LANDING_CODE varchar(50)  NOT NULL,
    DESCRIPTION varchar(255)  NOT NULL,
    CONSTRAINT description CHECK (landing_code in ('standard', 'crosswind', 'slip', 'rejected', 'short_field', 'soft_field', 'night')) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT LANDING_CODE_pk PRIMARY KEY (LANDING_CODE)
);

-- Table: LEG
CREATE TABLE LEG (
    LEG_ID serial  NOT NULL,
    FLIGHT_ID int  NULL,
    beginning_hobbs decimal(10,1)  NULL,
    end_hobbs decimal(10,1)  NULL,
    DEPARTURE_AIRPORT_ID int  NULL,
    ARRIVAL_AIRPORT_ID int  NULL,
    CONSTRAINT LEG_pk PRIMARY KEY (LEG_ID)
);

-- Table: LOGIN
CREATE TABLE LOGIN (
    LOGIN_ID serial  NOT NULL,
    username varchar(100)  NULL,
    email varchar(255)  NULL,
    password varchar(255)  NULL,
    is_validated boolean  NULL,
    requested_school varchar(255)  NULL,
    createdAt timestamp  NOT NULL,
    modifiedAt timestamp  NULL,
    --CONSTRAINT LOGIN_ak_1 UNIQUE (username) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT LOGIN_pk PRIMARY KEY (LOGIN_ID)
);

-- Table: MEMBERSHIP
CREATE TABLE MEMBERSHIP (
    MEMBERSHIP_ID serial  NOT NULL,
    membership_type varchar(255)  NULL,
    PERSON_ID int  NULL,
    SCHOOL_ID int  NOT NULL,
    agreement_signed date  NULL,
    member_since date  NOT NULL DEFAULT current_date,
    member_view_rights boolean DEFAULT false NOT NULL,
    instructor_view_rights boolean  DEFAULT false NOT NULL,
    dispatch_view_rights boolean  DEFAULT false NOT NULL,
    admin_view_rights boolean  DEFAULT false NOT NULL,
    CONSTRAINT MEMBERSHIP_pk PRIMARY KEY (MEMBERSHIP_ID)
);

-- Table: PERSON
CREATE TABLE PERSON (
    PERSON_ID serial  NOT NULL,
    first_name varchar(255)  NOT NULL,
    last_name varchar(255)  NOT NULL,
    mobile varchar(255)  NULL,
    email varchar(255)  NULL,
    dob date  NULL,
    regulation_type varchar(255)  NULL,
    flight_review_date date  NULL,
    picture_url varchar(255)  NULL,
    instruction_rate money  NULL,
    FAA_CERTIFICATE_NUMBER varchar(255) NULL,
    FAA_CERTIFICATE_DESC varchar(300)  NULL,
    FAA_INSTRUCTOR_CERTIFICATE_NUMBER int  NULL,
    LOGIN_ID int  NULL,
    CONSTRAINT id PRIMARY KEY (PERSON_ID)
);

-- Table: PILOT_CERTIFICATE
CREATE TABLE PILOT_CERTIFICATE (
    PILOT_CERTIFICATE_ID serial  NOT NULL,
    certificate_type varchar(100)  NULL,
    CATEGORY varchar (255)  NOT NULL,
    class varchar(100)  NULL,
    PERSON_ID int  NOT NULL,
    instrument_rating boolean  NULL,
    high_performance boolean  NULL,
    complex boolean  NULL,
    tailwheel boolean  NULL,
    high_altitude boolean  NULL,
    nvg boolean  NULL,
    external_load boolean  NULL,
    aero_tow boolean  NULL,
    winch_launch boolean  NULL,
    CONSTRAINT PILOT_CERTIFICATE_pk PRIMARY KEY (PILOT_CERTIFICATE_ID)
);

-- Table: SCHOOL
CREATE TABLE SCHOOL (
    SCHOOL_ID serial  NOT NULL,
    School_Name varchar(255)  NOT NULL,
    notification_email varchar(255)  NULL,
    school_logo varchar(255)  NULL,
    CONSTRAINT SCHOOL_pk PRIMARY KEY (SCHOOL_ID)
);

-- Table: SERVICE
CREATE TABLE SERVICE (
    SERVICE_ID serial  NOT NULL,
    SCHOOL_ID int  NULL,
    SERVICE_TYPE varchar(255)  NOT NULL,
    CONSTRAINT SERVICE_pk PRIMARY KEY (SERVICE_ID)
);

-- Table: SERVICE_TYPE
CREATE TABLE SERVICE_TYPE (
    SERVICE_TYPE varchar(255)  NOT NULL,
    title varchar(255)  NOT NULL,
    CONSTRAINT SERVICE_TYPE_pk PRIMARY KEY (SERVICE_TYPE)
);

-- Table: SQUAWK
CREATE TABLE SQUAWK (
    SQUAWK_ID serial  NOT NULL,
    entry_date date  NOT NULL,
    repair_date date  NULL,
    report varchar(20000) NOT NULL,
    AIRCRAFT_ID int  NOT NULL,
    REPORTER_REFERENCE_ID int  NOT NULL,
    CONSTRAINT SQUAWK_pk PRIMARY KEY (SQUAWK_ID)
);

-- Table: STUDENT_ENDORSMENTS
CREATE TABLE STUDENT_ENDORSEMENTS (
    STUDENT_ENDORSEMENT_ID serial  NOT NULL,
    MEMBERSHIP_ID int NOT NULL,
    student_solo boolean NULL,
    student_endorsement_end_date date NULL,
    AIRCRAFT_ID int  NOT NULL,
    INSTRUCTOR_ID int  NOT NULL,
    CONSTRAINT STUDENT_ENDORSEMENTS_pk PRIMARY KEY (STUDENT_ENDORSEMENT_ID)
);

-- views
-- View: aircraft_flights_vw
CREATE VIEW aircraft_flights_vw AS
SELECT resultset.flight_id,
    resultset.school_id,
    resultset.customer_id,
    resultset.aircraft_id,
    resultset.employee_id,
    resultset.beginning_tach,
    resultset.end_tach,
    resultset.flight_creation_time,
    resultset.cross_country,
    resultset.billable_ground_hrs,
    resultset.dispatched_by,
    resultset.flight_status,
    resultset.squawk_id,
    resultset.entry_date,
    resultset.repair_date,
    resultset.reporter_reference_id,
    resultset.dispatcher_first_name,
    resultset.dispatcher_last_name,
    resultset.dispatcher_mobile,
    resultset.customer_first_name,
    resultset.customer_last_name,
    resultset.picture_url,
    resultset.customer_mobile,
    resultset.emergency_first,
    resultset.emergency_last,
    resultset.emergency_phone,
    resultset.employee_first_name,
    resultset.employee_last_name,
    resultset.employee_mobile,
    resultset.dispatch_time,
    resultset.registration_nbr,
    resultset.hundred_hr_inspection,
    resultset.aircraft_picture_url,
    resultset.faa_type_designation,
    resultset.category,
    resultset.class,
    resultset.make,
    resultset.model_id,
    resultset.popular_name,
    resultset.engine,
    resultset.beginning_hobbs,
    resultset.ending_hobbs
--        CASE
--            WHEN resultset.is_grounded THEN 'Grounded'::text
--            WHEN resultset.dispatch_time IS NULL THEN 'On Line'::text
--            WHEN resultset.dispatch_time IS NOT NULL AND resultset.count = 0 THEN 'Pinned'::text
--            WHEN resultset.count > 0 AND resultset.beginning_hobbs IS NOT NULL AND resultset.ending_hobbs IS NULL THEN 'Active'::text
--            WHEN resultset.count > 0 AND resultset.beginning_hobbs IS NOT NULL AND resultset.ending_hobbs IS NOT NULL THEN 'Completed'::text
--            ELSE 'Pinned'::text
--        END AS status,
--        CASE
--            WHEN resultset.employee_id IS NULL THEN 'solo'::text
--            ELSE NULL::text
--        END AS customer_type
   FROM ( SELECT row_number() OVER (PARTITION BY f.flight_id ORDER BY l.leg_id DESC) AS rown,
            f.flight_id,
            f.school_id,
            f.customer_id,
            a.aircraft_id,
            employee.person_id AS employee_id,
            f.beginning_tach,
            f.end_tach,
            f.flight_creation_time,
            f.cross_country,
            f.billable_ground_hrs,
            f.dispatched_by,
            f.flight_status,
            sq.squawk_id,
            sq.entry_date,
            sq.repair_date,
            sq.reporter_reference_id,
            dispatcher.first_name AS dispatcher_first_name,
            dispatcher.last_name AS dispatcher_last_name,
            dispatcher.mobile AS dispatcher_mobile,
            customer.first_name AS customer_first_name,
            customer.last_name AS customer_last_name,
            customer.picture_url AS picture_url,
            customer.mobile AS customer_mobile,
            customer_contact.emergency_first_name AS emergency_first,
            customer_contact.emergency_last_name AS emergency_last,
            customer_contact.emergency_phone AS emergency_phone,
            employee.first_name AS employee_first_name,
            employee.last_name AS employee_last_name,
            employee.mobile AS employee_mobile,
            f.dispatch_time,
            a.registration_nbr,
            a.hundred_hr_inspection,
            a.picture_url AS aircraft_picture_url,
            m.faa_type_designation,
            m.category,
            m.class,
            m.make,
            m.model_id,
            m.popular_name,
            m.engine,
            first_value(l.beginning_hobbs) OVER (PARTITION BY l.flight_id ORDER BY l.leg_id) AS beginning_hobbs,
            last_value(l.end_hobbs) OVER (PARTITION BY l.flight_id ORDER BY l.leg_id) AS ending_hobbs,
            count(l.leg_id) OVER (PARTITION BY f.flight_id ORDER BY l.leg_id) AS count
           FROM aircraft a
             JOIN aircraft_model m USING (aircraft_model_id)
             LEFT JOIN flight f ON a.aircraft_id = f.aircraft_id
             LEFT JOIN leg l ON f.flight_id = l.flight_id
             LEFT JOIN squawk sq ON a.aircraft_id = sq.aircraft_id
             LEFT JOIN person customer ON customer.person_id = f.customer_id
             LEFT JOIN person dispatcher ON f.dispatched_by = dispatcher.person_id
             LEFT JOIN person employee ON employee.person_id = f.instructor_id
             LEFT JOIN contact dispatcher_contact ON dispatcher.person_id = dispatcher_contact.person_id
             LEFT JOIN contact customer_contact ON customer.person_id = customer_contact.person_id
             LEFT JOIN contact employee_contact ON employee.person_id = employee_contact.person_id
          WHERE 1 = 1 AND f.flight_creation_time > ('now'::text::date - '90 days'::interval)) resultset
  WHERE resultset.rown = 1
  ORDER BY resultset.flight_status;

COMMENT ON VIEW aircraft_flights_vw IS 'provides a denormalized view of aircrafts, customer, employee (instructor), dispatcher, aircraft_model, flights and legs and provides status of the flight';;

-- foreign keys
-- Reference: AGREEMENT_SCHOOL (table: AGREEMENT)
ALTER TABLE AGREEMENT ADD CONSTRAINT AGREEMENT_SCHOOL
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: AIRCRAFTOWNERSHIP_AIRCRAFT (table: AIRCRAFT_OWNERSHIP)
ALTER TABLE AIRCRAFT_OWNERSHIP ADD CONSTRAINT AIRCRAFTOWNERSHIP_AIRCRAFT
    FOREIGN KEY (AIRCRAFT_ID)
    REFERENCES AIRCRAFT (AIRCRAFT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: AIRCRAFT_SQUAWK (table: SQUAWK)
ALTER TABLE SQUAWK ADD CONSTRAINT AIRCRAFT_SQUAWK
    FOREIGN KEY (AIRCRAFT_ID)
    REFERENCES AIRCRAFT (AIRCRAFT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: CHECKOUT_AIRCRAFT (table: CHECKOUT)
ALTER TABLE CHECKOUT ADD CONSTRAINT CHECKOUT_AIRCRAFT
    FOREIGN KEY (AIRCRAFT_ID)
    REFERENCES AIRCRAFT (AIRCRAFT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: CHECKOUT_MEMBERSHIP (table: CHECKOUT)
ALTER TABLE CHECKOUT ADD CONSTRAINT CHECKOUT_MEMBERSHIP
    FOREIGN KEY (MEMBERSHIP_ID)
    REFERENCES MEMBERSHIP (MEMBERSHIP_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: CONTACT_AIRPORT (table: CONTACT)
ALTER TABLE CONTACT ADD CONSTRAINT CONTACT_AIRPORT
    FOREIGN KEY (AIRPORT_ID)
    REFERENCES AIRPORT (AIRPORT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: CONTACT_CUSTOMER (table: CONTACT)
ALTER TABLE CONTACT ADD CONSTRAINT CONTACT_CUSTOMER
    FOREIGN KEY (PERSON_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: CONTACT_SCHOOL (table: CONTACT)
ALTER TABLE CONTACT ADD CONSTRAINT CONTACT_SCHOOL
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: CUSTOMER_PERSON (table: PERSON)
ALTER TABLE PERSON ADD CONSTRAINT PERSON_LOGIN
    FOREIGN KEY (LOGIN_ID)
    REFERENCES LOGIN (LOGIN_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: DOCUMENT_STUDENT (table: DOCUMENTATION)
ALTER TABLE DOCUMENTATION ADD CONSTRAINT DOCUMENT_STUDENT
    FOREIGN KEY (PERSON_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FLIGHT_AIRCRAFT (table: FLIGHT)
ALTER TABLE FLIGHT ADD CONSTRAINT FLIGHT_AIRCRAFT
    FOREIGN KEY (AIRCRAFT_ID)
    REFERENCES AIRCRAFT (AIRCRAFT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FLIGHT_INVOICE (table: FLIGHT)
ALTER TABLE FLIGHT ADD CONSTRAINT FLIGHT_INVOICE
    FOREIGN KEY (INVOICE_ID)
    REFERENCES INVOICE (INVOICE_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FLIGHT_PERSON (table: FLIGHT)
ALTER TABLE FLIGHT ADD CONSTRAINT FLIGHT_PERSON
    FOREIGN KEY (INSTRUCTOR_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FLIGHT_STUDENT (table: FLIGHT)
ALTER TABLE FLIGHT ADD CONSTRAINT FLIGHT_STUDENT
    FOREIGN KEY (CUSTOMER_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LANDING_TYPE_LANDING_CODE (table: LANDING)
ALTER TABLE LANDING ADD CONSTRAINT LANDING_TYPE_LANDING_CODE
    FOREIGN KEY (LANDING_CODE)
    REFERENCES LANDING_CODE (LANDING_CODE)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LEG_AIRPORT_ARRIVAL (table: LEG)
ALTER TABLE LEG ADD CONSTRAINT LEG_AIRPORT_ARRIVAL
    FOREIGN KEY (ARRIVAL_AIRPORT_ID)
    REFERENCES AIRPORT (AIRPORT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LEG_AIRPORT_DEPARTURE (table: LEG)
ALTER TABLE LEG ADD CONSTRAINT LEG_AIRPORT_DEPARTURE
    FOREIGN KEY (DEPARTURE_AIRPORT_ID)
    REFERENCES AIRPORT (AIRPORT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LEG_FLIGHT (table: LEG)
ALTER TABLE LEG ADD CONSTRAINT LEG_FLIGHT
    FOREIGN KEY (FLIGHT_ID)
    REFERENCES FLIGHT (FLIGHT_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LEG_LANDING (table: LANDING)
ALTER TABLE LANDING ADD CONSTRAINT LEG_LANDING
    FOREIGN KEY (LEG_ID)
    REFERENCES LEG (LEG_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LICENSE_PERSON (table: INSTRUCTOR_CERTIFICATE)
ALTER TABLE INSTRUCTOR_CERTIFICATE ADD CONSTRAINT LICENSE_PERSON
    FOREIGN KEY (PERSON_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: MEMBERSHIP_SCHOOL (table: MEMBERSHIP)
ALTER TABLE MEMBERSHIP ADD CONSTRAINT MEMBERSHIP_SCHOOL
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: MODEL_AIRCRAFT (table: AIRCRAFT)
ALTER TABLE AIRCRAFT ADD CONSTRAINT MODEL_AIRCRAFT
    FOREIGN KEY (AIRCRAFT_MODEL_ID)
    REFERENCES AIRCRAFT_MODEL (AIRCRAFT_MODEL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PERSON_FLIGHT (table: FLIGHT)
ALTER TABLE FLIGHT ADD CONSTRAINT PERSON_FLIGHT
    FOREIGN KEY (INSTRUCTOR_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;


-- Reference: INVITE_PERSON (table: INVITE)
ALTER TABLE INVITE ADD CONSTRAINT INVITE_LOGIN
    FOREIGN KEY (LOGIN_ID)
    REFERENCES LOGIN (LOGIN_ID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;


-- Reference: INVITE_SCHOOL (table: INVITE)
ALTER TABLE INVITE ADD CONSTRAINT INVITE_SCHOOL
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: PILOT_CERTIFICATE_CATEGORY (table: PILOT_CERTIFICATE)
ALTER TABLE PILOT_CERTIFICATE ADD CONSTRAINT PILOT_CERTIFICATE_CATEGORY
    FOREIGN KEY (CATEGORY)
    REFERENCES CATEGORY (CATEGORY)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PILOT_CERTIFICATE_CERTIFICATE_TYPE (table: PILOT_CERTIFICATE)
ALTER TABLE PILOT_CERTIFICATE ADD CONSTRAINT PILOT_CERTIFICATE_CERTIFICATE_TYPE
    FOREIGN KEY (certificate_type)
    REFERENCES CERTIFICATE_TYPE (CERTIFICATE_TYPE)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PILOT_CERTIFICATE_CLASS (table: PILOT_CERTIFICATE)
ALTER TABLE PILOT_CERTIFICATE ADD CONSTRAINT PILOT_CERTIFICATE_CLASS
    FOREIGN KEY (class)
    REFERENCES CLASS (CLASS)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PILOT_CERTIFICATE_PERSON (table: PILOT_CERTIFICATE)
ALTER TABLE PILOT_CERTIFICATE ADD CONSTRAINT PILOT_CERTIFICATE_PERSON
    FOREIGN KEY (PERSON_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SCHOOL_AIRCRAFT (table: AIRCRAFT)
ALTER TABLE AIRCRAFT ADD CONSTRAINT SCHOOL_AIRCRAFT
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SCHOOL_FLIGHT (table: FLIGHT)
ALTER TABLE FLIGHT ADD CONSTRAINT SCHOOL_FLIGHT
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SERVICE_SCHOOL (table: SERVICE)
ALTER TABLE SERVICE ADD CONSTRAINT SERVICE_SCHOOL
    FOREIGN KEY (SCHOOL_ID)
    REFERENCES SCHOOL (SCHOOL_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SERVICE_SERVICETYPE (table: SERVICE)
ALTER TABLE SERVICE ADD CONSTRAINT SERVICE_SERVICETYPE
    FOREIGN KEY (SERVICE_TYPE)
    REFERENCES SERVICE_TYPE (SERVICE_TYPE)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SQUAWK_PERSON (table: SQUAWK)
ALTER TABLE SQUAWK ADD CONSTRAINT SQUAWK_PERSON
    FOREIGN KEY (REPORTER_REFERENCE_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: USER_MEMBERSHIP (table: MEMBERSHIP)
ALTER TABLE MEMBERSHIP ADD CONSTRAINT USER_MEMBERSHIP
    FOREIGN KEY (PERSON_ID)
    REFERENCES PERSON (PERSON_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: STUDENT_ENDORSEMENTS_MEMBERSHIP (table: MEMBERSHIP)
ALTER TABLE STUDENT_ENDORSEMENTS ADD CONSTRAINT STUDENT_ENDORSEMENTS_MEMBERSHIP
    FOREIGN KEY (MEMBERSHIP_ID)
    REFERENCES MEMBERSHIP (MEMBERSHIP_ID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: STUDENT_ENDORSEMENTS_AIRCRAFT (table: MEMBERSHIP)
ALTER TABLE STUDENT_ENDORSEMENTS ADD CONSTRAINT STUDENT_ENDORSEMENTS_AIRCRAFT
    FOREIGN KEY (AIRCRAFT_ID)
    REFERENCES AIRCRAFT (AIRCRAFT_ID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: STUDENT_ENDORSEMENTS_INSTRUCTOR (table: MEMBERSHIP)
ALTER TABLE STUDENT_ENDORSEMENTS ADD CONSTRAINT STUDENT_ENDORSEMENTS_PERSON
    FOREIGN KEY (INSTRUCTOR_ID)
    REFERENCES PERSON (PERSON_ID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = wilbur, pg_catalog;


--
-- Data for Name: school; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO school (school_id, school_name, notification_email, school_logo) VALUES (88, 'Namey McNamerson', 'willie.witten@gmail.com', NULL);
INSERT INTO school (school_id, school_name, notification_email, school_logo) VALUES (1, 'Look Ma, No Wings!', 'willie.witten@gmail.com', 'https://upload.wikimedia.org/wikipedia/en/3/3a/Wings_title_screen.jpg');
INSERT INTO school (school_id, school_name, notification_email, school_logo) VALUES (2, 'Aviaton Nation Station', 'willie.witten@gmail.com', 'https://upload.wikimedia.org/wikipedia/en/4/46/Top_Gun_Movie.jpg');


--
-- Data for Name: agreement; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--



--
-- Data for Name: aircraft_model; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (292, 'ST75', 'Airplane', 'Single Engine Land', 'BOEING', 'PT-17', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (293, 'ST75', 'Airplane', 'Single Engine Land', 'BOEING', 'PT-18', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (294, 'ST75', 'Airplane', 'Single Engine Land', 'BOEING', 'PT-27', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (295, 'ST75', 'Airplane', 'Single Engine Land', 'STEARMAN', '75', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (296, 'ST75', 'Airplane', 'Single Engine Land', 'STEARMAN', 'PT-13', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (297, 'ST75', 'Airplane', 'Single Engine Land', 'STEARMAN', 'PT-17', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (298, 'R22', 'Rotorcraft', 'Helicopter', 'ROBINSON', 'R-22', 'R-22', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (299, 'R22', 'Rotorcraft', 'Helicopter', 'ROBINSON', 'R-22', 'R-22 Beta', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (300, 'R44', 'Rotorcraft', 'Helicopter', 'ROBINSON', 'R-44', 'R-44 Astro', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (301, 'R44', 'Rotorcraft', 'Helicopter', 'ROBINSON', 'R-43', 'R-44 Clipper', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (302, 'R44', 'Rotorcraft', 'Helicopter', 'ROBINSON', 'R-42', 'R-44 Raven', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (303, 'R66', 'Rotorcraft', 'Helicopter', 'ROBINSON', 'R-66', 'R-66', 'Turbine', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (304, 'H275', 'Rotorcraft', 'Helicopter', 'HUGHES', '269', '269', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (305, 'H275', 'Rotorcraft', 'Helicopter', 'HUGHES', '269A', '269', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (306, 'H275', 'Rotorcraft', 'Helicopter', 'HUGHES', '269B', '300', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (307, 'H275', 'Rotorcraft', 'Helicopter', 'HUGHES', '269C', '300C', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (308, 'H275', 'Rotorcraft', 'Helicopter', 'HUGHES', '300C', '300C', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (309, 'H275', 'Rotorcraft', 'Helicopter', 'SCHWEIZER', '300C', '300C', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (310, 'H275', 'Rotorcraft', 'Helicopter', 'SCHWEIZER', '300CQ', 'Sky Knight', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (311, 'H275', 'Rotorcraft', 'Helicopter', 'SCHWEIZER', '300CB', '300CB', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (312, 'H275', 'Rotorcraft', 'Helicopter', 'SCHWEIZER', '300CBi', '300CBi', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (313, 'H275', 'Rotorcraft', 'Helicopter', 'SIKORSKY', 'S-300C', 'S-300C', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (314, NULL, 'Simulator', 'Full Motion', 'REDBIRD', 'FMX', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (315, NULL, 'Simulator', 'Full Motion', 'REDBIRD', 'MCX', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (316, NULL, 'Simulator', 'Full Motion', 'REDBIRD', 'AMS', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (317, NULL, 'Simulator', 'Full Motion', 'REDBIRD', 'MX2', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (318, NULL, 'Simulator', 'Full Motion', 'REDBIRD', 'VTO', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (319, NULL, 'Simulator', 'Desktop', 'REDBIRD', 'JAY', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (320, NULL, 'Simulator', 'Desktop', 'REDBIRD', 'TD', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (321, NULL, 'Simulator', 'Desktop', 'REDBIRD', 'TD2', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (322, NULL, 'Simulator', 'Stationary', 'REDBIRD', 'SD', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (323, NULL, 'Simulator', 'Stationary', 'REDBIRD', 'LD', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (324, NULL, 'Simulator', 'Full Motion', 'REDBIRD', 'XWND', NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (325, NULL, 'Simulator', 'Destop', 'ELITE', NULL, NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (326, NULL, 'Simulator', 'Stationary', 'FRASCA', NULL, NULL, NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (2, 'AA1', 'Airplane', 'Single Engine Land', 'AMERICAN', 'AA-1A', 'Trainer', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (3, 'AA1', 'Airplane', 'Single Engine Land', 'AMERICAN', 'AA-1', 'Yankee Clipper', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (4, 'AA1', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-1C', 'Lynx', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (5, 'AA1', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-1C', 'T-Cat', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (6, 'AA1', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-1B', 'TR-2', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (7, 'AA1', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-1A', 'Trainer', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (8, 'AA1', 'Airplane', 'Single Engine Land', 'GULFSTREAM AMERICAN', 'AA-1C', 'Lynx', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (9, 'AA1', 'Airplane', 'Single Engine Land', 'GULFSTREAM AMERICAN', 'AA-1C', 'T-Cat', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (10, 'AA5', 'Airplane', 'Single Engine Land', 'AMERICAN', 'AA-5', 'Traveler', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (11, 'AA5', 'Airplane', 'Single Engine Land', 'AMERICAN GENERAL', 'AG-5B', 'Tiger', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (12, 'AA5', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-5A', 'Cheetah', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (13, 'AA5', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-5B', 'Tiger', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (14, 'AA5', 'Airplane', 'Single Engine Land', 'GRUMMAN AMERICAN', 'AA-5', 'Traveler', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (15, 'AA5', 'Airplane', 'Single Engine Land', 'GULFSTREAM AMERICAN', 'AA-5A', 'Cheetah', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (16, 'AA5', 'Airplane', 'Single Engine Land', 'GULFSTREAM AMERICAN', 'AA-5B', 'Tiger', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (17, 'AA5', 'Airplane', 'Single Engine Land', 'TIGER', 'AG-5B', 'Tiger', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (18, 'BE23', 'Airplane', 'Single Engine Land', 'BEECH', 'BE-23', 'Musketeer', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (19, 'BE23', 'Airplane', 'Single Engine Land', 'BEECH', 'BE-23', 'Sundowner', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (20, 'BE24', 'Airplane', 'Single Engine Land', 'BEECH', 'BE-24', 'Musketeer Super', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (21, 'BE24', 'Airplane', 'Single Engine Land', 'BEECH', 'BE-24', 'Sierra', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (22, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', '95-55', 'Baron', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (23, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', '95-A55', 'Baron', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (24, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', '95-B55', 'Baron', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (25, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', '95-C55', 'Baron', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (26, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', '95-D55', 'Baron', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (27, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', '95-E55', 'Baron', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (28, 'BE55', 'Airplane', 'Multiengine Land', 'BEECH', 'T-42A', 'Cochise', 'High Performance Piston', false, false, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (29, 'BE76', 'Airplane', 'Multiengine Land', 'BEECH', 'BE-76', 'Duchess', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (30, 'CH7A', 'Airplane', 'Single Engine Land', 'CHAMPION', '7ECA', 'Citabria', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (31, 'CH7A', 'Airplane', 'Single Engine Land', 'BELLANCA', '7ECA', 'Citabria “Standard"', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (32, 'CH7A', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '7ECA', 'Citabria Aurora', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (33, 'CH7B', 'Airplane', 'Single Engine Land', 'CHAMPION', '7GCAA', 'Citabria 150', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (34, 'CH7B', 'Airplane', 'Single Engine Land', 'BELLANCA', '7GCAA', 'Citabria “A” Package', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (35, 'CH7B', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '7GCAA', 'Citabria Adventure', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (36, 'CH7B', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '7GCAA', 'Citabria Ultimate Adventure', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (37, 'CH7B', 'Airplane', 'Single Engine Land', 'CHAMPION', '7GCBC', 'Citabria 150S', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (38, 'CH7B', 'Airplane', 'Single Engine Land', 'BELLANCA', '7GCBC', 'Citabria “C” Package', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (39, 'CH7B', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '7GCBC', 'Citabria Explorer', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (40, 'CH7B', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '7GCBC', 'Citabria High Country Explorer', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (41, 'CH7B', 'Airplane', 'Single Engine Land', 'CHAMPION', '7KCAB', 'Citabria', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (42, 'CH7B', 'Airplane', 'Single Engine Land', 'BELLANCA', '7KCAB', 'Citabria “B” Package', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (43, 'BL8', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '8GCBC', 'Scout', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (44, 'BL8', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '8KCAB', 'Decathlon', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (45, 'BL8', 'Airplane', 'Single Engine Land', 'AMERICAN CHAMPION', '8KCAB', 'Super Decathlon', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (46, 'BL8', 'Airplane', 'Single Engine Land', 'BELLANCA', '8GCBC', 'Scout', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (47, 'BL8', 'Airplane', 'Single Engine Land', 'BELLANCA', '8KCAB', 'Decathlon', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (48, 'BL8', 'Airplane', 'Single Engine Land', 'CHAMPION', '8KCAB', 'Decathlon', 'Piston', false, false, true, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (49, 'C120', 'Airplane', 'Single Engine Land', 'CESSNA', '120', '120', 'Piston', false, false, false, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (50, 'C140', 'Airplane', 'Single Engine Land', 'CESSNA', '140', '140', 'Piston', false, false, false, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (51, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150', '150', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (52, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150A', '150A', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (53, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150B', '150B', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (54, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150C', '150C', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (55, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150D', '150D', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (56, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150E', '150E', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (57, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150F', '150F', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (58, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150G', '150G', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (59, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150H', '150H', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (60, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150J', '150J', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (61, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150K', '150K', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (62, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', 'A150K', '150K Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (63, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150L', '150L', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (64, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', 'A150L', '150L Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (65, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', '150M', '150M', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (66, 'C150', 'Airplane', 'Single Engine Land', 'CESSNA', 'A150M', '150M Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (67, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150F', '150F', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (68, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150G', '150G', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (69, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150H', '150H', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (70, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150J', '150J', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (71, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150K', '150K', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (72, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', 'A150K', '150K Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (73, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150L', '150L', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (74, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', 'A150L', '150L Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (75, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', '150M', '150M', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (76, 'C150', 'Airplane', 'Single Engine Land', 'REIMS', 'A150M', '150M Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (77, 'C152', 'Airplane', 'Single Engine Land', 'CESSNA', '152', '152', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (78, 'C152', 'Airplane', 'Single Engine Land', 'CESSNA', 'A152', '152 Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (79, 'C152', 'Airplane', 'Single Engine Land', 'REIMS', 'F152', '152', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (80, 'C152', 'Airplane', 'Single Engine Land', 'REIMS', 'FA152', 'A152 Aerobat', 'Piston', false, false, true, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (81, 'C162', 'Airplane', 'Single Engine Land', 'CESSNA', '162', 'Skycatcher', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (82, 'C170', 'Airplane', 'Single Engine Land', 'CESSNA', '170', '170', 'Piston', false, false, false, true, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (83, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (84, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172A', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (85, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172B', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (86, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172C', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (87, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172D', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (88, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172E', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (89, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172F', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (90, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172G', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (91, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172H', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (92, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172I', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (93, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172K', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (94, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172L', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (95, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172M', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (96, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172N', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (97, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172P', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (98, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172Q', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (99, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172R', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (100, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172SP', '172', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (101, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', '172RG', 'Cutlass', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (102, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', 'T-41A', 'Mescalero', 'Piston', false, false, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (103, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', 'T-41B', 'Mescalero', 'High Performance Piston', false, false, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (104, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', 'T-41C', 'Mescalero', 'High Performance Piston', false, false, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (105, 'C172', 'Airplane', 'Single Engine Land', 'CESSNA', 'T-41D', 'Mescalero', 'High Performance Piston', false, false, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (106, 'C175', 'Airplane', 'Single Engine Land', 'CESSNA', '175', 'Skylark', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (107, 'C177', 'Airplane', 'Single Engine Land', 'CESSNA', '177', 'Cardinal', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (108, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182', NULL, 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (109, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182A', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (110, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182B', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (111, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182C', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (112, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182D', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (113, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182E', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (114, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182F', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (115, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182G', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (116, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182H', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (117, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182J', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (118, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182K', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (119, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182L', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (120, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182M', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (121, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182N', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (122, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182P', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (123, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182Q', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (124, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182R', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (125, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182S', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (126, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', '182T', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (127, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', 'R182', 'Skylane RG', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (128, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', 'T182', NULL, 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (129, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', 'T182T', 'Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (130, 'C182', 'Airplane', 'Single Engine Land', 'CESSNA', 'TR182', 'Turbo Skylane RG', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (131, 'C205', 'Airplane', 'Single Engine Land', 'CESSNA', '205', NULL, 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (132, 'C205', 'Airplane', 'Single Engine Land', 'CESSNA', '205A', NULL, 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (133, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', '206', NULL, 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (134, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206', 'Super Skywagon', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (135, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206A', 'Super Skywagon', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (136, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206B', 'Super Skywagon', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (137, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206C', 'Super Skywagon', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (138, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206D', 'Super Skywagon', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (139, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206E', 'Super Skywagon', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (140, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206F', 'Stationaire', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (141, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'U206G', 'Stationaire', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (142, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'P206', 'Super Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (143, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'P206A', 'Super Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (144, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'P206B', 'Super Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (145, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'P206C', 'Super Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (146, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'P206D', 'Super Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (147, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'P206E', 'Super Skylane', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (148, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206A', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (149, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206B', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (150, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206C', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (151, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206D', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (152, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206E', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (153, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206F', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (154, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TU206G', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (155, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TP206A', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (156, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TP206B', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (157, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TP206C', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (158, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TP206D', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (159, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'TP206E', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (160, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', '206H', NULL, 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (161, 'C206', 'Airplane', 'Single Engine Land', 'CESSNA', 'T206H', NULL, 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (162, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310', '310', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (163, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310A', '310A', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (164, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310B', '310B', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (165, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310C', '310C', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (166, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310D', '310D', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (167, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310E', '310E', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (168, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310F', '310F', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (169, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310G', '310G', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (170, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310H', '310H', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (171, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310I', '310I', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (172, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310J', '310J', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (173, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310K', '310K', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (174, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310L', '310L', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (175, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310M', '310M', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (176, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310N', '310N', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (177, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310P', '310P', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (178, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310Q', '310Q', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (179, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', '310R', '310R', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (180, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', 'T-310', 'T-310', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (181, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', 'L-27A', 'L-27A', 'High Performance Piston', false, true, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (182, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', 'L-27B', 'L-27B', 'High Performance Piston', false, true, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (183, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', 'U-3A', 'U-3A', 'High Performance Piston', false, true, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (184, 'C310', 'Airplane', 'Multiengine Land', 'CESSNA', 'U-3B', 'U-3B', 'High Performance Piston', false, true, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (185, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (186, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320A', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (187, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320B', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (188, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320C', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (189, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320D', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (190, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320E', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (191, 'C320', 'Airplane', 'Multiengine Land', 'CESSNA', '320F', 'Skyknight', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (192, 'DA40', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-40', NULL, 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (193, 'DA42', 'Airplane', 'Multiengine Land', 'DIAMOND', 'DA-42', NULL, 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (194, 'DV20', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-20', NULL, 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (195, 'DV20', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-20', 'Eclipse', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (196, 'DV20', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-20', 'Evolution', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (197, 'DV20', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-20', 'Falcon', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (198, 'DV20', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-20', 'Katana', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (199, 'DV20', 'Airplane', 'Single Engine Land', 'DIAMOND', 'DA-20', 'Speed Katana', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (200, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23', 'Twin-Stinson', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (201, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23', 'Apache', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (202, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-150', 'Apache B', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (203, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-150', 'Apache C', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (204, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-150', 'Apache D', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (205, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-160', 'Apache E', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (206, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-160', 'Apache G', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (207, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-160', 'Apache H', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (208, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-235', 'Apache 235', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (209, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-250', 'Aztec', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (210, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-250', 'Aztec B', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (211, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-250', 'Aztec C', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (212, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-250', 'Aztec D', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (213, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-250', 'Aztec E', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (214, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23-250', 'Aztec F', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (215, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-23T-250', 'Turbo Aztec', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (216, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'UO-1', NULL, 'High Performance Piston', false, true, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (217, 'PA23', 'Airplane', 'Multiengine Land', 'PIPER', 'U-11A', NULL, 'High Performance Piston', false, true, false, false, true, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (218, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-180', 'Comanche 180', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (219, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-250', 'Comanche 250', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (220, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-260', 'Comanche 260', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (221, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-260B', 'Comanche 260', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (222, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-260C', 'Comanche 260', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (223, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-260TC', 'Comanche 260', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (224, 'PA24', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-24-400', 'Comanche 400', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (225, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-140', 'Cherokee Cruiser', NULL, false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (226, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-150', 'Cherokee 150', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (227, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-151', 'Warrior', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (228, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-160', 'Cherokee 160', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (229, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-161', 'Warrior II', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (230, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-161', 'Warrior III', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (231, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-180', 'Cherokee 180', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (232, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-180', 'Archer', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (233, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-181', 'Archer II', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (234, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-181', 'Archer III', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (235, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28S-160', 'Cherokee 160', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (236, 'P28A', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28S-180', 'Cherokee 180', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (237, 'P28B', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-201T', 'Turbo Dakota', 'Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (238, 'P28B', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-235', 'Pathfinder', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (239, 'P28B', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-236', 'Dakota', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (240, 'P28B', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-235', 'Cherokee 235', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (241, 'P28B', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28-235', 'Cherokee Charger', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (242, 'P28R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28R-180', 'Arrow', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (243, 'P28R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28R-200', 'Arrow', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (244, 'P28R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28R-200', 'Arrow II', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (245, 'P28R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28R-201', 'Arrow III', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (246, 'P28S', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28R-201T', 'Turbo Arrow II', 'Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (247, 'P28S', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28R-201T', 'Turbo Arrow III', 'Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (248, 'P28T', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28RT-201', 'Turbo Arrow IV', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (249, 'P28U', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-28T-201T', 'Turbo Arrow IV', 'Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (250, 'P28U', 'Airplane', 'Single Engine Land', 'PIPER', 'Archer DX', 'Archer DX', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (251, 'P28U', 'Airplane', 'Single Engine Land', 'PIPER', 'Archer TX', 'Archer TX', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (252, 'P28U', 'Airplane', 'Single Engine Land', 'PIPER', 'Archer LX', 'Archer LX', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (253, 'PA30', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-30', 'Twin Comanche', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (254, 'PA30', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-30B', 'Twin Comanche', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (255, 'PA30', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-30B', 'Turbo Twin Comanche', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (256, 'PA30', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-30C', 'Twin Comanche', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (257, 'PA30', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-30C', 'Turbo Twin Comanche', 'Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (258, 'PA39', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-39', 'Twin Comanche C/R', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (259, 'PA39', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-39', 'Turbo Twin Comanche C/R', 'Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (260, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-250', 'Cherokee Six', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (261, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-260', 'Cherokee Six', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (262, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-260', 'Cherokee Six B', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (263, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-260', 'Cherokee Six C', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (264, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-260', 'Cherokee Six D', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (265, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-260', 'Cherokee Six E', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (266, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-300', 'Cherokee Six', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (267, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-300', 'Cherokee Six B', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (268, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-300', 'Cherokee Six C', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (269, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-300', 'Cherokee Six D', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (270, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-300', 'Cherokee Six E', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (271, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-301', 'Saratoga', 'High Performance Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (272, 'PA32', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32-301T', 'Turbo Saratoga', 'High Performance Piston', true, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (273, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32R-300', 'Cherokee Lance', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (274, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA32RT-300', 'Lance II', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (275, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32RT-300T', 'Turbo Lance II', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (276, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32R-301', 'Saratoga SP', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (277, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32R-301', 'Saratoga II HP', 'High Performance Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (278, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32R-301T', 'Turbo Saratoga SP', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (279, 'P32R', 'Airplane', 'Single Engine Land', 'PIPER', 'PA-32R-301T', 'Saratoga II TC', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (280, 'PA34', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-34-200', 'Seneca I', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (281, 'PA34', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-34-200T', 'Seneca II', 'Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (282, 'PA34', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-34-220T', 'Seneca III', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (283, 'PA34', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-34-220T', 'Seneca IV', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (284, 'PA34', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-34-220T', 'Seneca V', 'High Performance Piston', true, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (285, 'PA38', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-38-112', 'Tomahawk', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (286, 'PA38', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-38-112', 'Tomahawk II', 'Piston', false, false, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (287, 'PA44', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-44-180', 'Seminole', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (288, 'PA44', 'Airplane', 'Multiengine Land', 'PIPER', 'PA-44-180', 'Turbo Seminole', 'Piston', false, true, false, false, false, false, false);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (289, 'ST75', 'Airplane', 'Single Engine Land', 'BOEING', '75', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (290, 'ST75', 'Airplane', 'Single Engine Land', 'BOEING', 'N2S', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);
INSERT INTO aircraft_model (aircraft_model_id, faa_type_designation, category, class, make, model_id, popular_name, engine, turbo, complex, aerobatic, tailwheel, warbird, biplane, classic) VALUES (291, 'ST75', 'Airplane', 'Single Engine Land', 'BOEING', 'PT-13', 'Kaydet', 'High Performance Radial', false, false, true, true, true, true, true);


--
-- Data for Name: aircraft; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (9, 'N678ES', 1, true, 1975, 1005.10, 1064.20, false, false, 75.00, '1998-10-05', '1999-01-01', '2003-09-18', '2006-08-08', '2000-10-10', false, true, false, false, false, 27, 60, NULL, 'active');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (23, 'willie', 1, true, 1234, 2344.00, 2345.00, true, true, 87.00, '2017-05-04', '2017-05-12', '2017-05-09', '2017-05-11', '2017-05-16', true, true, true, true, true, 54, NULL, NULL, 'flight_line');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (1, 'N335WD', 1, true, 1999, 5543.10, 5645.00, false, false, 56.00, '2015-10-23', '2015-12-24', '2014-09-29', '2015-06-12', '2016-07-14', false, true, true, true, true, 4, 60, 'https://upload.wikimedia.org/wikipedia/commons/9/96/AmericanAviationAA-1YankeeClipper06.jpg', 'flight_line');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (7, 'ND5HLS', 1, true, 2002, 1791.80, 1799.20, false, false, 33.00, '1958-12-01', '2016-12-26', '2017-03-08', '2017-01-29', '2016-11-29', true, true, false, false, false, 29, 60, 'http://murfreesboroaviation.com/wp-content/uploads/2016/02/BeechcraftDuchess-MurfreesboroAviation-03.jpg', 'flight_line');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (22, '467800', 1, true, 1988, 1234.00, 1234.00, true, true, 88.00, '2017-05-06', '2017-05-04', '2017-05-09', '2017-05-06', '2017-05-22', true, true, true, true, true, 38, NULL, NULL, 'grounded');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (3, 'NWA3WD', 1, true, 2000, 1131.00, 1135.00, false, false, 100.00, '2016-12-12', '2015-12-12', '2013-12-12', '2014-12-12', '2015-12-12', false, false, false, false, false, 10, 60, 'http://barrieaircraft.com/images/grumman-american-aa-5-01.jpg', 'flight_line');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (5, 'ND89AS', 1, false, 1989, 650.00, 661.00, false, false, 55.00, '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', false, false, false, false, false, 208, 60, 'http://cdn-www.airliners.net/photos/airliners/0/3/7/1592730.jpg?v=v40', 'active');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (19, 'NS345A', 1, NULL, 1953, 900.00, 1012.00, false, false, 88.00, '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', false, false, false, false, false, 17, NULL, NULL, 'grounded');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (6, 'NWA037', 1, true, 1984, 2133.00, 2138.00, false, false, 29.00, '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', false, true, false, false, false, 2, 60, 'https://upload.wikimedia.org/wikipedia/commons/9/96/AmericanAviationAA-1YankeeClipper06.jpg', 'flight_line');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (8, 'N477HL', 1, false, 1969, 191.00, 196.00, false, true, 24.00, '2017-05-17', '2017-05-15', '2017-05-15', '2017-05-16', '2017-01-12', false, true, true, false, false, 203, 60, 'http://cdn-www.airliners.net/photos/airliners/0/3/7/1592730.jpg?v=v40', 'active');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (2, 'N665TH', 1, true, 2005, 2334.60, 3234.00, false, false, 40.00, '2012-12-18', '2013-03-24', '2014-08-05', '2015-09-13', '2016-11-25', false, true, false, false, true, 2, 60, 'https://upload.wikimedia.org/wikipedia/commons/9/96/AmericanAviationAA-1YankeeClipper06.jpg', 'flight_line');
INSERT INTO aircraft (aircraft_id, registration_nbr, school_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, aircraft_model_id, currency_days, picture_url, aircraft_status) VALUES (4, 'NWA035', 1, false, 1998, 1899.00, 1899.00, false, false, 18.00, '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', '2017-05-17', true, false, true, true, false, 2, 60, 'https://upload.wikimedia.org/wikipedia/commons/9/96/AmericanAviationAA-1YankeeClipper06.jpg', 'flight_line');


--
-- Name: aircraft_aircraft_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('aircraft_aircraft_id_seq', 23, true);


--
-- Name: aircraft_model_aircraft_model_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('aircraft_model_aircraft_model_id_seq', 39, true);


--
-- Data for Name: aircraft_ownership; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (1, 1, '2015-12-12', '2017-12-12');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (2, 2, '2014-09-15', '2017-09-15');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (3, 3, '2015-02-26', '2017-06-26');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (4, 4, '2015-02-26', '2017-06-26');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (5, 5, '2014-11-15', '2016-11-15');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (6, 6, '2015-12-12', '2018-12-12');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (7, 7, '2015-06-17', '2017-06-17');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (8, 8, '2017-01-09', '2020-01-09');
INSERT INTO aircraft_ownership (ownership_id, aircraft_id, start_date, end_date) VALUES (9, 9, '2017-01-09', '2020-01-09');


--
-- Name: aircraft_ownership_ownership_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('aircraft_ownership_ownership_id_seq', 1, true);


--
-- Data for Name: airport; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (1, 'LAX', '''26CN', '124149.9770N', '425217.2600W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (2, 'LAX', '''52CL', '124334.9750N', '422858.1750W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (3, 'LAX', '''11CL', '124667.9640N', '423552.2070W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (4, 'LAX', '''CA12', '124372.9750N', '422771.1760W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (5, 'LAX', '''0CL1', '124449.9700N', '423200.0000W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (6, 'SFO', '''A26', '148271.4000N', '435435.8000W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (7, 'LAX', '''L54', '118640.5000N', '418661.0000W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (8, 'LAX', '''L70', '124209.2500N', '425932.7200W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (9, 'LAX', '''CL59', '123977.9820N', '425835.2810W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (10, 'LAX', '''0CA8', '120340.1150N', '420633.0840W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (11, 'LAX', '''L22', '122867.4000N', '419064.8000W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (12, 'LAX', '''8CA6', '122854.0250N', '419088.0450W', NULL);
INSERT INTO airport (airport_id, airport_code, airport_name, lat, lon, control_tower) VALUES (13, 'SFO', '''45CL', '144515.5330N', '444234.0840W', NULL);


--
-- Name: airport_airport_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('airport_airport_id_seq', 13, true);


--
-- Data for Name: category; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO category (category) VALUES ('Airplane');
INSERT INTO category (category) VALUES ('Rotocraft');
INSERT INTO category (category) VALUES ('Lighter Than Air');
INSERT INTO category (category) VALUES ('Powered Lift');
INSERT INTO category (category) VALUES ('Powered Parachute');
INSERT INTO category (category) VALUES ('Glider');
INSERT INTO category (category) VALUES ('Weight-Shift Control');


--
-- Data for Name: certificate_type; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO certificate_type (certificate_type) VALUES ('student');
INSERT INTO certificate_type (certificate_type) VALUES ('commercial');
INSERT INTO certificate_type (certificate_type) VALUES ('private');
INSERT INTO certificate_type (certificate_type) VALUES ('sport');
INSERT INTO certificate_type (certificate_type) VALUES ('airline_transport_pilot');
INSERT INTO certificate_type (certificate_type) VALUES ('recreational');


--
-- Data for Name: login; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (24, 'bob@bob.com', NULL, '$2a$10$Qel4qvrJ/HyCcVgy3tsnvOl5XBhKZ0GCepxUSoxIWdHHAoEQUOX.a', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (23, 'user6', 'user6@go.com', '$2a$10$nnZYghw/WY0rFIf30GpS3uOKrm7i4JZ.GqwHgjOqaCrxXYcXBO182', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (22, 'wilbur@shit.com', 'wilbur@shit.com', '$2a$10$ZF9VHIwh/OsNLGO0aYCn3.Q0Ag9QDPgceZFOM1I1PlJWxiskBSK5S', true, NULL, '2017-01-22 15:46:26.76', '2017-01-22 15:46:26.76');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (21, 'user21', NULL, '$2a$10$61NjBuVjgphSSNApWzGhP.gq9vm6Ao7GQatr7NQx1yHkrKL5xItHS', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (20, 'user20', NULL, '$2a$10$oTXnPo0AEqrn1GDMiKVI2ODUFUzbtm2NPcnPzmA0Kks7eWB/yCI1i', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (19, 'user19', NULL, '$2a$10$zocjf.c0uqHSWOxLTIMp5uyKE1S2yEwOzOg4ejX1ecvAPeiS21j/y', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (18, 'user18', NULL, '$2a$10$jIQzzJASQzR3a8PB097OcOHva.qcx27x7segB2Nkyw1GyoT8ksFP.', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (17, 'user17', NULL, '$2a$10$QhxaHd7imEDg0wLd5cimvuVMEMFxaUXXAgcUNHzMmsfkBPCJcAjae', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (16, 'user16', NULL, '$2a$10$2TXoKbt2c57H7JN5mczS/esQUGrtcgV9NNsMy5Lera0Zv5Xjqg8Cu', false, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (15, 'user15', NULL, '$2a$10$ki/oT91/HTdmDYflk4bw9.tYZwdYNcy1iEfUzMDJXpbBvjfWXO5Za', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (14, 'user14', NULL, '$2a$10$iJgmtjF3/BHBzIqhvbTG1OrkzfaqLkpnjIlE6QwQnqo2aVeWOw1wq', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (12, 'user12', NULL, '$2a$10$Ljw9FluL6NL2VOIZo2JAyuC98mTJz6Qfoo2sMvA9iNnidYSGI8xXG', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (11, 'user11', NULL, '$2a$10$D9mbMhdHJvrYsGsSNED/7uvT2SGcYy/rYm2tY6k40jJM.Sj6Hwrsm', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (10, 'user10', NULL, '$2a$10$hP8vZOrT/8MPULpYsSnnIOCpXbEKkHbsuOa9GcYGnJoMn6nAn/8QS', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (9, 'user9', NULL, '$2a$10$SLHqY.FIDoglJsekkNXOJORf5Pcd75u9gLdyRnvnSUEuYa19aqApu', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (8, 'user8', NULL, '$2a$10$Z9.QoFzSy0KDFafTGEEoX.maPQTPTVpnRJlfDmyXZuv9OeypXiWj6', false, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (7, 'user7', NULL, '$2a$10$mYY5cDSmvWHLQhfD3s.X4.TyqG7/l5n2X44B2TQMIOWPhgqyx7gx2', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (5, 'user5', NULL, '$2a$10$ZbJJaO1zSWOtiEOyU/eoKeOuE2OEcdXfwRPHTACsdU0kSLqkuDukK', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (4, 'user4', NULL, '$2a$10$RBajPjuEklohtO/Yaic6MOBAjNmD/7hUCOfrAA.X/SjC7ziA1wRIi', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (3, 'user3', NULL, '$2a$10$9fF5XULN6VUm9QHkxdhGTubT3djyzVEEVIKI34RUB/j84H3jvHegK', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (31, 'bubba', 'bubba@pga.com', '$2a$10$BsokpZfTIAeJAHyGLWFtieFha.xJiLEtRm9GkVf440BZLBo/t3T.G', NULL, NULL, '2017-04-18 12:09:42', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (32, 'fish', 'jimbo@fsu.edu', '$2a$10$H08cCJ.DaAy4qwCV7M3zY.gfHoEtuTt57h8G266qgxHNduC70ii92', NULL, NULL, '2017-04-18 12:32:41', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (33, 'romes', 'romo@cbs.com', '$2a$10$t1XpYlFWjJ2l76npkgb77exthufL8P8OSYHY3zPvKIi34lvNKohi2', NULL, NULL, '2017-04-18 12:32:41', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (34, 'bbob', 'bbob@email.com', '$2a$10$78ikizbsaMW3SGzKIsvgHutDlld3./Emk35yhehXdMEa8vDeoxw1O', NULL, NULL, '2017-04-18 13:50:43', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (35, 'tom', 'therman@utexas.edu', '$2a$10$ce9NalgEWaRT9cJKy/SdWuFdWq/Poa0gz3MI8D20LHgm79.ttbJdO', NULL, NULL, '2017-04-18 13:54:44', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (36, 'yu', 'yu@mlb.com', '$2a$10$rHgOsUCD8LO8JcskvCLsUeMrrw7bD0wc60pO752a4meLvXQ50UGem', NULL, NULL, '2017-04-18 13:54:44', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (37, 'Cargo', 'gomez@mlb.com', '$2a$10$PAKUnzhkzYhxfFAbWRlLX.ehE7S2xPD1BXcoUxSu91mESakXwVNnO', NULL, NULL, '2017-04-18 13:54:44', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (38, 'rougie', 'odor@mlb.com', '$2a$10$CPsiTa6FHSuPUWvu3z8WkeozT9V.RkyffDYDaO6oWlUDp6NgmTwEK', NULL, NULL, '2017-04-18 13:54:44', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (39, 'nap', 'nap@mlb.com', '$2a$10$aM4vxqHueSltqRs2ke1mouAUSmvSVuvKobljDRv3be3OVij2yZhxO', NULL, NULL, '2017-04-18 13:54:44', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (42, 'jdoe', 'jdoe@h.com', '$2a$10$fa0cXhFTAu7EDvxsT37p1.MKbXSmVNrEWCOL67IQ0H8o5KzOh7rZa', NULL, NULL, '2017-04-18 13:54:44', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (48, 'ringo', 'thewallster@friend.net', '$2a$10$sqrMSKNX7TNJJ2ohFyhFYebtPFWRKhR9JAS3JOriuLp5AQdD7awOK', NULL, 'Look Ma, No Wings!', '2017-04-18 15:27:01', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (49, '300', 'user@mail.com', '$2a$10$yGVDR6KjQaORXaVnlEr09u/IKZX1uXvsmyrzDo10rOhG1/cmZYAMK', NULL, 'Look Ma, No Wings!', '2017-04-18 19:12:22', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (51, 'ring', 'wallster@friend.net', '$2a$10$lCNRo4Rq4MumYGqZAVkeFOenFAbZAalHPBP8CeCUZ3pYV0Wn2wKyi', NULL, 'Look Ma, No Wings!', '2017-04-19 16:13:45', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (52, 'rino', 'wall@friend.net', '$2a$10$in9qS5hSLXef4.fd7EwdRu6SHl918OIRRykfHvtcLLuZyOgrMPqgO', NULL, 'Look Ma, No Wings!', '2017-04-19 16:24:00', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (53, 'timmy the loser', 'loser@dork.net', '$2a$10$MHLYknGKfm.CY6Gz3otqZOu8JuPzdJ4kj7FBpF6NxBWHYtfjkfsra', NULL, 'Look Ma, No Wings!', '2017-04-19 16:30:26', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (54, 'timmy loser', 'ser@dork.net', '$2a$10$YAm7rPCtAdQQmbXCu5C3C.r2WgpfrQ7kbr//uT8qny0uF8GP7hs6G', NULL, 'Look Ma, No Wings!', '2017-04-19 16:33:02', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (55, 'loser', 'the@dork.net', '$2a$10$YmghJ91VnAJAwL/.AftwruYYAEMJes8QiSVXxhf4QCKrQG3hGuYHq', NULL, 'Look Ma, No Wings!', '2017-04-19 16:45:13', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (56, 'chocolate', 'willy@wonka.net', '$2a$10$TheGl67EBcAzaOlcRVQwOeTjvm/fA8XAuvSM8wY5PQl9HKUp.kDtq', NULL, 'Look Ma, No Wings!', '2017-04-19 16:54:01', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (57, 'choc', 'will@wonka.net', '$2a$10$DUp3Gwpm9JqKKnEl4nkH3e0VdCsYxAJfoWEsGBa0pcm5VwA.V94C.', NULL, 'Look Ma, No Wings!', '2017-04-19 16:57:34', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (58, 'bad egg', 'verucasalt@wonka.net', '$2a$10$dGXBn5x13iGU2rDrGzZ70.IUn6JdF4X/ZKWBl/81QzFXSbK.zqfTW', NULL, 'Look Ma, No Wings!', '2017-04-19 17:42:12', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (59, 'blueberry', 'violet@wonka.net', '$2a$10$2EmNNhRK00BMFennuSXi7uralJqZXkz3QAwhnwnyouYr9SNWobW32', NULL, 'Look Ma, No Wings!', '2017-04-19 17:47:43', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (60, 'mynameis1', '123@gumshoe.com', '$2a$10$GjHbyhQM98nhn10AaXP7cO82ruvCkp2TrKXmgJ5TUOxqQVnQw1en6', NULL, 'Look Ma, No Wings!', '2017-04-19 19:16:46', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (61, '11111', '1111@gmail.com', '$2a$10$3Hj0mAQLYIFaXZ6z.6WqseTxjX1bss8s6v2CT8jUN5njE2pWAZ8/K', NULL, 'Look Ma, No Wings!', '2017-04-19 19:16:46', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (62, 'cash', 'cash@mlb.com', '$2a$10$A.MexswTbYTde2s4oX6eC.jgit/kxN/nlnVKu6oOhc5RPFwUfFMp2', NULL, 'Look Ma, No Wings!', '2017-04-20 19:51:17', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (63, 'lupin', 'japan@cartoon.net', '$2a$10$XKtMUk4rL.AhmBe/aJojG.MijUoMDXvbpK.FDm1rVEtNSuly/40dy', NULL, 'Look Ma, No Wings!', '2017-04-20 19:56:18', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (64, 'elvis', 'elvis@mlb.com', '$2a$10$R7c84WogWkUpPIwabhXdv.L161DsmpSD1SWz93crJL.2O40Twq9yK', NULL, 'Look Ma, No Wings!', '2017-04-20 20:08:34', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (65, 'gallo', 'gallo@mlb.com', '$2a$10$L3tVGuE66GsC/7O5JW25q.UX/Hm.8JX5rW3jM0JeeiRWDXsqZRFAi', NULL, 'Aviaton Nation Station', '2017-04-20 20:14:02', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (66, 'luu', 'luu@mlb.com', '$2a$10$vleMbFuKXc.HLzoLaaeYne33rKuZ2of8B14Rd.HUP4DZTWBluuJtq', NULL, 'Look Ma, No Wings!', '2017-04-20 20:14:02', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (13, 'user13', 'whygetup@yahoo.com', '$2a$10$x4UpYw2Nbis5OVgp5E2El.1ZfVFTXy/b/XnFuF2wYuN6mcbsGwGBy', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (67, 'jsmith', 'jsmith@smith.com', '$2a$10$MKhxABdvrETtuj7nYMZOBuK.4oOPT9kjdZFtmmZ0UTsGY3bmTdiq.', NULL, 'Look Ma, No Wings!', '2017-04-22 15:41:43', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (1, 'user1', 'harrisonford@aol.com', '$2a$10$/JgBgHzm9vk1JGEPUt70iOKBO3s8IUAskaxIKk9BniOhYxt761OWi', true, NULL, '2017-01-09 19:10:00', '2017-01-09 19:10:00');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (2, 'user2', 'scottie@thepip.com', '$2a$10$NA8Xx/qtJr15d7wjSAHKwe72nOR9A7iEQZMeUyDHxbWu1tvB49DxO', true, NULL, '2017-01-09 19:10:00', '2017-04-22 13:28:46');
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (68, 'bob', 'bob@bob.com', '$2a$10$laIzVX21M8LbqnEP4P4JuuvtYmck2HL1KbkQKQYB55veqgTE5du6C', NULL, 'Aviaton Nation Station', '2017-04-25 13:38:19', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (69, 'billbill', 'bill@bill.com', '$2a$10$gBMddJSb.2W2rLmPzQFOyONcjO19ipb6K1UIDEOH8PBJLMdXI.O2.', NULL, 'Look Ma, No Wings!', '2017-04-27 13:09:35', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (158, NULL, NULL, NULL, NULL, NULL, '2017-05-19 21:53:27', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (159, NULL, NULL, NULL, NULL, NULL, '2017-05-26 23:14:51', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (160, NULL, NULL, NULL, NULL, NULL, '2017-05-30 14:38:33', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (161, NULL, NULL, NULL, NULL, NULL, '2017-05-30 14:38:33', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (162, NULL, NULL, NULL, NULL, NULL, '2017-05-30 14:38:33', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (163, NULL, NULL, NULL, NULL, NULL, '2017-05-30 14:38:33', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (164, NULL, NULL, NULL, NULL, NULL, '2017-05-30 14:38:33', NULL);
INSERT INTO login (login_id, username, email, password, is_validated, requested_school, createdat, modifiedat) VALUES (165, NULL, NULL, NULL, NULL, NULL, '2017-05-30 14:38:33', NULL);


--
-- Data for Name: person; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (24, 'Donald', 'Trump', '515-515-5121', 'user031@balderdash.com', '1982-03-02', '61', '2014-07-25', NULL, '$150.00', '200010', 'pilot', 234750134, 24);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (35, 'Wally', 'Ringie', '515-515-5251', 'user401@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 48);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (36, 'user300', 'user', '515-515-5351', 'user501@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 49);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (43, 'augustus', 'galoop', '515-515-5551', 'user701@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 57);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (44, 'violet', 'beauregaard', '515-515-5651', 'user801@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 59);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (45, 'Andrew', 'Cashner', '515-515-5951', 'user022@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 62);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (46, 'johnny', 'lupin', '515-515-1151', 'user023@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 63);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (47, 'Elvis', 'Andrus', '515-515-2151', 'user024@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 64);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (48, 'Joey', 'Gallo', '515-515-5151', 'user001@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 65);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (49, 'John', 'Lucroy', '115-515-5152', 'user002@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 66);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (50, 'Joe', 'Smith', '315-515-5154', 'user004@balderdash.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 67);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (10, 'Billy Dee', 'Williams', '555555555', 'user003@balderdash.com', '1953-10-19', '141', '2015-11-15', '', NULL, '242020', 'pilot', NULL, 10);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (15, 'Usér', 'Ocho', '17996453344', 'user007@balderdash.com', '1983-03-03', '61', '2014-07-25', '', NULL, '303030', 'pilot', NULL, 15);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (14, 'Usér', 'Seis', '12125556789', 'user004@balderdash.com', '1982-03-01', '61', '2014-07-25', '', NULL, '202220', 'pilot', NULL, 14);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (16, 'Joey', 'Shabadoo', '15555555555', 'user002@balderdash.com', '1992-05-24', '61', '2016-12-01', NULL, '$100.00', '110000', 'pilot', 394872390, 16);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (20, 'George', 'Harrison', '17178994300', 'user012@balderdash.com', '1996-05-13', '', '2017-02-15', '', '$500.00', '111111', 'pilot', 345987302, 20);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (17, 'Ray', 'Manzarek', '19034567988', 'user011@balderdash.com', '1983-03-23', '61', NULL, '', '$250.00', '101110', 'pilot', 124334033, 17);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (21, 'Rickey', 'Bobby', '19097448899', 'user101@balderdash.com', '1983-03-23', '', '2013-07-30', '', '$500.00', '200000', 'pilot', 273985402, 21);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (18, 'Robby', 'Krieger', '15125079988', 'user009@balderdash.com', '1946-02-02', '', '2015-12-15', '', '$300.00', '102220', 'pilot', 820350823, 18);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (23, 'Baseball Mitt', 'Romney', '666777888', 'Romney', '1984-05-13', '', '2016-11-10', '', '$135.00', '800008', 'pilot', 345790203, 23);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (1, 'Harrison', 'Ford', '15124441052', 'harrisonford@aol.com', '1972-07-21', '61', '2016-12-01', NULL , '$500.00', '262626', 'pilot', 177790965, 1);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (11, 'Kobe', 'Bryant', '8888888888', 'user901@balderdash.com', '1984-05-13', '', '2016-11-10', NULL , NULL, '555555', 'pilot', NULL, 11);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (2, 'Scottie', 'Pippen', '12126875678', 'user003@balderdash.com', '1961-10-30', '61', '2016-04-01', NULL , '$200.00', '202727', 'pilot', 985576345, 2);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (22, 'Ron', 'Burgandy', '14325567666', 'user001@balderdash.com', '1953-10-19', '141', '2015-11-15', NULL , '$100.00', '200300', 'pilot', 234957092, 22);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (8, '近平', '习', '1234567890', 'user071@balderdash.com', '1996-05-13', '141', '2016-03-15', NULL , NULL, '242424', 'pilot', 998439225, 8);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (9, 'Luc', 'Longley', '9876543210', 'user008@balderdash.com', '1983-03-23', '', '2013-07-30', '', NULL, '232323', 'pilot', NULL, 9);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (51, 'Billy', 'Bob', '5123455432', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 68);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (5, 'Karl', 'Malone', '4653789987', 'user091@balderdash.com', '1983-03-23', '61', '2013-04-23', '', NULL, '252525', 'pilot', NULL, 5);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (7, 'Marge', 'Simpson', '4563457658', 'user021@balderdash.com', '1950-08-12', '61', '2014-07-25', NULL , '$100.00', '212221', 'pilot', NULL, 7);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (4, 'Kyrie', 'Irving', '2345678901', 'user061@balderdash.com', '1992-05-24', '61', '2016-12-01', '', NULL, '292029', 'pilot', 349839321, 4);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (3, 'Edgar', 'Winters', '2345678900', 'user041@balderdash.com', '1953-05-24', '61', '2016-11-07', NULL , NULL, '282028', 'pilot', 696969894, 3);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (145, 'ssf', 'sdf', 'sdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 158);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (146, 'weoirj', 'sdlj', '5125076809', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 159);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (52, 'bill', 'bill', '5123455432', NULL, NULL, '61', NULL, NULL, NULL, NULL, NULL, NULL, 69);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (147, 'willie', 'witten', '5126901665', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 160);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (148, 'willie', 'witten', '5126901665', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 161);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (149, 'willie', 'witten', '5126901665', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 162);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (150, 'Willie', 'Witten', '5126901665', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 163);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (151, 'willie', 'witten', '5126901665', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 164);
INSERT INTO person (person_id, first_name, last_name, mobile, email, dob, regulation_type, flight_review_date, picture_url, instruction_rate, faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) VALUES (152, 'Willie', 'Witten', '5126901665', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 165);


--
-- Data for Name: membership; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (15, 'renter', 15, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (16, 'instructor', 16, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (17, 'instructor', 17, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (18, 'instructor', 18, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (23, 'instructor', 23, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (24, 'instructor', 24, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (4, 'student', 4, 1, NULL, '2017-01-25', true, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (3, 'student', 3, 1, NULL, '2017-01-25', false, true, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (1, 'instructor', 1, 1, NULL, '2017-01-25', true, false, true, true);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (6, 'student', 8, 1, NULL, '1976-11-15', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (85, 'student', 145, 1, NULL, '2017-05-19', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (5, 'student', 5, 1, NULL, '2017-01-25', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (11, 'student', 11, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (14, 'renter', 14, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (20, 'instructor', 20, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (21, 'instructor', 21, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (22, 'instructor', 22, 1, NULL, '2017-01-22', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (2, 'student', 2, 1, NULL, '2017-01-25', true, true, true, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (90, 'student', 146, 88, NULL, '2017-05-26', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (92, NULL, 2, 2, '2017-05-26', '2017-05-26', true, false, false, true);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (86, NULL, 52, 1, '2017-05-26', '2017-05-26', true, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (94, NULL, 52, 2, '2017-05-26', '2017-05-26', true, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (96, 'student', 48, 1, '2017-05-28', '2017-05-20', true, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (97, 'renter', 49, 1, '2017-05-28', '2017-05-20', true, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (98, 'student', 50, 1, '2017-05-28', '2017-05-20', true, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (99, 'renter', 149, 2, NULL, '2017-05-30', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (100, 'student', 150, 1, NULL, '2017-05-30', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (101, 'renter', 151, 2, NULL, '2017-05-30', false, false, false, false);
INSERT INTO membership (membership_id, membership_type, person_id, school_id, agreement_signed, member_since, member_view_rights, instructor_view_rights, dispatch_view_rights, admin_view_rights) VALUES (102, 'student', 152, 1, NULL, '2017-05-30', false, false, false, false);


--
-- Data for Name: checkout; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (3, 1, 1, '2017-03-14', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (6, 16, 1, '2017-02-26', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (7, 16, 6, '2017-01-13', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (8, 5, 1, '2016-12-17', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (10, 1, 2, '2017-04-20', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (11, 1, 3, '2017-04-21', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (12, 1, 4, '2017-04-22', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (13, 1, 5, '2017-04-23', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (14, 1, 6, '2017-04-24', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (15, 1, 7, '2017-03-20', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (16, 1, 8, '2017-03-21', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (17, 1, 9, '2017-03-22', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (18, 6, 1, '2017-02-22', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (19, 6, 2, '2017-02-24', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (20, 6, 3, '2017-02-26', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (21, 6, 4, '2017-02-28', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (24, 6, 7, '2001-01-01', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (22, 6, 5, '2017-03-02', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (23, 6, 6, '2017-03-04', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (25, 6, 8, '2017-04-26', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (26, 6, 9, '2017-04-03', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (9, 4, 1, '2017-07-19', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (5, 4, 6, '2017-07-28', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (28, 4, 2, '2017-07-05', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (30, 11, 9, '2017-07-05', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (2, 5, 4, '2017-07-05', true);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (1, 2, 1, '2017-07-05', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (32, 3, 5, '2017-07-05', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (34, 15, 8, '2017-05-06', false);
INSERT INTO checkout (checkout_id, membership_id, aircraft_id, currency_end_date, ifr_checkout) VALUES (4, 3, 4, '2017-07-17', false);


--
-- Name: checkout_checkout_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('checkout_checkout_id_seq', 56, true);


--
-- Data for Name: class; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO class (class) VALUES ('Single Engine Land');
INSERT INTO class (class) VALUES ('Single Engine Sea');
INSERT INTO class (class) VALUES ('Multi Engine Land');
INSERT INTO class (class) VALUES ('Multi Engine Sea');
INSERT INTO class (class) VALUES ('Helicopter');
INSERT INTO class (class) VALUES ('Gyroplane');
INSERT INTO class (class) VALUES ('Airship');
INSERT INTO class (class) VALUES ('Balloon Gas');
INSERT INTO class (class) VALUES ('Balloon Airborne Heater');
INSERT INTO class (class) VALUES ('Land');
INSERT INTO class (class) VALUES ('Sea');


--
-- Data for Name: contact; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (16, '769 Utility Ln', 'Seattle', 'WA', 'USA', '89238', '9873480303', 'needdata', 'other', true, '9876438282', NULL, NULL, NULL, NULL, NULL, 14);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (12, '432 Luber St', 'Encino', 'CA', 'USA', '60677', '3124435454', 'HS543', 'other', true, '', NULL, NULL, NULL, NULL, NULL, 10);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (27, '1122 Boogie Woogie Ave', 'Austin', 'TX', 'USA', '78717', '555-555-5555', 'WS332', 'other', true, '444-444-4444', NULL, NULL, NULL, NULL, NULL, 22);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (18, '75 Ramapo Dr', 'Chicago', 'IL', 'USA', '60022', '4432235656', '', 'other', true, '8776677432', NULL, NULL, NULL, NULL, NULL, 16);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (28, '1122 Boogie Woogie Ave', 'Austin', 'TX', 'USA', '78717', '555-555-5555', 'WS332', 'other', true, '444-444-4444', NULL, NULL, NULL, NULL, NULL, 23);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (20, '401 West Ave', 'San Bernadino', 'CA', 'USA', '90201', '2002398483', 'needdata', 'other', true, '2002398483', NULL, NULL, NULL, NULL, NULL, 18);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (11, '5949849 Ham St. Apt #858', 'Dennis', 'WA', 'USA', '89833', '9934759987', '', 'other', true, '', NULL, NULL, NULL, NULL, NULL, 9);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (19, '2 Dark Corner', 'Santa Monica', 'CA', 'USA', '90135', '6745563454', 'needdata', 'other', true, '', NULL, NULL, NULL, NULL, NULL, 17);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (31, '5 Wright Way', 'Balderdash', 'OR', 'USA', '90752', '901-555-7322', NULL, 'other', true, '901-555-7322', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (13, '888 Database Dr', 'Los Angeles', 'CA', 'USA', '90201', '3332928456', 'needdata', 'other', true, '', NULL, NULL, NULL, NULL, NULL, 11);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (17, '25 East Second St', 'New York City', 'NY', 'USA', '10034', '8674563342', '', 'other', true, '4536576556', NULL, NULL, NULL, NULL, NULL, 15);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (8, '1000 Central Stret', 'Cloud City', 'AJ', 'Bespin', '88236', '7746352772', 'NaN', 'other', true, '', 'Chief', 'Wiggum', '', NULL, NULL, 8);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (26, '1122 Boogie Woogie Ave', 'Austin', 'TX', 'USA', '78717', '555-555-5555', 'NaN', NULL, true, '444-444-4444', 'Cal', 'Noughton', '', NULL, NULL, 21);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (22, '65 Chalmers Ave', 'Salt Lake City', 'UT', 'USA', '65745', '7564655552', '0', NULL, true, '6753456545', 'Woody', 'Allen', '912-345-4567', NULL, NULL, 20);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (1, '128 Fake Ln', 'Anytown', 'WY', 'USA', '20064', '8874667899', 'N5HLS', 'home', true, '5124778899', 'Carrie', 'Fisher', '2346677777', NULL, NULL, 1);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (7, '23974292 I live here Dr', 'San Antonio', 'TX', 'USA', '79201', '5667890987', 'NaN', NULL, true, '', '', '', '', NULL, NULL, 7);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (4, '100 Main St', 'Boston', 'MA', 'USA', '100000', '1234567890', '4', NULL, true, '', 'Bill', 'Walton', '', NULL, NULL, 4);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (5, '203 A 45th Ave.', 'New York', 'NY', 'USA', '10001', '4567890987', 'NaN', NULL, true, '', 'John', 'Stockton', '5672347120', NULL, NULL, 5);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (3, '267 Ponoma Drive', 'San Francisco', 'CA', 'USA', '30324', '7098786571', '0', NULL, true, '8781134343', 'Muddy', 'Waters', '5672347890', NULL, NULL, 3);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (103, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 145);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (2, '453 Light St', 'Little Rock', 'AK', 'USA', '60035', '4135564556', 'WS332', 'home', true, '8872732683', 'Michael', 'Jordan', '5125678909', NULL, NULL, 2);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (104, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 146);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (105, '123 Home Run Ave', 'Arlington', 'TX', 'USA', '77777', '3733737377', NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 48);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (106, '123 Home Run Ave', 'Arlington', 'TX', 'USA', '77777', '3733737377', NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 49);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (107, '123 Home Run Ave', 'Arlington', 'TX', 'USA', '77777', '3733737377', NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 50);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (108, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 151);
INSERT INTO contact (contact_id, address, city, state, country, zip, phone, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, emergency_phone, airport_id, school_id, person_id) VALUES (109, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'home', true, NULL, NULL, NULL, NULL, NULL, NULL, 152);


--
-- Name: contact_contact_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('contact_contact_id_seq', 109, true);


--
-- Data for Name: documentation; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (4, 16, 'two', '2017-01-12', true, '2016-05-16', false, false, true, true, true, true, true, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (5, 17, 'three', '2016-08-11', true, '2017-01-01', true, false, true, true, true, true, true, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (6, 20, 'one', '2017-01-12', true, '2017-02-02', true, false, true, true, true, true, true, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (103, 145, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (1, 3, 'one', '2016-10-24', NULL, '2015-01-01', true, NULL, true, true, NULL, true, true, '2017-04-06');
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (3, 1, 'two', '2016-11-25', true, '2017-02-02', true, true, true, true, true, true, true, '2017-02-02');
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (104, 146, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (2, 4, 'one', '2017-05-03', true, '2010-09-09', true, false, true, false, true, true, true, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (106, 49, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (107, 50, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO documentation (document_id, person_id, medical_class, medical_date, rental_agreement, faa_written_test_exp, renters_insurance, guardian_release_form, photo_id, passport, birth_certificate, tsa_endorsement, background_check, firc) VALUES (105, 48, 'three', '2017-05-22', true, '2018-05-02', NULL, NULL, true, NULL, true, true, NULL, NULL);


--
-- Name: documentation_document_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('documentation_document_id_seq', 110, true);


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--



--
-- Data for Name: flight; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--


INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (6, '2017-03-28 10:34:43', 1, true, NULL, 1145.00, NULL, NULL, false, 1, NULL, 4, NULL, 1, 17, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (13, '2017-03-28 19:13:00', 6, true, 'on time', 189.00, 210.00, 2.00, false, 1, NULL, 3, '2017-03-08 13:55:35', 1, 17, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (14, '2017-04-04 09:56:11', 8, true, 'red five: standing by', 199.00, 199.00, NULL, true, 1, NULL, 7, '2017-04-05 11:22:11', 2, NULL, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (15, '2017-04-10 23:39:10.353106', 3, false, 'testing timestamp and pinned', 102.00, NULL, NULL, true, 1, NULL, 3, NULL, NULL, 4, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (71, '2017-04-25 16:38:07.711925', 1, NULL, NULL, 5645.00, NULL, NULL, NULL, 1, NULL, 11, NULL, NULL, 22, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (79, '2017-04-26 18:44:19.02915', 5, NULL, NULL, 661.00, NULL, NULL, NULL, 1, NULL, 4, NULL, NULL, 1, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (83, '2017-05-04 23:25:11.378328', 1, NULL, NULL, 5645.00, NULL, NULL, NULL, 1, NULL, 5, NULL, NULL, 21, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (84, '2017-04-29 11:19:11', 1, true, NULL, 123.00, 156.00, NULL, NULL, 1, NULL, 14, '2017-05-04 00:00:00', 1, NULL, '2017-05-04 11:22:11', NULL, 'completed', 'solo');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (82, '2017-05-04 23:22:57.866942', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 5, '2017-05-04 12:49:49', NULL, NULL, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (81, '2017-05-04 18:08:46.094339', 6, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 4, '2017-05-04 12:49:49', NULL, NULL, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (12, '2017-03-21 12:00:00', 1, NULL, NULL, 3576.00, NULL, NULL, false, 1, NULL, 1, '2017-03-05 09:11:08', 2, 18, '2017-05-05 09:11:52', NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (1, '2017-04-29 12:22:22', 5, true, 'everything fine, situation normal', 650.00, 650.00, NULL, false, 1, NULL, 11, '2017-04-12 07:45:12', 1, NULL, '2017-04-15 11:24:02', NULL, 'completed', 'solo');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (4, '2017-03-21 13:00:00', 7, NULL, NULL, 34.00, NULL, NULL, false, 1, NULL, 8, '2017-03-06 15:21:07', 1, 18, '2017-05-06 15:23:07', NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (74, '2017-04-25 17:35:37.848141', 8, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 4, '2017-04-25 12:35:00', 1, NULL, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (78, '2017-04-26 03:52:55.824721', 4, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 11, '2017-04-25 21:24:21', 1, NULL, NULL, NULL, 'pinned', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (76, '2017-04-26 03:49:50.485973', 2, false, NULL, 123.00, 145.00, NULL, NULL, 1, NULL, 15, '2017-04-25 21:24:21', 1, 2, '2017-05-02 11:14:11', NULL, 'completed', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (89, '2017-05-06 14:25:56.976294', 8, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 14, '2017-05-06 09:18:27', NULL, NULL, NULL, NULL, 'dispatched', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (90, '2017-05-06 14:32:28.256167', 5, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 14, '2017-05-06 09:18:27', NULL, NULL, NULL, NULL, 'dispatched', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (91, '2017-05-06 14:39:05.443746', 8, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 11, '2017-05-06 09:35:01', NULL, NULL, NULL, NULL, 'dispatched', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (94, '2017-05-06 14:50:28.170511', 9, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 11, '2017-05-06 09:35:01', NULL, NULL, NULL, NULL, 'dispatched', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (102, '2017-05-06 17:58:34.871212', 5, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 3, '2017-05-06 10:04:17', NULL, NULL, NULL, NULL, 'dispatched', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (104, '2017-05-06 18:06:55.169837', 8, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 15, '2017-05-06 13:05:55', NULL, NULL, NULL, NULL, 'dispatched', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (11, '2017-03-28 10:00:00', 3, NULL, NULL, 894.00, NULL, NULL, true, 1, NULL, 2, '2017-05-18 18:01:29', NULL, 16, NULL, NULL, 'dispatched', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (2, '2017-03-30 00:00:00', 4, NULL, NULL, 979.00, NULL, NULL, false, 1, NULL, 3, '2017-05-18 20:08:17', NULL, 16, NULL, NULL, 'completed', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (105, '2017-05-19 01:25:26.596578', 4, NULL, NULL, 1899.00, NULL, NULL, NULL, 1, NULL, 5, NULL, NULL, NULL, NULL, NULL, 'pinned', 'solo');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (101, '2017-05-06 17:43:31.482062', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 5, '2017-05-06 10:04:17', NULL, NULL, NULL, NULL, 'completed', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (92, '2017-05-06 14:45:44.147605', 3, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 11, '2017-05-06 09:35:01', NULL, NULL, NULL, NULL, 'completed', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (106, '2017-05-19 01:44:08.547942', 3, NULL, NULL, 1135.00, NULL, NULL, NULL, 1, NULL, 2, NULL, NULL, 22, NULL, NULL, 'pinned', 'flight_review');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (93, '2017-05-06 14:46:57.228566', 6, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 11, '2017-05-06 09:35:01', NULL, NULL, NULL, NULL, 'completed', 'checkout');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (88, '2017-05-06 14:19:37.904919', 2, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 14, '2017-05-06 09:18:27', NULL, NULL, NULL, NULL, 'completed', NULL);
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (109, '2017-05-29 15:12:51.657582', 2, NULL, NULL, 3234.00, NULL, NULL, NULL, 1, NULL, 48, '2017-05-29 09:41:44', NULL, 21, NULL, NULL, 'completed', 'intro_flight');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (110, '2017-05-29 18:40:53.465244', 4, NULL, NULL, 1899.00, NULL, NULL, NULL, 1, NULL, 48, '2017-05-29 09:41:44', 1, 1, NULL, NULL, 'completed', 'training_flight');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (111, '2017-05-29 19:11:33.719143', 4, NULL, NULL, 1899.00, NULL, NULL, NULL, 1, NULL, 48, '2017-05-29 09:41:44', NULL, NULL, NULL, NULL, 'completed', 'solo');
INSERT INTO flight (flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, end_tach, billable_ground_hrs, cross_country, school_id, invoice_id, customer_id, dispatch_time, dispatched_by, instructor_id, sms_release_id, sms_complete_id, flight_status, flight_type) VALUES (112, '2017-05-29 19:26:06.950235', 4, NULL, NULL, 1899.00, NULL, NULL, NULL, 1, NULL, 48, NULL, NULL, 1, NULL, NULL, 'pinned', 'checkride');




--
-- Name: flight_flight_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('flight_flight_id_seq', 112, true);


--
-- Data for Name: instructor_certificate; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO instructor_certificate (instructor_certificate_id, single_engine_instructor, instrument_instructor, multi_engine_instructor, basic_ground_instructor, advanced_ground_instructor, instrument_ground_instructor, helicopter_instructor, sport_pilot_instructor, person_id) VALUES (1, true, true, true, true, true, true, true, true, 7);
INSERT INTO instructor_certificate (instructor_certificate_id, single_engine_instructor, instrument_instructor, multi_engine_instructor, basic_ground_instructor, advanced_ground_instructor, instrument_ground_instructor, helicopter_instructor, sport_pilot_instructor, person_id) VALUES (2, true, true, true, true, true, true, true, false, 1);
INSERT INTO instructor_certificate (instructor_certificate_id, single_engine_instructor, instrument_instructor, multi_engine_instructor, basic_ground_instructor, advanced_ground_instructor, instrument_ground_instructor, helicopter_instructor, sport_pilot_instructor, person_id) VALUES (3, true, true, true, true, true, true, false, false, 16);
INSERT INTO instructor_certificate (instructor_certificate_id, single_engine_instructor, instrument_instructor, multi_engine_instructor, basic_ground_instructor, advanced_ground_instructor, instrument_ground_instructor, helicopter_instructor, sport_pilot_instructor, person_id) VALUES (4, true, true, false, false, false, false, false, false, 17);
INSERT INTO instructor_certificate (instructor_certificate_id, single_engine_instructor, instrument_instructor, multi_engine_instructor, basic_ground_instructor, advanced_ground_instructor, instrument_ground_instructor, helicopter_instructor, sport_pilot_instructor, person_id) VALUES (5, true, true, true, true, true, true, true, true, 20);
INSERT INTO instructor_certificate (instructor_certificate_id, single_engine_instructor, instrument_instructor, multi_engine_instructor, basic_ground_instructor, advanced_ground_instructor, instrument_ground_instructor, helicopter_instructor, sport_pilot_instructor, person_id) VALUES (6, true, false, false, true, false, false, false, false, 21);


--
-- Name: instructor_certificate_instructor_certificate_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('instructor_certificate_instructor_certificate_id_seq', 6, true);


--
-- Data for Name: invite; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (2, 'open', false, NULL, 1, 58);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (3, 'open', false, NULL, 1, 59);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (4, 'open', false, NULL, 1, 62);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (5, 'open', false, NULL, 1, 63);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (6, 'open', false, NULL, 1, 64);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (7, 'open', false, NULL, 2, 65);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (8, 'open', false, NULL, 1, 66);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (9, 'open', false, NULL, 1, 67);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (10, 'open', false, NULL, 2, 68);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (100, 'open', true, '$2a$10$8Y3Z3vunc.gSRMkApBrn3ejjVUALqmtewS30UzS.cO3LKmdU/nJPG', 1, 158);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (105, 'open', true, '$2a$10$9fraXKwUa1RfsK.p2NKBI.hHkac2MPGvF.2t311HCSSlrf7R9Tw0y', 88, 159);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (107, 'accepted', true, NULL, 2, 2);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (109, 'accepted', true, NULL, 2, 69);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (101, 'accepted', true, NULL, 1, 69);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (111, 'open', true, '$2a$10$3U.Nh3OeEGQa2NMiY25NeeOrGc7xIRUDz39oWaIKEr/Y5p6CMBoF6', 2, 160);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (112, 'open', true, '$2a$10$qgDW9z/S80K4CXqqcRloy.bwmbQI3YLtYwV3Zfn75VbDYFL3Zr.9G', 2, 161);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (113, 'open', true, '$2a$10$NYql6L.Tg1qeJNsqMo77TeUKJN6n/SOxCEN5qZd0uvvveEe/3NMz2', 2, 162);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (114, 'open', true, '$2a$10$OJQ2X.kYZMRqLwsvd8IX7uOF6dsZbjmS4Ua3.LX/temmTCOeLwy4.', 1, 163);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (115, 'open', true, '$2a$10$ZRrdIQZM5FLPdSsUqsSM.O9bRpSVprZ928y4z1mHhob3unUCGsn8.', 2, 164);
INSERT INTO invite (invite_id, onboarding_status, invite_sent, password, school_id, login_id) VALUES (116, 'open', true, '$2a$10$qXrkaP8j/QzXR4mct9.8vOkw6bqCY8F/BjYMAjSttMO9cVF0hzgsy', 1, 165);


--
-- Name: invite_invite_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('invite_invite_id_seq', 116, true);


--
-- Name: invoice_invoice_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('invoice_invoice_id_seq', 1, true);


--
-- Data for Name: landing_code; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO landing_code (landing_code, description) VALUES ('standard', 'wheels touch the runway');
INSERT INTO landing_code (landing_code, description) VALUES ('soft_field', 'landings on grass, dirt, mud, or other “unimproved” surface.');
INSERT INTO landing_code (landing_code, description) VALUES ('short_field', 'brought in high and slow, with firm contact to the runway. The slow approach

speed and steep approach minimize forward energy and allow for a short landing roll.');
INSERT INTO landing_code (landing_code, description) VALUES ('slip', 'rapidly adjust altitude without diving and increasing airspeed.');
INSERT INTO landing_code (landing_code, description) VALUES ('crosswind', 'wind is not perfectly aligned with the runway.');
INSERT INTO landing_code (landing_code, description) VALUES ('rejected', 'If the approach does not look right, then approach and landing are rejected.');
INSERT INTO landing_code (landing_code, description) VALUES ('night', 'At night');


--
-- Data for Name: leg; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (4, 2, 2055.0, NULL, 1, NULL);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (11, 11, 36.0, NULL, 1, NULL);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (12, 12, 1982.0, 2043.0, 1, 3);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (13, 12, 2043.0, NULL, 3, NULL);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (5, 6, 1754.0, 1832.0, 1, 1);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (15, 14, 210.0, NULL, 1, NULL);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (14, 13, 189.0, 210.0, 1, 1);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (16, 1, 650.0, 667.0, 1, 1);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (17, 84, 123.0, 156.0, 1, 1);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (18, 76, 123.0, 145.0, 1, 1);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (1, 88, 2334.6, NULL, NULL, NULL);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (2, 109, 2334.6, NULL, NULL, NULL);
INSERT INTO leg (leg_id, flight_id, beginning_hobbs, end_hobbs, departure_airport_id, arrival_airport_id) VALUES (3, 110, 1899.0, NULL, NULL, NULL);


--
-- Data for Name: landing; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--



--
-- Name: landing_landing_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('landing_landing_id_seq', 1, false);


--
-- Name: leg_leg_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('leg_leg_id_seq', 4, true);


--
-- Name: login_login_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('login_login_id_seq', 165, true);


--
-- Name: membership_membership_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('membership_membership_id_seq', 110, true);


--
-- Name: person_person_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('person_person_id_seq', 152, true);


--
-- Data for Name: pilot_certificate; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (3, 'private', 'Airplane', 'Multi Engine Land', 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (4, 'commercial', 'Airplane', 'Single Engine Land', 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (5, 'private', 'Rotocraft', 'Helicopter', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (6, 'commercial', 'Lighter Than Air', 'Balloon Gas', 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (7, 'private', 'Powered Lift', NULL, 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (17, 'student', 'Rotocraft', 'Helicopter', 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (19, 'student', 'Rotocraft', 'Helicopter', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (20, 'private', 'Airplane', 'Multi Engine Land', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (30, 'sport', 'Glider', NULL, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (22, 'student', 'Airplane', 'Single Engine Land', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (2, 'student', 'Airplane', 'Single Engine Land', 2, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (31, 'student', 'Airplane', 'Single Engine Land', 4, NULL, true, true, true, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (34, 'student', 'Airplane', 'Single Engine Land', 48, false, false, false, false, false, false, false, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (1, 'commercial', 'Airplane', 'Multi Engine Land', 1, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO pilot_certificate (pilot_certificate_id, certificate_type, category, class, person_id, instrument_rating, high_performance, complex, tailwheel, high_altitude, nvg, external_load, aero_tow, winch_launch) VALUES (32, 'private', 'Airplane', 'Single Engine Land', 1, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL);


--
-- Name: pilot_certificate_pilot_certificate_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('pilot_certificate_pilot_certificate_id_seq', 34, true);


--
-- Name: school_school_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('school_school_id_seq', 88, true);


--
-- Data for Name: service_type; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--



--
-- Data for Name: service; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--



--
-- Name: service_service_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('service_service_id_seq', 1, false);


--
-- Data for Name: squawk; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (1, '2017-03-06', '2017-03-16', 'Noticed a small pile of dead bodies in the cabin. Should probably be removed.', 1, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (2, '2017-03-23', '2017-03-24', 'Plane has no engine', 1, 2);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (3, '2017-03-11', '2017-03-18', 'All windows on plane have been shot out and the cabin smells of gasoline', 3, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (4, '2017-03-23', '2017-03-25', 'This plane sucks.', 3, 3);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (5, '2017-04-06', '2017-04-16', 'Plane is too small. Had to lie on my stomach to fly it. Please make it bigger.', 3, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (6, '2017-04-26', NULL, 'The color of this plane makes me thing of my dead Grandfathers house. Please modernize.', 3, 3);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (7, '2017-04-16', '2017-04-17', 'My instructor was terrible so I will also complain about the aircraft', 3, 2);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (8, '2017-03-02', NULL, 'This is a remote control plane. I spent $300 dollars to fly a childs toy. Bullshit ripoff!', 4, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (9, '2017-02-12', '2017-03-11', 'Plane decomposed in midair. Had to parachute down. Good luck to who ever owns it.', 5, 2);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (10, '2017-03-05', '2017-03-09', 'Dead bodies still in the plain. Truly a health hazard and the families might want to be notified.', 1, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (11, '2017-01-31', '2017-02-08', 'Lewd posters papered all over the cabin interior. A little tact would be nice', 7, 5);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (12, '2017-03-15', '2017-03-16', 'Plane flies nicely once airborne, but lack of wheels made takeoff extremely difficult.', 7, 7);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (13, '2017-03-06', '2017-03-21', 'This plane is really just a hot air balloon...', 7, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (14, '2017-03-30', '2017-03-31', 'It appears that you have moved the bodies from N335WD to N477HL. Not impressed with this establishment.', 8, 1);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (15, '2017-05-06', NULL, 'Crashed plane into hillside and let it burn while I walked away. Please contact my insurance.', 9, 2);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (16, '2017-04-28', '2017-04-30', 'Plane is not equipped with full bar, nor were there stewardesses or an inflight movie.', 9, 2);
INSERT INTO squawk (squawk_id, entry_date, repair_date, report, aircraft_id, reporter_reference_id) VALUES (17, '2017-05-20', NULL, 'The plane has no tail flaps.', 7, 1);


--
-- Name: squawk_squawk_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('squawk_squawk_id_seq', 1, false);


--
-- Data for Name: student_endorsements; Type: TABLE DATA; Schema: balderdash; Owner: balderdash
--

INSERT INTO student_endorsements (student_endorsement_id, membership_id, student_solo, aircraft_id, instructor_id) VALUES (1, 4, true, 4, 1);
INSERT INTO student_endorsements (student_endorsement_id, membership_id, student_solo, aircraft_id, instructor_id) VALUES (2, 96, true, 4, 1);


--
-- Name: student_endorsements_student_endorsement_id_seq; Type: SEQUENCE SET; Schema: balderdash; Owner: balderdash
--

SELECT pg_catalog.setval('student_endorsements_student_endorsement_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

