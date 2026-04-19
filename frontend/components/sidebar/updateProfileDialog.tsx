'use client';

import { Input } from '@/components/ui/input';

import { Button } from '../ui/button';
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

import { UserProfile } from '@/types/auth';

import { FormEvent } from 'react';

import { toast } from 'sonner';
import LoadingSpinner from '../shared/loadingSpinner';

import { cn } from '@/lib/utils';
import { Spinner } from '../ui/spinner';

import { useAuthStore } from '@/store/useAuthStore';

export default function UpdateProfileDialog() {
  const currentUserDetails = useAuthStore((state) => state.currentUserDetails);

  const retrieveUserDetails = useAuthStore((state) => state.getCurrentUserDetails);
  const retrieveUserDetailsLoading = useAuthStore((state) => state.getCurrentUserDetailsLoading);
  const retrieveUserDetailsError = useAuthStore((state) => state.getCurrentUserDetailsError);
  const retrieveUserDetailsIsRateLimited = useAuthStore(
    (state) => state.getCurrentUserDetailsIsRateLimited
  );

  const patchUserDetails = useAuthStore((state) => state.patchUserDetails);
  const patchUserDetailsLoading = useAuthStore((state) => state.patchUserDetailsLoading);
  const patchUserDetailsError = useAuthStore((state) => state.patchUserDetailsError);
  const patchUserDetailsIsRateLimited = useAuthStore(
    (state) => state.patchUserDetailsIsRateLimited
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSuccessfulUpdate, setIsSuccessfulUpdate] = useState<boolean>(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [oldDateOfBirth, setOldDateOfBirth] = useState<Date | undefined>(undefined);

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);

  const getUserDetails = async () => {
    await retrieveUserDetails();

    if (retrieveUserDetailsError != null) {
      toast.error(retrieveUserDetailsError);
      setIsOpen(false);
      return;
    } else if (retrieveUserDetailsIsRateLimited) {
      toast.error('You have made too many requests. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    setUserDetails(currentUserDetails);

    const birthDate = currentUserDetails?.dateOfBirth
      ? new Date(currentUserDetails.dateOfBirth.replace(/-/g, '/'))
      : undefined;
    setOldDateOfBirth(birthDate);
  };

  const updateUserDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await patchUserDetails({
      dateOfBirth,
      fullName,
      gender,
      username,
    });

    if (patchUserDetailsError != null) {
      toast.error('Profile update has failed.');
      setIsOpen(false);
      return;
    } else if (patchUserDetailsIsRateLimited) {
      toast.error('You have made too many requests. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    setIsSuccessfulUpdate(true);

    toast.success('Profile update is successful!');
  };

  const resetValues = () => {
    setDateOfBirth(undefined);
    setFullName('');
    setGender('');
    setUsername('');
  };

  const enableSaveButton =
    dateOfBirth !== undefined || fullName !== '' || gender !== '' || username !== '';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
        setIsSuccessfulUpdate(false);

        if (value) resetValues();
      }}
    >
      <DialogTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1 bg-white dark:bg-stone-900  rounded-md p-2 font-medium',
            retrieveUserDetailsIsRateLimited || patchUserDetailsIsRateLimited
              ? 'cursor-not-allowed text-stone-400'
              : ' hover:bg-stone-200 dark:hover:bg-stone-700  cursor-pointer'
          )}
          onClick={getUserDetails}
          disabled={retrieveUserDetailsIsRateLimited || patchUserDetailsIsRateLimited}
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
        </DialogHeader>

        {(retrieveUserDetailsLoading || isSuccessfulUpdate) && <LoadingSpinner />}

        {!retrieveUserDetailsLoading && !isSuccessfulUpdate && (
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
                              placeholder={`${userDetails?.gender[0]?.toUpperCase()}${userDetails?.gender.slice(1).replaceAll('_', ' ')}`}
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
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="justify-start font-normal"
                            >
                              {dateOfBirth
                                ? dateOfBirth.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : oldDateOfBirth
                                  ? oldDateOfBirth.toLocaleDateString('en-US', {
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })
                                  : 'Select a date'}
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
                                setIsCalendarOpen(false);
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
                    <Button
                      type="submit"
                      className="w-full cursor-pointer text-lg"
                      disabled={!enableSaveButton || patchUserDetailsLoading}
                    >
                      {patchUserDetailsLoading && <Spinner />}
                      Save changes
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
