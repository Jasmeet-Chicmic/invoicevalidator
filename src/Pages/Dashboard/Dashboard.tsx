import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  return <div>Dashboard{t('hello_world') || ''}</div>;
}
