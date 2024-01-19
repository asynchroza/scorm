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
        fetch(`/api/session?userId=${this.userId}&courseName=${this.courseName}`).then(session => {
            session.json().then(
                (json) => {
                    window.API.loadFromJSON(json.cmi);
                }
            )
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
            const exit = () => {
                this.onExit();
                window.API.LMSTerminate();
            }

            window.API.on("LMSSetValue.cmi.core.exit", exit);
        }

        window.API.on("LMSSetValue.cmi.*", function () {
            window.API?.storeData();
        })
    }

    private initializeCoreVariables() {
        window.API.cmi.core.comments = this.courseName;
        window.API.cmi.core.student_id = this.userId;
    }

    public initialize() {
        this.initializeApiOnWindow();
        this.loadSession();
        this.initializeLmsEventListeners();
        this.initializeCoreVariables();
    }
}
