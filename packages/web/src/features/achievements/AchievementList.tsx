import { AchievementDto, formatNumber } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';
import AchievementsEditModal from './AchievementEditModal';

const AchievementList: React.FC = () => {
  const { achievements } = useAppSelector(achievementSelector);
  const achievementService = new AchievementService();
  const [loading, setLoading] = useState(false);
  const [editAchievement, setEditAchievement] = useState<AchievementDto>();

  useEffect(() => {
    achievementService.load();
  }, []);

  const closeModal = () => {
    setEditAchievement(undefined);
  };

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    achievementService.delete(e.currentTarget.id).then((success) => {
      setLoading(false);
      if (success) {
        toast.success('Achievement deleted successfully.');
      } else {
        toast.error('Achievement could not be deleted');
      }
    });
  };

  const editHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const achievement = achievements.find((a) => a.id === e.currentTarget.id);
    if (achievement) {
      setEditAchievement(achievement);
    }
  };

  return (
    <div className="w-1/2 mx-auto">
      <Header>Achievements</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Cooldown</TableColumn>
          <TableColumn>Repeatable</TableColumn>
          <TableColumn>Edit</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {achievements.map((a: AchievementDto) => (
            <TableRow key={a.id}>
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell>{formatNumber(a.achievementPoints)} pts</TableCell>
              <TableCell>{formatNumber(a.cooldownMinutes)} min</TableCell>
              <TableCell>Unsupported</TableCell>
              <TableCell className="text-center">
                <EditButton id={a.id} onClick={editHandler} />
              </TableCell>
              <TableCell className="text-center">
                <TrashButton id={a.id} onClick={trashHandler} loading={loading} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editAchievement && (
        <AchievementsEditModal achievementId={editAchievement.id} showModal={true} closeModal={closeModal} />
      )}
    </div>
  );
};

export default AchievementList;