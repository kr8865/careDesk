import ResourcePage from '../components/ResourcePage.jsx';
import { shortId } from '../utils.js';
import { useAuth } from '../AuthContext.jsx';

const fields = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'specialization', label: 'Specialization', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'experienceYears', label: 'Experience (years)', type: 'number', default: 0 },
];

const columns = [
  { key: 'id', label: 'ID', render: (x) => <span title={x.id}>#{shortId(x.id)}</span> },
  { key: 'name', label: 'Name' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'email', label: 'Email' },
  { key: 'experienceYears', label: 'Experience', render: (d) => `${d.experienceYears} yrs` },
];

export default function Doctors() {
  const { user } = useAuth();
  return <ResourcePage title="Doctors" intro="Doctors are shared across all users. You can edit only the ones you added." endpoint="/doctors" listKey="doctors" itemKey="Doctor" fields={fields} columns={columns} canEdit={(d) => d.createdBy === user.id} />;
}
