# Spec Delta

## Purpose

Defines how the site counts a reader's daily streak of reading one đoạn, how one missed day can be recovered, and which flame a streak earns.

## ADDED Requirements

### Requirement: A day counts when a đoạn is read
The system SHALL count a calendar day, in the reader's local time zone, as read when the reading history holds at least one đoạn (chapter) log for that day. Mood guide logs SHALL NOT count.

#### Scenario: Chapter read today
- **WHEN** the history has a chapter log dated today
- **THEN** today is a read day

#### Scenario: Only a mood guide today
- **WHEN** the history has only a mood guide log dated today
- **THEN** today is not a read day

### Requirement: Streak length
The streak SHALL be the number of read days in the unbroken chain of covered days that ends today, or yesterday when today is not read yet. A covered day is a read day, a rest day, or a rekindled day. Rest days and rekindled days SHALL keep the chain unbroken but SHALL NOT add to the count.

#### Scenario: Three days in a row
- **WHEN** the reader read on the day before yesterday, yesterday and today
- **THEN** the streak is 3

#### Scenario: Today not read yet
- **WHEN** the reader read on the 3 days before today and not yet today
- **THEN** the streak is 3 and today is still open

#### Scenario: Rest day in the chain
- **WHEN** the reader read on day 1, rested on day 2 and read on day 3 (today)
- **THEN** the streak is 2

### Requirement: Rekindle a missed day
A missed day SHALL become a rekindled day when the reader reads at least 2 different đoạn on the next day. Only a single missed day can be rekindled; two missed days in a row break the chain.

#### Scenario: Two đoạn the day after a miss
- **WHEN** the reader read for 23 days, missed yesterday, and read 2 different đoạn today
- **THEN** the streak is 24

#### Scenario: One đoạn the day after a miss
- **WHEN** the reader read for 23 days, missed yesterday, and read 1 đoạn today
- **THEN** the streak is still in rescue, and the reader needs 1 more đoạn today

#### Scenario: Two missed days
- **WHEN** the reader missed the last 2 days and reads 2 đoạn today
- **THEN** the old chain is broken and the streak is 1

### Requirement: Rest day (Ngày Sa-bát)
The reader SHALL be able to mark yesterday as a rest day while it is missed and the chain before it is unbroken. At most one rest day SHALL be allowed per week, Monday to Sunday, counted by the week of the rested day.

#### Scenario: Use the week's rest day
- **WHEN** yesterday was missed, the chain before it is 23 days, and no rest day was used that week
- **THEN** the reader can mark yesterday as rest and the streak stays 23

#### Scenario: Rest day already used this week
- **WHEN** the reader already rested on another day of yesterday's week
- **THEN** marking yesterday as rest is not offered

### Requirement: Rescue state
When today is not rekindled, yesterday is missed, and the chain before yesterday has at least 1 read day, the streak SHALL be in rescue for all of today. Rescue SHALL report the streak that can be saved, how many more đoạn today rekindles it, and whether a rest day is available. When the day ends unrescued, the chain is broken.

#### Scenario: Morning after a miss
- **WHEN** the chain before yesterday is 23 days, yesterday has no read, and today has no read
- **THEN** the state is rescue with 23 days to save, 2 đoạn needed and a rest day available

#### Scenario: Rescue window closes
- **WHEN** a further day passes without rekindling or resting
- **THEN** the streak is 0 or counts only from the next read

### Requirement: Start over
The reader SHALL be able to dismiss a rescue for today. After that, today SHALL NOT show the rescue state, and the streak SHALL count only from today.

#### Scenario: Restart then read
- **WHEN** the reader in rescue chooses to start over and then reads 1 đoạn today
- **THEN** the streak is 1

### Requirement: Record
The system SHALL report the record: the longest streak the history has ever reached under the same rules, including the current one.

#### Scenario: Record kept after a break
- **WHEN** the reader once had a 40-day streak and now has 3
- **THEN** the record is 40

### Requirement: Milestones and flames
Each streak length SHALL earn the flame of the highest milestone it has reached: 1 Ngọn nến, 7 Đèn dầu, 30 Ngọn đuốc, 100 Chân đèn bảy nhánh, 200 Bụi gai cháy, 365 Trụ lửa. The system SHALL also report the next milestone and the days left to reach it, or none after 365.

#### Scenario: Day 23
- **WHEN** the streak is 23
- **THEN** the flame is Đèn dầu and the next milestone is Ngọn đuốc at 30, 7 days left

#### Scenario: Reaching a milestone
- **WHEN** the streak becomes exactly 30
- **THEN** the flame is Ngọn đuốc and the day is marked as a new milestone

#### Scenario: Past the last milestone
- **WHEN** the streak is 400
- **THEN** the flame is Trụ lửa and there is no next milestone

### Requirement: Marks follow a signed-in reader
For a signed-in reader, rest days, the last restart and the reminder hour SHALL be kept with their account and merged with each device's copy, so every device shows the same streak. A merge SHALL never drop a rest day, except a second one in the same week; the later restart SHALL win. A guest's marks SHALL join the account on sign-in.

#### Scenario: Rest on the phone, open the laptop
- **WHEN** a signed-in reader rests a missed day on their phone and then opens the site on their laptop
- **THEN** the laptop shows the streak kept, not the rescue state

#### Scenario: A guest signs in
- **WHEN** a guest with a rest day on 2026-11-28 signs in to an account that has a rest day on 2026-11-10 and reminder hour 20
- **THEN** the account and the device both hold both rest days, and the device's reminder hour becomes 20

