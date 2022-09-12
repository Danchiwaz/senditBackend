CREATE TABLE users (
	id uuid DEFAULT uuid_generate_v4(),
	fullname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	isRegEmail VARCHAR(255) DEFAULT 'no',
	isSent VARCHAR(255) DEFAULT 'no',
	isReceived VARCHAR(255)  DEFAULT 'no',
	isDeleted VARCHAR(255) DEFAULT 'no'
)