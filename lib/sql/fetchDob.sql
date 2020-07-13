SELECT wlmember.dob
FROM wlapp
  JOIN wlmember ON wlapp.app_ref = wlmember.app_ref
WHERE u_novalet_ref = @biddingNumber
