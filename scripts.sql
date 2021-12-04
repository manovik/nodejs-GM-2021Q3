CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists Users (
	id uuid  primary key unique not null default uuid_generate_v4 (),
	login VARCHAR unique not null,
	password VARCHAR not null,
	age INT CHECK (age >= 4 and age <= 130),
	isDeleted boolean not null default false
);

insert into users (id, login, password, age, isDeleted) values
('1ea369ac-52e2-47e1-aa5a-19c7b97c5041', 'max1', 'qwerty1', 12, false),
('2ea369ac-52e2-47e2-aa5a-19c7b97c5042', 'max2', 'qwerty2', 21, false),
('3ea369ac-52e2-47e3-aa5a-19c7b97c5043', 'max3', 'qwerty3', 24, false),
('4ea369ac-52e2-47e4-aa5a-19c7b97c5044', 'max4', 'qwerty4', 42, false);

insert into users (id, login, password, age, isDeleted) values
('3ea369ac-52e2-47e1-aa5a-19c7b97c5044', 'max6', 'qwe', 4, false);