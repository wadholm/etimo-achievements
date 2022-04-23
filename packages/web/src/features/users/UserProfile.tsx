import { uuid } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addQueryParam, queryParam, removeQueryParam } from '../../common/utils/query-helper';
import { EditButton } from '../../components/buttons';
import { Card, CardRow } from '../../components/cards';
import Header from '../../components/Header';
import { UserService } from './user-service';
import { profileSelector } from './user-slice';
import UserProfileEditModal from './UserProfileEditModal';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(profileSelector);
  const [monitor, setMonitor] = useState(uuid());
  const userService = new UserService();

  const getEditState = () => queryParam<string>(window.location, 'edit', '');

  useEffect(() => {
    userService.getProfile();
  }, [monitor]);

  if (!profile) return null;

  return (
    <div className="w-1/3 mx-auto">
      <Header>Profile</Header>
      <Card>
        <CardRow label="Name">
          {profile.name}
          <EditButton
            id={profile.id}
            link={addQueryParam(window.location, 'edit', 'true')}
            className="float-right px-0 mx-0"
          />
        </CardRow>
        <CardRow label="E-mail">{profile.email}</CardRow>
        <CardRow label="Slack handle">{profile.slackHandle}</CardRow>
      </Card>
      {getEditState() && (
        <UserProfileEditModal
          closeModal={() => {
            navigate(removeQueryParam(window.location, 'edit'));
            setMonitor(uuid());
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;
