import { notificationTableColumns, Notification } from '@/columns/notificationTableColumns';
import { DataTable } from '@/components/ui/data-table';

function getData(): Notification[] {
  // Fetch data from your API here.

  return [
    {
      notificationId: '728ed52f',
      message: 'test',
      type: 'Friend Request',
      date: new Date(),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
  ];
}

export default function NotificationsPage() {
  const data = getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={notificationTableColumns} data={data} />
    </div>
  );
}
