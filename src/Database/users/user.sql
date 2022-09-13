CREATE TABLE public.users (
	id uuid DEFAULT uuid_generate_v4(),
	fullname VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	isRegEmail VARCHAR(255) DEFAULT 'no',
	isSent VARCHAR(255) DEFAULT 'no',
	isReceived VARCHAR(255)  DEFAULT 'no',
	isDeleted VARCHAR(255) DEFAULT 'no'
)

-- procedure to create user and insert user 



CREATE OR REPLACE PROCEDURE public.userSave(
	IN theId uuid DEFAULT NULL::uuid,
	IN theFullName character varying DEFAULT NULL::character,
	IN theUsername character  varying DEFAULT NULL::character,
	IN theEmail character varying DEFAULT NULL::character,
	IN thePassword character varying DEFAULT NULL::character,
	IN isUpdating integer DEFAULT NULL::integer,
	INOUT jsonOut json DEFAULT NULL::json
)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN 
	IF isUpdating = 0 THEN
		INSERT INTO public.users(
			fullname,
			email,
			username,
			password
		)
		VALUES(
			theFullName,
			theEmail,
			theUsername,
			thePassword
		)
		RETURNING row_to_json(public.users.*)
		INTO jsonOut;
	ELSE
		IF isUpdating = 1 THEN
			UPDATE public.users
		SET 
			fullname = theFullName,
			username = theUsername,
			email = theEmail,
			password = thePassword
		WHERE id = theId
		RETURNING row_to_json(public.users.*)
		INTO jsonOut;
		END IF;
	END IF;
	END;
	$BODY$;

-- end of procedure to create and insert user 

-- exmple to test the userSave procedure 
CALL public.userSave(
	NULL,
	'Collins Mutai',
	'Mutai',
	'mutai@yopmail.com',
	'123edrf',
	0
);
-- end of the test procedure 


-- PROCEDURE TO SEND USER EMAIL after sending a parcel
CREATE OR REPLACE PROCEDURE public.SendUserEmail(
	IN theId uuid DEFAULT NULL::uuid,
	IN theIsSent character varying DEFAULT NULL::character,
	IN isUpdating integer DEFAULT NULL::integer
)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF isUpdating = 1 THEN
		UPDATE public.users
		SET isSent = theIsSent
		WHERE id = theId;
	END IF;
END;
$BODY$
--  PROCEDURE TO SEND USER EMAIL after sending a parcel


-- SELECT ALL USERS 
CREATE OR REPLACE PROCEDURE public.selectAllUsers()
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN 
	SELECT * FROM public.users WHERE isDeleted = 'no';
END;
$body$
-- END OF SELECT ALL USERS 

-- select user 

-- CREATE OR REPLACE PROCEDURE public.selectAllUsers(
-- 	INOUT jsonOut json DEFAULT NULL::json 
-- )
-- LANGUAGE 'plpgsql'
-- AS $BODY$
-- BEGIN 
-- 	SELECT * FROM public.users;
-- 	RETURNING row_to_json(public.users.*)
--     INTO jsonOut;
-- END;
-- $BODY$;

-- end of select users 

-- example of calling selectusers 
CALL public.selectAllUsers();
-- end of example calling users 