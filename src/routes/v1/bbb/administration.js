const axios = require('axios');
const bodyParser = require('body-parser');
const router = require('express-promise-router')();

const { bbb } = rootRequire('bbb/module');

const api = bbb.api;
const http = bbb.http;

const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

const route = '/administration';

/**
 * {
 *   name:            [meeting name]
 *   meetingId:       [meeting Id]
 *   attendeePW:      [Attendee password]
 *   moderatorPW:     [Moderator password]
 *   welcome:         [Chat welcome message]
 *   dialNumber:      [Cell phone access number]
 *   voiceBridge:     [FreeSWITCH voice conference number]
 *   maxParticpants:  [Maximum number of participants]
 *   logoutURL:       [Redirct URL after logout]
 *   record:          [Enable/disable meeting record]
 *   duration:        [Meeting maximum duration]
 *
 *   isBreakout:      [true for a breakout room]
 *   parentMeetingId: [Top-level meeting id of the breakout room]
 *   sequence:        [Breakout room sequence number]
 *   freeJoin:        [true allows user to have a choice of breakout room to join]
 *
 *   meta:                    [Meeting metadata]
 *   moderatorOnlyMessage:    [Moderator only chat message]
 *   autoStartRecording:      [true will instruct to start recording on first user join]
 *   allowStartStopRecording: [Allow users to start/stop recordings]
 *   webcamsOnlyForModerator: [Users webcams are only seeing by moderators]
 *   logo:                    [Default logo in Flash client]
 *   bannerText:              [Banner text]
 *   bannerColor:             [Banner background color]
 *   copyright:               [Copyright text]
 *   muteOnStart:             [Mute all users on meeting start]
 *   allowModsToUnmuteUsers:  [Allow moderators to unmute users]
 *
 *   lockSettingsDisableCam:              [true will prevent users from sharing webcams]
 *   lockSettingsDisableMic:              [true will prevent users from sharing microphones]
 *   lockSettingsDisablePrivateChat:      [true will disable private chats]
 *   lockSettingsDisablePublicChat:       [true will disable public chat]
 *   lockSettingsDisableNote:             [true will disable notes]
 *   lockSettingsLockedLayout:            [true will lock meeting layout]
 *   lockSettingsLockOnJoin:              [false will disable applying settings]
 *   lockSettingsLockOnJoinConfigurable:  [true will allow applying lockSettingsLockOnJoin]
 *   guestPolicy:                         [Possible values: ALWAYS_ACCEPT, ALWAYS_DENY, ASK_MODERATOR]
 * }
 */

router.post(route + '/create', urlencodedParser, async (req, res, next) => {

	if (!req.body)
		return res.sendStatus(400);

	const b = req.body;

	// api module itself is responsible for constructing URLs
	let meetingCreateUrl = api.administration.create(b.meetingName, b.roomId, {
		duration: b.duration,
		attendeePW: b.attendeePW,
		moderatorPW: b.moderatorPW,
	});

	let meetingInfo = {};

	// http method should be used in order to make calls
	await http(meetingCreateUrl).then((result) => {

		let moderatorUrl = api.administration.join(b.moderator, b.roomId,
			b.moderatorPW);
		let attendeeUrl = api.administration.join(b.attendee, b.roomId,
			b.attendeePW);
		let meetingEndUrl = api.administration.end(b.roomId, b.moderatorPW);

		meetingInfo.attendeeUrl = attendeeUrl;
		meetingInfo.attendeePW = b.attendeePW;

		meetingInfo.moderatorUrl = moderatorUrl;
		meetingInfo.moderatorPW = b.moderatorPW;

		meetingInfo.meetingEndUrl = meetingEndUrl;
		meetingInfo.result = result;
	});

	await res.status(200).json(meetingInfo);
	// await res.status(418).json(req.body);
});

router.get(route, async (req, res, next) => {
	await res.sendStatus(402);
});

module.exports = router;