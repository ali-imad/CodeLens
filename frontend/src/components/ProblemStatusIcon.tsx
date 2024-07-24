import { ProblemStatus } from '../types';

const ProblemStatusIcon: React.FC<{
  status: ProblemStatus;
}> = ({ status }) => {
  let statusColor = 'text-gray-500';
  let statusIcon = '○';

  if (status === ProblemStatus.Attempted) {
    statusColor = 'text-yellow-500';
    statusIcon = '⟳';
  } else if (status === ProblemStatus.Completed) {
    statusColor = 'text-green-500';
    statusIcon = '✓';
  } else if (status === ProblemStatus.Error) {
    statusColor = 'text-red-500';
    statusIcon = '⚠';
  }

  return (
    <span className={`${statusColor} font-medium`}>
      {statusIcon} {status}
    </span>
  );
};

export default ProblemStatusIcon;
