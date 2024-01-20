/* eslint-disable */
// @ts-nocheck
export default class LMSManager {
    userId: string;
    courseName: string;
    onExit: () => void;

    constructor(userId: string, courseName: string, onExit: (() => void) = undefined) {
        this.userId = userId;
        this.courseName = courseName;
        this.onExit = onExit;
    }

    private loadSession() {
        fetch(`/api/session?userId=${this.userId}&courseName=${this.courseName}`)
        .then(body => body.json())
        .then((session) => {
            window.API.loadFromJSON(session.cmi);
        })
    }

    private initializeApiOnWindow() {
        window.API = new window.Scorm12API({
            lmsCommitUrl: "/api/session",
            alwaysSendTotalTime: true,
            selfReportSessionTime: true,
        });

        window.API.storeData(true);
    }

    private initializeLmsEventListeners() {
        if (this.onExit) {
            window.API.on("LMSSetValue.cmi.core.exit", this.onExit);
        }

        window.API.on("LMSSetValue.cmi.*", function () {
            window.API?.storeData();
        })
    }

    private initializeCoreVariables() {
        window.API?.setCMIValue("cmi.comments", this.courseName)
        window.API?.setCMIValue("cmi.core.student_id", this.userId)
    }

    public initialize() {
        window.API = undefined;
        this.loadSession();
        this.initializeApiOnWindow();
        this.initializeCoreVariables();
        this.initializeLmsEventListeners();
    }
}
