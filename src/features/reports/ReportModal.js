import React, { useRef, useState } from "react";
import { useMutation } from "react-query";

import { addReport } from "./reportsApiRoutes";
import FocusTrapModalParent from "../../components/FocusTrapModalParent";

import "../../scss/reportModal.scss";

const ReportModal = ({ setShowReportModal, reportDistinction, reportId }) => {
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [reportReason, setReportReason] = useState(null);
  const [additionalComments, setAdditionalComments] = useState("");

  const errRef = useRef();

  const submitReportMutation = useMutation({
    mutationFn: addReport,
    onSuccess: () => {
      setReportReason(null);
      setAdditionalComments("");
      setShowReportModal(false);
    },
    onError: () => {
      setError(true);
      setErrMsg(submitReportMutation?.error?.response?.data?.message);
      errRef.current.focus();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrMsg("");
    if (!reportReason) {
      setError(true);
      setErrMsg("Please select a reason for the report");
      return;
    }
    if (additionalComments.length > 2200) {
      setError(true);
      setErrMsg("Comments too long. Please write less than 2,200 characters.");
      return;
    }
    const reportContent = {
      reportType: reportDistinction.toUpperCase(),
      reportReason: reportReason,
      additionalComments: additionalComments,
    };
    if (reportDistinction.match(/post/i)) {
      reportContent.reportedPost = reportId;
    }
    if (reportDistinction.match(/user/i)) {
      reportContent.reportedUser = reportId;
    }
    submitReportMutation.mutate(reportContent);
  };

  const handleScamSpam = () => {
    if (reportReason === "spam/scam") {
      setReportReason("");
      return;
    }
    setReportReason("spam/scam");
  };

  const handleHatefulAbusive = () => {
    if (reportReason === "hateful/abusive") {
      setReportReason("");
      return;
    }
    setReportReason("hateful/abusive");
  };

  const handleInappropriate = () => {
    if (reportReason === "inappropriate") {
      setReportReason("");
      return;
    }
    setReportReason("inappropriate");
  };

  const handleClose = () => {
    setShowReportModal(false);
  };

  const content = (
    <div
      className='report-modal-container modal-body'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <div className='report-modal-body flex-container flex-column flex-align-center width-100 height-100'>
        <div className='modal-header width-100 flex-container flex-align-center flex-justify-center'>
          <div></div>
          <div className='header-text-div flex-container flex-align-center flex-justify-center'>
            <h2 id='dialog-header'>
              {`Report ${
                reportDistinction.slice(0, 1).toUpperCase() +
                reportDistinction.slice(1)
              }`}
            </h2>
          </div>
          <div className='close-div flex-container flex-align-center'>
            <button
              onClick={() => setShowReportModal(false)}
              aria-label='click to close'
              className='transparent-button'
            >
              &times;
            </button>
          </div>
        </div>
        <div className='modal-form flex-container flex-column flex-align-center width-100'>
          <form
            onSubmit={handleSubmit}
            className='flex-container flex-column flex-align-center width-100'
          >
            {error && (
              <div className='error-div' ref={errRef}>
                {errMsg}
              </div>
            )}
            <div className='reason-div flex-container flex-column flex-align-center width-100'>
              <h3>Why are you reporting this {reportDistinction}?</h3>
              <ul>
                <li className='button-li'>
                  <button
                    type='button'
                    onClick={handleScamSpam}
                    className={`${reportReason === "spam/scam" && "active"}`}
                    aria-label='report post for spam or a scam'
                    aria-pressed={reportReason === "spam/scam"}
                  >
                    Spam or Scam
                  </button>
                </li>
                <li className='button-li'>
                  <button
                    type='button'
                    onClick={handleHatefulAbusive}
                    className={`${
                      reportReason === "hateful/abusive" && "active"
                    }`}
                    aria-label='report post for hateful or abusive'
                    aria-pressed={reportReason === "hateful/abusive"}
                  >
                    Hateful or Abusive Content
                  </button>
                </li>
                <li className='button-li'>
                  <button
                    type='button'
                    onClick={handleInappropriate}
                    className={`${
                      reportReason === "inappropriate" && "active"
                    }`}
                    aria-label='report post for inappropriate content'
                    aria-pressed={reportReason === "inappropriate"}
                  >
                    Inappropriate Content
                  </button>
                </li>
              </ul>
            </div>
            <div className='textarea-div flex-container flex-column flex-align-center'>
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
              <span
                className='textarea-count'
                aria-label='length of additional comments'
              >
                {additionalComments.length} / 2200
              </span>
            </div>
            <button
              className='submit-button standard-button blue-button'
              type='submit'
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <FocusTrapModalParent
      content={content}
      handleClose={handleClose}
      showClose={false}
    />
  );
};

export default ReportModal;
