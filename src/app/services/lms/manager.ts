/* eslint-disable */
// @ts-nocheck

export default class LMSManager {
    userId: string;
    constructor(userId: string) {
        this.userId = userId;

    }

    private initializeApiOnWindow() {
        window.API = new window.Scorm12API({
            lmsCommitUrl: "/api/session",
            autocommit: 5,
            alwaysSendTotalTime: true,
            selfReportSessionTime: true,
        });

        window.API.storeData(true);
    }

    private initializeLmsEventListeners() {
        window.API.on("LMSSetValue.cmi.core.lesson_status", function (_, value) {
            if (value === "success" || value === "failed") {
                console.log("Commiting results...", value);
            }
        });

        window.API.on("LMSSetValue.cmi.*", function () {
            window.API?.storeData();
        })
    }

    public initialize() {
        this.initializeApiOnWindow();
        window.API.cmi.core.student_id = this.userId;

        this.initializeLmsEventListeners();
    }
}