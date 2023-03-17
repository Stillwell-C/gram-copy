import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase";
import "./reportModal.scss";

const ReportModal = ({ setShowReportModal, reportDistinction, reportId }) => {
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [reportReason, setReportReason] = useState(null);
  const [additionalComments, setAdditionalComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    if (!reportReason) {
      setError(true);
      setErrMsg("Please choose a reason for making a report");
      return;
    }
    if (additionalComments.length > 2200) {
      setError(true);
      setErrMsg("Comments too long. Please write less than 2,200 characters.");
      return;
    }
    const reportContent = {
      reportType: reportDistinction,
      reportId: reportId,
      reportReason: reportReason,
      additionalComments: additionalComments,
      date: serverTimestamp(),
    };

    try {
      await setDoc(doc(collection(db, "reports")), reportContent);
      setShowReportModal(false);
    } catch (err) {
      setError(true);
      setErrMsg(err.code);
    }
  };

  return (
    <>
      <div className='report-modal-container'>
        <div className='report-modal-body'>
          <div className='modal-header'>
            <div></div>
            <div className='header-text-div'>
              <h2>
                {`Report ${
                  reportDistinction.slice(0, 1).toUpperCase() +
                  reportDistinction.slice(1)
                }`}
              </h2>
            </div>
            <div className='close-div'>
              <button
                onClick={() => setShowReportModal(false)}
                aria-label='click to close'
              >
                &times;
              </button>
            </div>
          </div>
          <div className='modal-form'>
            <form onSubmit={handleSubmit}>
              <div className='error-div'>{error && errMsg}</div>
              <div className='reason-div'>
                <h4>Why are you reporting this {reportDistinction}?</h4>
                <div className='button-div'>
                  <button
                    type='button'
                    onClick={() => setReportReason("spam/scam")}
                    className={`${reportReason === "spam/scam" && "active"}`}
                  >
                    Spam or Scam
                  </button>
                </div>
                <div className='button-div'>
                  <button
                    type='button'
                    onClick={() => setReportReason("hateful/abusive")}
                    className={`${
                      reportReason === "hateful/abusive" && "active"
                    }`}
                  >
                    Hateful or Abusive Content
                  </button>
                </div>
                <div className='button-div'>
                  <button
                    type='button'
                    onClick={() => setReportReason("inappropriate")}
                    className={`${
                      reportReason === "inappropriate" && "active"
                    }`}
                  >
                    Inappropriate Content
                  </button>
                </div>
              </div>
              <h4 className='textarea-header'>
                {"Additional comments (optional)"}
              </h4>
              <textarea
                id='additional-comments'
                name='additional-comments'
                className='additional-comments-textarea'
                value={additionalComments}
                onChange={(e) => {
                  setAdditionalComments(e.target.value);
                }}
                maxLength='2200'
                placeholder='Write additional comments...'
                aria-label='Add additional comments. Max length 2200 characters.'
              ></textarea>
              <button className='submit-button' type='submit'>
                Submit Report
              </button>
            </form>
          </div>
        </div>
      </div>
      <div
        className='report-modal-overlay'
        aria-label='click to close modal'
        onClick={() => setShowReportModal(false)}
      ></div>
    </>
  );
};

export default ReportModal;
