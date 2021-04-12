CREATE DATABASE Users;
Use Users;

create table Users(
user_id varchar(255) primary key,
user_LastName varchar(255) NOT NULL,
user_FirstName varchar(255) NOT NULL,
);

create table Places(
place_id varchar(255) primary key,
place_name varchar(255) NOT NULL,
place_Description varchar(255) NOT NUll
);


create table Opinions(
o_id varchar(255) primary key,
user_id varchar(255),
place_id varchar(255),
people int,
movement int,
talking int,
noise int,
noiseType varchar(255),
light int,
lightBright int,
lightFlickering int,
lightColourPeculiar int,
smells int,
smellType varchar(255),
floorSticky int,
floorUneven int,
seatsHard int,
texturesRough int,
comments varchar(255),
constraint fk_user foreign key (user_id) references Users(user_id),
constraint fk_place foreign key (place_id) references Places(place_id)
);



