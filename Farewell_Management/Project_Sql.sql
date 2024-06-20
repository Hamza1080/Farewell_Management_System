
use farewell;

CREATE TABLE student (
    studentID int primary key,
    name varchar(50) not null,
    email varchar(100) not null unique,
    password varchar(8) not null,
    phone_number varchar(15) not null unique check (LENGTH(phone_number) = 11),
    dietary_preference varchar(30)
);

-- INSERT INTO student (studentID, name, email, password, phone_number, dietary_preference) 
-- VALUES 
-- (23, 'John Doe', 'john@example.com', 'pass1234', '01234567891', 'Vegetarian'),
-- (242, 'Jane Smith', 'jane@example.com', 'abcd5678', '11234567891', 'Non-vegetarian'),
-- (312, 'Alice Lee', 'alice@example.com', 'qwerty12', '21234567891', 'Vegan');

CREATE TABLE teacher (
    teacherID int primary key,
    name varchar(50) not null,
    email varchar(100) not null unique,
    password varchar(8) not null,
    phone_number varchar(15) not null unique check (LENGTH(phone_number) = 11)
);

-- INSERT INTO teacher (teacherID, name, email, password, phone_number) 
-- VALUES 
-- (1, 'Michael Scott', 'michael@example.com', 'password', '92301234123'),
-- (2, 'Dwight Schrute', 'dwight@example.com', 'password', '92333123123'),
-- (3, 'Jim Halpert', 'jim@example.com', 'password', '92322132123');

CREATE TABLE system_administrator (
    adminID int primary key,
    name varchar(50) not null,
    email varchar(100) not null unique,
    password varchar(8) not null,
    phone_number varchar(15) not null unique check (LENGTH(phone_number) = 11)
);

-- INSERT INTO system_administrator (adminID, name, email, password, phone_number) 
-- VALUES 
-- (1, 'Muhammad Ali', 'ali@example.com', 'pass1234', '92300123457'),
-- (2, 'Fatima Khan', 'fatima@example.com', 'abcd5678', '92333124567'),
-- (3, 'Ahmed Hassan', 'ahmed@example.com', 'qwerty12', '92322134567');

CREATE TABLE organiser (
    organiserID int primary key,
    name varchar(50) not null,
    email varchar(100) not null unique,
    password varchar(8) not null,
    phone_number varchar(15) not null unique check (LENGTH(phone_number) = 11)
);

-- INSERT INTO organiser (organiserID, name, email, password, phone_number) 
-- VALUES 
-- (1, 'Ali Khan', 'ali@example.com', 'pass1234', '92300234567'),
-- (2, 'Fatima Ahmed', 'fatima@example.com', 'abcd5678', '92333123457'),
-- (3, 'Ahmed Hassan', 'ahmed@example.com', 'qwerty12', '92322123562');

CREATE TABLE manager (
    managerID int primary key,
    name varchar(50) not null,
    email varchar(100) not null unique,
    password varchar(8) not null,
    phone_number varchar(15) not null unique check (LENGTH(phone_number) = 11)
);

-- INSERT INTO manager (managerID, name, email, password, phone_number) 
-- VALUES 
-- (1, 'Ali Khan', 'ali@example.com', 'pass1234', '92300123456'),
-- (2, 'Fatima Ahmed', 'fatima@example.com', 'abcd5678', '92333134567'),
-- (3, 'Ahmed Hassan', 'ahmed@example.com', 'qwerty12', '92321234567');

CREATE TABLE budget_master (
    masterID int primary key,
    name varchar(50) not null,
    email varchar(100) not null unique,
    password varchar(8) not null,
    phone_number varchar(15) not null unique check (LENGTH(phone_number) = 11)
);

-- INSERT INTO budget_master (masterID, name, email, password, phone_number) 
-- VALUES 
-- (1, 'John Doe', 'john@example.com', 'pass1234', '92300134567'),
-- (2, 'Jane Smith', 'jane@example.com', 'abcd5678', '92331234567'),
-- (3, 'Alice Lee', 'alice@example.com', 'qwerty12', '92221234567');


CREATE TABLE teams (
    teamid int primary key,
    managerID int not null,
    team_name varchar(50) not null,
    foreign key (managerID) references manager(managerID)
);

-- INSERT INTO teams (teamid, managerID, team_name) 
-- VALUES 
-- (1, 1, 'MENU'),
-- (2, 2, 'INVITATION'),
-- (3, 3, 'PERFORMANCE TEAM');

CREATE TABLE team_members (
    studentID int not null,
    teamID int not null,
    primary key (studentID, teamID),
    foreign key (studentid) references student(studentid),
    foreign key (teamid) references teams(teamid)
);
-- INSERT INTO team_members (studentID, teamID) 
-- VALUES 
-- (23, 1), -- StudentID 1 in TeamID 1 (MENU)
-- (242, 2), -- StudentID 2 in TeamID 2 (INVITATION)
-- (312, 3);

CREATE TABLE announcement (
    announcmentid int primary key auto_increment,
    title varchar(255) not null,
    content text not null,
    organiserID int not null,
    date date not null,
    foreign key (organiserID) references organiser(organiserID)
);

