# Spec Delta

## Purpose

Lets a reader share their streak as an image in a feed post or a story, which invites friends to read too.

## ADDED Requirements

### Requirement: Share card image
The system SHALL draw a PNG share card in two sizes: post, 1080×1350, and story, 1080×1920. The card SHALL show the streak's flame, the streak number, "ngày liền đọc Lời Chúa" ("days in a row in God's Word" in English), a 30-day grid of the last 30 days with read days filled, the verse Thi-thiên 119:105, the date, and moingaymotdoan.xyz. It SHALL use the site's paper, ink and accent colors and the site fonts.

#### Scenario: Story card
- **WHEN** the reader with a 24-day streak asks for the story card
- **THEN** a 1080×1920 PNG is made with the Đèn dầu flame, "24", and the last 30 days filled where read

### Requirement: Share or save
Sharing SHALL use the system share sheet with the PNG file when the browser can share files, and SHALL otherwise download the PNG as `moingaymotdoan-<streak>-ngay.png`. A cancelled share SHALL do nothing more.

#### Scenario: Phone with a share sheet
- **WHEN** the reader taps share on a phone that can share files
- **THEN** the share sheet opens with the PNG attached

#### Scenario: Desktop without file sharing
- **WHEN** the reader taps share on a browser that cannot share files
- **THEN** the PNG downloads

### Requirement: Size choice
Wherever the share button appears, the reader SHALL be able to choose between the post card and the story card before sharing.

#### Scenario: Choose post
- **WHEN** the reader picks "Bài đăng"
- **THEN** the 1080×1350 card is shared
