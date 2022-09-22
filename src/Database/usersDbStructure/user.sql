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


-- example of calling selectusers 
CALL public.selectAllUsers();
-- end of example calling users 


-- procedure to soft delete user 
CREATE OR REPLACE PROCEDURE public.DeleteParcel(
	IN userId uuid DEFAULT NULL::uuid

)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	UPDATE public.users
	SET isdeleted = 'yes' WHERE id::character = userId::character;
END;
$BODY$
-- end of procedure to soft delete user 

-- end of stored procedure to soft delete user
CALL public.DeleteParcel('1a548da1-3f5f-4575-b7dc-e1a179ceaef4');
-- example calling procedure to perform soft user


-- function to check if the username exists 
CREATE OR REPLACE FUNCTION GetUserByUsername(
	IN theUsername character DEFAULT NULL::character
)
RETURNS  JSON
LANGUAGE SQL
AS $$
	select array_to_json(array_agg(row_to_json(u)))
	from(
		SELECT id, email, username FROM public.users WHERE username = theUsername
	) u;
$$;
-- efo function to check is the username exists 

-- example running the function sheck username 
SELECT public.GetUserByUsername('Daniel Maina')
-- example running the function sheck username 

-- function to check if the email already exists 
CREATE OR REPLACE FUNCTION GetUserByEmail(
	IN theUserEmail character DEFAULT NULL::character
)
RETURNS  JSON
LANGUAGE SQL
AS $$
	select array_to_json(array_agg(row_to_json(u)))
	from(
		SELECT email FROM public.users WHERE email= theUserEmail
	) u;
$$;
-- end of the function to check if the username exists 

-- example running the function sheck email
SELECT public.GetUserByEmail('example@example.com')
-- example running the function sheck email


-- get single user by username 
CREATE OR REPLACE FUNCTION GetUserByUsername(
	IN theusername character DEFAULT NULL::character
)
RETURNS  JSON
LANGUAGE SQL
AS $$
	select array_to_json(array_agg(row_to_json(u)))
	from(
		SELECT id,username,password ,role FROM public.users WHERE username= theusername
	) u;
$$;
-- end of getting single user by username 

-- example calling the funcion get sing username 
SELECT public.GetUserByUsername('Danchiwaz')
-- end of example to get single username 

-- function to get all parcels where username is the receiver 
CREATE OR REPLACE FUNCTION GetSingleUserParcelAsReceiver(
	IN theusername character DEFAULT NULL::character
)
RETURNS  JSON
LANGUAGE SQL
AS $$
	select array_to_json(array_agg(row_to_json(u)))
	from(
		SELECT * FROM public.parcels WHERE receiver= theusername
	) u;
$$;
-- end of the function to get all parcels where username is the receiver 

-- example running the function to get all parcels where username is the receiver
SELECT public.GetSingleUserParcelAsReceiver('Kamau Kamatu')
-- example running the function to get all parcels where username is the receiver


-- function to get all parcels where username is the sender 
CREATE OR REPLACE FUNCTION GetSingleUserParcelAsSender(
	IN theusername character DEFAULT NULL::character
)
RETURNS  JSON
LANGUAGE SQL
AS $$
	select array_to_json(array_agg(row_to_json(u)))
	from(
		SELECT * FROM public.parcels WHERE sender= theusername
	) u;
$$;
-- end of the function to get all parcels where username is the sender 

-- getting all parcels 
CREATE OR REPLACE FUNCTION GetSingleUserParcelAsSender(
	IN theusername character DEFAULT NULL::character
)
RETURNS  JSON
LANGUAGE SQL
AS $$
	select array_to_json(array_agg(row_to_json(u)))
	from(
		SELECT * FROM public.parcels WHERE sender= theusername OR receiver= theusername
	) u;
$$;
-- end of getting all parcels 