-- INSERT INTO announcement (title, content, organiserID, date) 
-- VALUES 
-- ('Important Announcement', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, '2024-05-10'),
-- ('Upcoming Event Details', 'Nulla faucibus massa vitae libero consectetur, eget convallis felis sollicitudin.', 2, '2024-05-11'),
-- ('Meeting Reminder', 'Vestibulum nec turpis fermentum, venenatis quam in, varius nisl.', 3, '2024-05-12');

CREATE TABLE tasks (
    taskid int primary key,
    status varchar(50) not null check (status in ('Pending', 'InProgress', 'Completed')),
    teamid int not null,
    deadline date not null,
    organiserid int not null,
    description text not null,
    foreign key (teamid) references teams(teamid),
    foreign key (organiserid) references organiser(organiserid)
);

-- INSERT INTO tasks (taskid, status, teamid, deadline, organiserid, description) 
-- VALUES 
-- (1, 'Pending', 1, '2024-05-15', 1, 'Prepare menu for the event'),
-- (2, 'InProgress', 2, '2024-05-16', 2, 'Send out invitations to guests'),
-- (3, 'Completed', 3, '2024-05-17', 3, 'Coordinate performance arrangements');

CREATE TABLE invitation (
    invitationid int primary key,
    method varchar(50) not null,
    teacherid int,
    studentid int,
    status varchar(50) not null check (status in ('Pending', 'Accepted', 'Declined')),
    sender varchar(50) not null,
    recipient varchar(50) not null,
    teamid int not null,
    foreign key (teacherid) references teacher(teacherid),
    foreign key (studentid) references student(studentid)
);

CREATE TABLE performance (
    performanceid int primary key,
    duration varchar(50) not null,
    studentid int not null,
    teamid int not null,
    type varchar(50) not null,
    requirement varchar(255) not null,
    votes int not null check (votes >= 0),
    foreign key (studentid) references student(studentid)
);

CREATE TABLE menu (
    itemid int primary key,
    studentid int not null,
    name varchar(50) not null,
    description varchar(255) not null,
    votes int not null check (votes >= 0),
    foreign key (studentid) references student(studentid)
);

CREATE TABLE family_members (
    familymemberid int primary key,
    studentid int ,
    teacherid int ,
    relationship varchar(255) not null,
    unique (studentid, teacherid),
    foreign key (studentid) references student(studentid),
    foreign key (teacherid) references teacher(teacherid)
);


CREATE TABLE attendance (
    attendanceid int auto_increment primary key,
    teacherid int ,
    studentid int ,
    familymemberid int ,
    foreign key (teacherid) references teacher(teacherid),
    foreign key (studentid) references student(studentid),
    foreign key (familymemberid) references family_members(familymemberid)
);

CREATE TABLE budget (
    budgetid int primary key,
    amountallocated decimal(10, 2) not null check (amountallocated >= 0),
    amountspent decimal(10, 2) not null check (amountspent >= 0),
    categoryname varchar(100) not null,
    budgetmasterid int not null,
    foreign key (budgetmasterid) references budget_master(masterID)
);

-- Inserting dummy Pakistani data into the invitation table
-- INSERT INTO invitation (invitationid, method, teacherid, studentid, status, sender, recipient, teamid) 
-- VALUES 
-- (1, 'Email', NULL, 23, 'Pending', 'organiser@example.com', 'student@example.com', 1),
-- (2, 'SMS', NULL, 242, 'Accepted', 'organiser@example.com', 'student@example.com', 2),
-- (3, 'Phone', NULL, 312, 'Declined', 'organiser@example.com', 'student@example.com', 3);

-- Inserting dummy Pakistani data into the performance table
-- INSERT INTO performance (performanceid, duration, studentid, teamid, type, requirement, votes) 
-- VALUES 
-- (1, '5 minutes', 23, 1, 'Dance', 'Group dance performance', 10),
-- (2, '10 minutes', 242, 2, 'Music', 'Solo instrumental performance', 15),
-- (3, '8 minutes', 312, 3, 'Drama', 'Skits and plays', 20);

-- Inserting dummy Pakistani data into the menu table
INSERT INTO menu (itemid, studentid, name, description, votes) 
VALUES 
(1, 23, 'Biryani', 'Spicy rice dish with meat or vegetables', 25),
(2, 242, 'Nihari', 'Slow-cooked stew made with beef or mutton', 30),
(3, 312, 'Karhai', 'Meat cooked with tomatoes, green chilies, and spices', 20);

-- Inserting dummy Pakistani data into the family_members table
-- INSERT INTO family_members (familymemberid, studentid, teacherid, relationship) 
-- VALUES 
-- (1, 23, 1, 'Parent'),
-- (2, 242, 2, 'Sibling'),
-- (3, 312, 3, 'Guardian');

-- Inserting dummy Pakistani data into the attendance table
-- INSERT INTO attendance (teacherid, studentid, familymemberid) 
-- VALUES 
-- (1, 23, 1),
-- (2, 242, 2),
-- (3, 312, 3);

-- Inserting dummy Pakistani data into the budget table
-- INSERT INTO budget (budgetid, amountallocated, amountspent, categoryname, budgetmasterid) 
-- VALUES 
-- (1, 1000.00, 500.00, 'Food', 1),
-- (2, 2000.00, 1500.00, 'Entertainment', 2),
-- (3, 1500.00, 1000.00, 'Decorations', 3);




