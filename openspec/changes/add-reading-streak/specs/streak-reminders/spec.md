# Spec Delta

## Purpose

Reminds a reader, by a push notification they asked for, to read before their streak goes out, without nagging them more than once a day.

## ADDED Requirements

### Requirement: Opt in on a tap
The site SHALL ask for notification permission only when the reader taps "Nhắc tôi lúc 21:00" on the streak card, never on load. The button SHALL be hidden when the browser cannot receive push or the site has no push key. On an iPhone or iPad not opened as an installed app, the card SHALL instead say that reminders need the app installed and link to the install guide.

#### Scenario: Reader opts in
- **WHEN** the reader taps "Nhắc tôi lúc 21:00" and grants permission
- **THEN** the device is subscribed with reminder time 21:00, its time zone and language, and the card shows reminders on

#### Scenario: Permission denied
- **WHEN** the reader denies permission
- **THEN** nothing is subscribed and the card says that notifications are blocked in the browser settings

#### Scenario: iPhone in Safari
- **WHEN** the reader opens the site in Safari on iOS without installing it
- **THEN** the card links to the install guide instead of the button

### Requirement: Reminder settings
A subscribed reader SHALL be able to change the reminder time (on the hour from 06:00 to 23:00) and turn reminders off. Turning off SHALL remove the subscription on the server and in the browser.

#### Scenario: Change the time
- **WHEN** the reader picks 20:00
- **THEN** later reminders come at 20:00 local time

#### Scenario: Turn off
- **WHEN** the reader taps "Tắt nhắc"
- **THEN** the server forgets the subscription and no more reminders are sent

### Requirement: Device reports its reading
While subscribed, the device SHALL tell the server its last read date and its streak whenever either changes, so the server can decide without the reader's history. No reading content, account or chapter names SHALL be sent.

#### Scenario: Reading today
- **WHEN** a subscribed reader reads a đoạn
- **THEN** the server's record for that device has today as its last read date

### Requirement: Subscription endpoint validation
The server SHALL accept a subscription only with an https endpoint on a known push service (Google, Mozilla, Apple, Microsoft), both encryption keys, a valid IANA time zone, a reminder time on the hour from 06:00 to 23:00, a language of vi or en, a last read date in the YYYY-MM-DD format or none, and a whole-number streak of 0 or more. It SHALL reject anything else with 400.

#### Scenario: Unknown push host
- **WHEN** a subscription's endpoint is `https://example.com/push`
- **THEN** the server answers 400 and stores nothing

### Requirement: When to send
The server SHALL run every 15 minutes. For each subscription, in its time zone, it SHALL send at most one notification per local day:
- **Evening reminder**: at or after the reminder time, when the last read date is before today. With a streak above 0, the text names the streak at risk. With no streak, it invites the reader to read today.
- **Rescue**: at or after 08:00, when the last read date is the day before yesterday and the streak is above 0. The text says that yesterday's lamp was not lit and the streak can still be saved today.

It SHALL send nothing when the reader has read today. It SHALL delete a subscription the push service reports gone (404 or 410). It SHALL accept runs only from the platform scheduler.

#### Scenario: 21:00 without reading
- **WHEN** at 21:05 local time a subscription with streak 23 has last read yesterday
- **THEN** one notification is sent: "Đèn 23 ngày của bạn sẽ tắt lúc nửa đêm"

#### Scenario: Already reminded today
- **WHEN** the run at 21:20 finds the same subscription already sent today
- **THEN** nothing is sent

#### Scenario: Already read
- **WHEN** at 21:05 the last read date is today
- **THEN** nothing is sent

#### Scenario: Gone subscription
- **WHEN** the push service answers 410
- **THEN** the subscription is deleted

### Requirement: Notification click
Tapping a notification SHALL focus an open tab of the site and navigate it to the notification's page, or open a new window there. The page is the home page for each locale.

#### Scenario: Tap reminder
- **WHEN** the reader taps the evening reminder with no site tab open
- **THEN** the home page opens with the streak card
