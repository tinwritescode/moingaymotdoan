-- The reader's marks row, locked until the transaction ends, so two devices merging at once queue up.
-- @param {String} $1:userId
SELECT rest_days, restarted_on, remind_hour FROM streak_marks WHERE user_id = $1 FOR UPDATE;
