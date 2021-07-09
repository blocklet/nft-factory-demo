/* eslint-disable arrow-parens */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Avatar from '@material-ui/core/Avatar';

import InfoRow from '@arcblock/ux/lib/InfoRow';
import Button from '@arcblock/ux/lib/Button';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tag from '@arcblock/ux/lib/Tag';
import DidAddress from '@arcblock/did-react/lib/Address';
import DidAuth from '@arcblock/did-react/lib/Auth';

import { useSessionContext } from '../libs/session';
import { getWebWalletUrl } from '../libs/util';

export default function Main() {
  const { session, api } = useSessionContext();
  const [user, setUser] = useState();
  const [buyOpen, setBuyOpen] = useState(false);
  const { t } = useLocaleContext();

  const getData = () => {
    api
      .get('/api/user')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getData();
  }, [session.user]); //eslint-disable-line

  const isLogin = !!session.user;

  let rows = [];
  if (user) {
    rows = [
      { name: t('name'), value: user.fullName },
      { name: t('avatar'), value: <Avatar alt="" src={user.avatar} /> },
      { name: t('did'), value: <DidAddress>{user.did}</DidAddress> },
      { name: t('email'), value: user.email },
      {
        name: t('role'),
        value: <Tag type={user.role === 'owner' ? 'success' : 'default'}>{user.role}</Tag>,
      },
      { name: t('lastLogin'), value: user.lastLoginAt },
      { name: t('createdAt'), value: user.createdAt },
    ].filter(Boolean);
  }

  const onAuthSuccess = () => {
    setBuyOpen(false);
  };

  return (
    <Container>
      <Media className="header">
        <div className="left">
          <div style={{ fontSize: 20 }}>NFT Factory Demo</div>
        </div>
        <div className="right">
          {isLogin && (
            <span style={{ top: 1, position: 'relative', marginRight: 6 }}>
              Hello,
              {session.user.fullName}
            </span>
          )}
          <Button onClick={() => (isLogin ? session.logout() : session.login())}>{isLogin ? 'Logout' : 'Login'}</Button>
        </div>
      </Media>

      {!user && (
        <div>
          <p>You are not logged in yet, please buy the VIP NFT to continue.</p>
          <Button color="primary" variant="contained" onClick={() => setBuyOpen(true)}>
            Buy VIP Now!
          </Button>
          {buyOpen && (
            <DidAuth
              responsive
              action="buy-vip"
              checkFn={api.get}
              onSuccess={onAuthSuccess}
              checkTimeout={5 * 60 * 1000}
              webWalletUrl={getWebWalletUrl()}
              disableClose
              messages={{
                title: t('buy.title'),
                scan: t('buy.scan'),
                confirm: t('buy.confirm'),
                success: t('buy.success'),
              }}
            />
          )}
        </div>
      )}

      {!!user && (
        <div style={{ marginTop: 40 }}>
          {rows.map((row) => {
            if (row.name === t('common.did')) {
              return (
                <InfoRow
                  valueComponent="div"
                  key={row.name}
                  nameWidth={120}
                  name={row.name}
                  nameFormatter={() => t('common.did')}>
                  {row.value}
                </InfoRow>
              );
            }

            return (
              <InfoRow valueComponent="div" key={row.name} nameWidth={120} name={row.name}>
                {row.value}
              </InfoRow>
            );
          })}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px;
  .header {
    padding: 20px 0;
    display: flex;
    align-items: center;
  }
`;

const Media = styled.div`
  display: flex;
  justify-content: space-between;
  .left {
    flex-shrink: 0;
    margin-right: 10px;
  }
  .body {
    flex-grow: 1;
  }
  .right {
    flex-shrink: 0;
    margin-left: 10px;
  }
`;
