'use client';

import { Input } from '@/components/ui/input';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Calendar } from '@/components/ui/calendar';

import { Icon } from '@iconify/react';

import { useState } from 'react';

import { useGetCurrentUserDetails, useUpdateCurrentUserDetails } from '@/hooks/useAuth';
import { UserProfile } from '@/types/auth';

import { FormEvent } from 'react';

import { toast } from 'sonner';

export default function UpdateProfileDialog() {
  const { retrieveUserDetails } = useGetCurrentUserDetails();
  const { patchUserDetails } = useUpdateCurrentUserDetails();

  const [open, setOpen] = useState<boolean>(false);
  const [oldDateOfBirth, setOldDateOfBirth] = useState<Date | undefined>(undefined);

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);

  const getUserDetails = async () => {
    const { data } = await retrieveUserDetails();

    setUserDetails(data);

    const birthDate = data?.dateOfBirth ? new Date(data.dateOfBirth.replace(/-/g, '/')) : undefined;
    setOldDateOfBirth(birthDate);
  };

  const updateUserDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await patchUserDetails({ dateOfBirth, fullName, gender, username });

    toast.success('Profile update is successful!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium"
          onClick={getUserDetails}
        >
          <Icon icon="material-symbols:person" className="size-4" />
          Update profile
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your details below. Changes take a moment to sync everywhere.
          </DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <div className="w-full max-w-md">
              <form onSubmit={(e) => updateUserDetails(e)} className="flex flex-col gap-5">
                <FieldGroup className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Field className="flex flex-col gap-1">
                      <FieldLabel htmlFor="fullName">Full Name</FieldLabel>

                      <div className="flex flex-col gap-2">
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName ?? undefined}
                          placeholder={userDetails?.fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </Field>

                    <Field className="flex flex-col gap-1">
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>

                      <div className="flex flex-col gap-2">
                        <Select
                          value={gender ?? undefined}
                          onValueChange={(value) => setGender(value)}
                        >
                          <SelectTrigger className="w-full max-w-full">
                            <SelectValue
                              placeholder={`${userDetails?.gender[0]?.toUpperCase()}${userDetails?.gender.slice(1)}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Gender</SelectLabel>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </Field>

                    <Field className="flex flex-col gap-1">
                      <FieldLabel htmlFor="birthDate">Birth Date</FieldLabel>

                      <div className="flex flex-col gap-2">
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="justify-start font-normal"
                            >
                              {oldDateOfBirth
                                ? oldDateOfBirth.toLocaleDateString('en-US', {
                                    month: 'long', // "October"
                                    day: 'numeric', // "12"
                                    year: 'numeric', // "2005"
                                  })
                                : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateOfBirth == undefined ? oldDateOfBirth : dateOfBirth}
                              defaultMonth={dateOfBirth == undefined ? oldDateOfBirth : dateOfBirth}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setDateOfBirth(date);
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </Field>

                    <Field className="flex flex-col gap-1">
                      <FieldLabel htmlFor="fullName">Username</FieldLabel>

                      <div className="flex flex-col gap-2">
                        <Input
                          id="username"
                          type="text"
                          value={username ?? undefined}
                          placeholder={userDetails?.username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </Field>
                  </div>

                  <Field orientation="horizontal">
                    <Button type="submit" className="w-full cursor-pointer text-lg">
                      Save changes
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
