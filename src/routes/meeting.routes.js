const { Router } = require("express");
const MeetingController = require("../controllers/meeting.controller");

const router = Router();
const meeting = new MeetingController();

router.post("/generate-token",  meeting.generateAgoraToken);

module.exports = router;
