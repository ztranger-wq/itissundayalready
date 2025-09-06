import React from 'react';

const Comments = ({ comments, setComments }) => {
  return (
    <div className="customization-option comments">
      <label htmlFor="comments">Comments (optional)</label>
      <textarea
        id="comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        rows="3"
        placeholder="Add any additional comments or instructions here"
      />
    </div>
  );
};

export default Comments;
