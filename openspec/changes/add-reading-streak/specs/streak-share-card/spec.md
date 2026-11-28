# Spec Delta

## Purpose

Lets a reader share their streak as an image in a feed post or a story, which invites friends to read too.

## ADDED Requirements

### Requirement: Share card image
The system SHALL draw a PNG share card in two sizes: post, 1080×1350, and story, 1080×1920. The card SHALL show the streak's flame, the streak number, "ngày liền đọc Lời Chúa" ("days in a row in God's Word" in English), a 30-day grid of the last 30 days with read days filled, the day's verse with its reference, the date, and moingaymotdoan.xyz. It SHALL use the site's paper, ink and accent colors and the site fonts.

#### Scenario: Story card
- **WHEN** the reader with a 24-day streak asks for the story card
- **THEN** a 1080×1920 PNG is made with the Đèn dầu flame, "24", and the last 30 days filled where read

### Requirement: Verse of the day
The card's verse SHALL come from a fixed list of short verses, each printed as the site's Bibles print it (Bản Truyền Thống in Vietnamese, BSB in English), whole or one whole clause, and short enough for two lines on the card. The verse SHALL be picked by a hash of the reader's account id and the local date, modulo the list's length, so a reader keeps one verse all day, the verse changes from day to day, and two readers usually differ on the same day. A guest SHALL get the pick for the date alone. Both languages SHALL show the same verse on the same day.

#### Scenario: Same day, same verse
- **WHEN** a signed-in reader makes a post card and later a story card on the same local day
- **THEN** both cards carry the same verse and reference

#### Scenario: Next day
- **WHEN** the same reader makes a card the next day
- **THEN** the verse is picked afresh and is usually a different one

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
- **THEN** a preview of the 1080×1350 card opens

### Requirement: Preview before sharing
Picking a size SHALL open a preview of that card's PNG. Nothing SHALL leave the device until the reader taps the preview's share button, labelled "Chia sẻ ảnh" when the browser can share files and "Tải ảnh" when it cannot. That button SHALL share or download the same PNG that was previewed, then close the preview. A cancelled share SHALL keep the preview open. Closing the preview SHALL share nothing.

#### Scenario: Look, then share
- **WHEN** the reader picks "Story"
- **THEN** a preview of the story card opens and nothing is shared yet
- **AND** tapping "Chia sẻ ảnh" opens the share sheet with that PNG

#### Scenario: Close without sharing
- **WHEN** the reader closes the preview
- **THEN** nothing is shared or downloaded
