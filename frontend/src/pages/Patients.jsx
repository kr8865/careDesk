import ResourcePage from '../components/ResourcePage.jsx';
import { shortId } from '../utils.js';

const fields = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'age', label: 'Age', type: 'number', required: true },
  { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'], required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'address', label: 'Address' },
  { name: 'medicalHistory', label: 'Medical history', type: 'textarea', wide: true },
];

const columns = [
  { key: 'id', label: 'ID', render: (x) => <span title={x.id}>#{shortId(x.id)}</span> },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender', render: (p) => p.gender[0].toUpperCase() + p.gender.slice(1) },
  { key: 'phone', label: 'Phone' },
  { key: 'medicalHistory', label: 'Medical history' },
];

export default function Patients() {
  return <ResourcePage title="Patients" intro="Only you can see the patients you add." endpoint="/patients" listKey="patients" itemKey="Patient" fields={fields} columns={columns} />;
}
