/**
 * API class for SCORM 1.2
 */
export default class Scorm12API {
    /**
     * Constructor for SCORM 1.2 API
     * @param {object} settings
     */
    constructor(settings: object);

    LMSInitialize: () => string;
    LMSFinish: () => string;
    LMSGetValue: (CMIElement: string) => string;
    LMSSetValue: (CMIElement: string, value: any) => string;
    LMSCommit: () => string;
    LMSGetLastError: () => string;
    LMSGetErrorString: (CMIErrorCode: string) => string;
    LMSGetDiagnostic: (CMIErrorCode: string) => string;
    /**
     * lmsInitialize function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */
    lmsInitialize(): string;
    /**
     * LMSFinish function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */
    lmsFinish(): string;
    /**
     * LMSGetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @return {string}
     */
    lmsGetValue(CMIElement: string): string;
    /**
     * LMSSetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */
    lmsSetValue(CMIElement: string, value: any): string;
    /**
     * LMSCommit function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */
    lmsCommit(): string;
    /**
     * LMSGetLastError function from SCORM 1.2 Spec
     *
     * @return {string}
     */
    lmsGetLastError(): string;
    /**
     * LMSGetErrorString function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */
    lmsGetErrorString(CMIErrorCode: string): string;
    /**
     * LMSGetDiagnostic function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */
    lmsGetDiagnostic(CMIErrorCode: string): string;
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */
    setCMIValue(CMIElement: string, value: any): string;
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */
    getCMIValue(CMIElement: string): any;
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {*} value
     * @param {boolean} foundFirstIndex
     * @return {object}
     */
    getChildElement(CMIElement: string, value: any, foundFirstIndex: boolean): object;
    /**
     * Validates Correct Response values
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {boolean}
     */
    validateCorrectResponse(CMIElement: string, value: any): boolean;
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {*} errorNumber
     * @param {boolean} detail
     * @return {string}
     */
    getLmsErrorMessageDetails(errorNumber: any, detail: boolean): string;
    /**
     * Replace the whole API with another
     *
     * @param {Scorm12API} newAPI
     */
    replaceWithAnotherScormAPI(newAPI: Scorm12API): void;
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */
    renderCommitCMI(terminateCommit: boolean): object | any[];
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */
    storeData(terminateCommit: boolean): string;
}
