# Spec Delta

## Purpose

Shows the reader their streak where they start each day, nudges them before midnight, gives them a way back after a miss, and marks each finished day.

## ADDED Requirements

### Requirement: Home streak card
The home page SHALL show a streak card once the reading history is loaded on the device. It has one of four states, from the rules in `reading-streak`:
- **Today**: today is not read yet and it is before the reminder hour (21:00). It shows the streak and the flame, and links to the next đoạn.
- **At risk**: today is not read yet, the streak is above 0, and it is 21:00 or later. It shows the guttering flame, a countdown to midnight, the next đoạn and the short readings.
- **Rescue**: it shows the flame gone out, the streak that can be saved, and the three choices (Thắp lại, Ngày Sa-bát when available, Bắt đầu lại). The reader keeps the record whichever they choose.
- **Done**: today is read. It shows the lit flame for the streak's milestone, the next milestone's progress, and a share button.

#### Scenario: Evening without reading
- **WHEN** the reader has a 23-day streak, has not read today, and opens the home page at 21:15
- **THEN** the card shows the guttering flame, the time left until midnight counting down, and links to the next đoạn and to Thi-thiên 117 and Thi-thiên 23

#### Scenario: Morning after a miss
- **WHEN** the reader is in rescue and opens the home page
- **THEN** the card shows the flame out, "Thắp lại" with the 2 đoạn to read, "Dùng ngày Sa-bát" when it is available, and "Bắt đầu lại từ ngày 1"

#### Scenario: Choose the rest day
- **WHEN** the reader taps "Dùng ngày Sa-bát"
- **THEN** yesterday becomes a rest day and the card moves to the Today state with the saved streak

#### Scenario: New reader
- **WHEN** the reader has never read a đoạn
- **THEN** the card invites them to read their first đoạn today, with streak 0

### Requirement: Week strip
The card SHALL show the current week, Monday to Sunday, marking each day as read, rest, rekindled, missed, today, or still to come.

#### Scenario: Rest day in the week
- **WHEN** Wednesday was a rest day
- **THEN** Wednesday shows the rest mark, not the missed mark

### Requirement: Short readings
The At-risk and Rescue states SHALL offer the short readings Thi-thiên 117 (2 câu) and Thi-thiên 23 (6 câu), and each SHALL count like any other đoạn.

#### Scenario: Read a short psalm
- **WHEN** at 22:00 the reader opens Thi-thiên 117 from the card
- **THEN** today becomes a read day and the streak goes on

### Requirement: Done sheet
When the reader marks a đoạn complete and it is their first completion that day, the chapter page SHALL show a done sheet. It shows the ignite animation, the streak, a "Mốc mới" badge when the streak is exactly a milestone, the next milestone's progress, and buttons to share and to close.

#### Scenario: First completion of the day
- **WHEN** the reader marks Giăng 3 complete and nothing else was completed today
- **THEN** the done sheet opens with the streak and the flame

#### Scenario: Second completion of the day
- **WHEN** the reader marks another đoạn complete the same day
- **THEN** no done sheet opens

#### Scenario: Milestone reached
- **WHEN** the completion makes the streak exactly 7
- **THEN** the sheet shows the badge "Mốc mới" with Đèn dầu

### Requirement: Flame animations
Each flame SHALL be animated: a lit loop, an ignite one-shot that then plays the loop, a guttering loop for At risk, and a going-out one-shot for Rescue, which ends with no flame. Each flame SHALL show its static drawing before the animation loads, when it cannot load, and when the reader prefers reduced motion. Flames are decorative and SHALL be hidden from screen readers, and the text next to them carries the meaning.

#### Scenario: Reduced motion
- **WHEN** the reader's system asks for reduced motion
- **THEN** flames show the static drawing and do not animate

#### Scenario: Offline
- **WHEN** the animation file cannot be fetched
- **THEN** the static drawing stays
