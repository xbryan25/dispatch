export type UserCategory = 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';

export type ActionCategory =
  | 'createNewRequestAction'
  | 'cancelRequestAction'
  | 'acceptAction'
  | 'rejectAction'
  | 'unfriendAction'
  | 'reconnectRequestAction';
