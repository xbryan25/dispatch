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
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
    },
    {
      notificationId: '728ed52g',
      message: 'test2',
      type: 'System',
      date: new Date(1),
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
    <div className="flex min-h-screen gap-6 bg-zinc-200 dark:bg-stone-800 font-sans p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 min-h-screen min-w-0">
        <div className="flex justify-between w-full">
          <h2 className="font-bold text-2xl">Notifications</h2>
        </div>

        <DataTable columns={notificationTableColumns} data={data} />
      </div>
    </div>
  );
}
