SELECT
  member.dob
FROM wlapp
  JOIN contacts ON wlapp.con_key = contacts.con_key
  JOIN member ON contacts.con_ref = member.house_ref
WHERE u_novalet_ref = @biddingNumber