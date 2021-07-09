/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@arcblock/ux/lib/Button';

export default function NotificationButton({ type, data, actions, children }) {
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const sendNotification = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setMessage(null);

    axios
      .post('api/notification', {
        data: {
          type,
          content: data,
          actions,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setMessage({ variant: 'success', text: 'Message has been sent!', salt: data.salt });
      })
      .catch((err) => {
        setLoading(false);
        setMessage({ variant: 'error', text: err.response ? err.response.statusText : err.message });
      });
  };

  return (
    <>
      <Button
        disabled={loading}
        variant="contained"
        color="primary"
        size="large"
        target="_blank"
        onClick={() => sendNotification()}
        className="action">
        {children}
      </Button>
      {!!message && <Typography component="p">{message.text} sn: {message.salt}</Typography>}
    </>
  );
}

NotificationButton.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
  actions: PropTypes.array,
  children: PropTypes.any.isRequired,
};

NotificationButton.defaultProps = {
  actions: [],
  data: {},
};
