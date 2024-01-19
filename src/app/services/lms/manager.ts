/* eslint-disable */
// @ts-nocheck

export default class LMSManager {
    userId: string;
    courseName: string;
    constructor(userId: string, courseName: string) {
        this.userId = userId;
        this.courseName = courseName;
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
        // window.API.on("LMSSetValue.cmi.core.lesson_status", function (_, value) {
        //     if (value === "success" || value === "failed") {
        //         console.log("Commiting results...", value);
        //     }
        // });

        window.API.on("LMSSetValue.cmi.*", function () {
            window.API?.storeData();
        })
    }

    private initializeCoreVariables() {
        window.API?.setCMIValue("cmi.comments", this.courseName)
        window.API?.setCMIValue("cmi.core.student_id", this.userId)
    }

    public initialize() {
        this.initializeApiOnWindow();
        this.initializeCoreVariables();
        this.initializeLmsEventListeners();
    }
}
