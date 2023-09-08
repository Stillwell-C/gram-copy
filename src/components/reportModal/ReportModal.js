import React, { useRef, useState } from "react";
import "./reportModal.scss";
import { useMutation } from "react-query";
import { addReport } from "../../features/reports/reportsApiRoutes";
import FocusTrapModalParent from "../FocusTrapModalParent";

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

    // try {
    //   await setDoc(doc(collection(db, "reports")), reportContent);
    //   setShowReportModal(false);
    // } catch (err) {
    //   setError(true);
    //   setErrMsg(err.code);
    // }
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
      className='report-modal-container'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <div className='report-modal-body'>
        <div className='modal-header'>
          <div></div>
          <div className='header-text-div'>
            <h2 id='dialog-header'>
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
            {error && (
              <div className='error-div' ref={errRef}>
                {errMsg}
              </div>
            )}
            <div className='reason-div'>
              <h4>Why are you reporting this {reportDistinction}?</h4>
              <ul>
                <li className='button-li'>
                  <button
                    type='button'
                    onClick={handleScamSpam}
                    className={`${reportReason === "spam/scam" && "active"}`}
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
                  >
                    Inappropriate Content
                  </button>
                </li>
              </ul>
            </div>
            <div className='textarea-div'>
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
            <button className='submit-button' type='submit'>
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
