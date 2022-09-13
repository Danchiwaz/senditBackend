-- create 
CREATE TABLE parcels(
	id uuid DEFAULT uuid_generate_v4(),
	sender VARCHAR(255) NOT NULL,
	receiver VARCHAR(255) NOT NULL,
	weight VARCHAR(255) NOT NULL,
	price INTEGER NOT NULL,
	fromlocation VARCHAR(255) NOT NULL,
	tolocation VARCHAR(255) NOT NULL,
	status VARCHAR(255) DEFAULT 'onDelivery',
  trackingNo VARCHAR(255) NOT NULL,
	isdeleted VARCHAR(255) DEFAULT 'no'
)
-- end of create 

-- procedure for creating and updating 
CREATE OR REPLACE PROCEDURE public.parcelSave(
    IN parcelId uuid DEFAULT NULL::uuid,
    IN thesender character varying DEFAULT NULL::character,
    IN thereceiver character varying DEFAULT NULL::character,
    IN theweight character DEFAULT NULL::character,
    IN theprice integer DEFAULT NULL::integer,
    IN thefromlocation json DEFAULT NULL::json,
    IN thetolocation json DEFAULT NULL::json,
    IN theTrackingNo character varying DEFAULT NULL::character,
    IN isUpdating integer DEFAULT NULL::integer,
    INOUT jsonOut json DEFAULT NULL::json
)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  IF  isUpdating = 0 THEN
      INSERT INTO public.parcels(
        sender,
        receiver,
        weight,
        price,
        fromlocation,
        tolocation,
        trackingNo
      )
      VALUES(
        thesender,
        thereceiver,
        theweight,
        theprice,
        thefromlocation,
        thetolocation,
        theTrackingNo
      )
      RETURNING row_to_json(public.parcels.*)
      INTO jsonOut;
  ELSE
      IF isUpdating = 1 THEN
         UPDATE public.parcels 
      SET
         sender = thesender,
         receiver = thereceiver,
         weight = theweight,
         price = theprice,
         fromlocation = thefromlocation,
         tolocation = thetolocation,
         trackingNo = thetrackingNo
      WHERE id =parcelId
      RETURNING row_to_json(public.parcels.*)
      INTO jsonOut;
      END IF;
  END IF;
END;
$BODY$;
-- end of procedure for inserting and creating 


-- CALLING THE PARCELS PROCEDURE 
CALL public.parcelSave(
	NULL,
	'Maina',
	'James',
	'12',
	24,
	'{"address":"Nakuru","latitude":"12","longitude":"32"}',
	'{"address":"Nakuru","latitude":"12","longitude":"32"}',
    'ADGVH35463FG',
	0
)
-- END OF THE CALLING PROCEDURE

-- updating using procedure --- Basically just add the id , this will check if the id exists
CALL public.parcelSave(
	'df439989-19ac-4677-a7a9-2edb2d2cba1c',
	'Maina',
	'Kamau',
	'12',
	24,
	'{"address":"Nakuru","latitude":"12","longitude":"32"}',
	'{"address":"Nakuru","latitude":"12","longitude":"32"}',
	1
)

-- end of updating parcel procedure


-- procedure to update status of parcel
CREATE OR REPLACE PROCEDURE public.changeParcelStatus(
	IN parcelId uuid DEFAULT NULL::uuid,
	IN theStatus character DEFAULT NULL::character,
	IN isUpdating integer DEFAULT NULL::integer
	
)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF isUpdating = 1 THEN
	    UPDATE public.parcels
		SET status=  theStatus
		WHERE id = parcelId;
		
	END IF;
END;
$BODY$

-- example executing store procedure to change the status of a parcel
CALL public.changeParcelStatus(
	'df439989-19ac-4677-a7a9-2edb2d2cba1c',
	'delivered',
	1
);
-- end example executing store procedure to change the status of a parcel



-- Begin of funtions 
-- function to get all parcels
CREATE OR REPLACE FUNCTION GetAllParcels() 
RETURNS parcels
LANGUAGE SQL
AS $$
SELECT * FROM public.parcels;
$$;
-- end of a funtion to get all the parcels 
SELECT GetAllParcels()
-- example of calling a function in postgres 
-- end of funtions 








-- store procedure to soft delete 

CREATE OR REPLACE PROCEDURE public.DeleteParcel(
	IN parcelId uuid DEFAULT NULL::uuid

)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	UPDATE public.parcels
	SET isdeleted = 'yes' WHERE id::character = parcelId::character;
END;
$BODY$
-- end of stored procedure to soft delete parcel 
CALL public.DeleteParcel('1a548da1-3f5f-4575-b7dc-e1a179ceaef4');
-- example calling procedure to perform soft delete 