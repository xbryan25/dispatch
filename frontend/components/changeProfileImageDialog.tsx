'use client';

import { Input } from '@/components/ui/input';

import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Icon } from '@iconify/react';

import { useState } from 'react';

import { useUpdateUserProfileImage } from '@/hooks/useAuth';

import { FormEvent } from 'react';

import { toast } from 'sonner';

import { validateImageFile } from '@/lib/validation';

import { ChangeEvent } from 'react';
import LoadingSpinner from './loadingSpinner';

export default function ChangeProfileImageDialog() {
  const { patchUserProfileImage, loading: patchUserProfileImageLoading } =
    useUpdateUserProfileImage();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSuccessfulUpdate, setIsSuccessfulUpdate] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const { isValid, error } = validateImageFile(file);

    if (!isValid) {
      toast.error(error);
      e.target.value = '';
      return;
    }

    setSelectedImage(file);
  };

  const updateUserProfilePicture = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(selectedImage);

    if (selectedImage) {
      setIsSuccessfulUpdate(true);

      await patchUserProfileImage(selectedImage);

      setIsOpen(false);
      toast.success('Profile update is successful!');
    } else {
      setIsSuccessfulUpdate(false);
      toast.error('No image is currently selected.');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
        setIsSuccessfulUpdate(false);
      }}
    >
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium"
          onClick={() => setIsOpen(true)}
        >
          <Icon icon="material-symbols:image" className="size-4" />
          Change profile picture
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Profile Image</DialogTitle>
          <DialogDescription>Update your profile image below.</DialogDescription>
        </DialogHeader>

        {isSuccessfulUpdate && <LoadingSpinner />}

        {!isSuccessfulUpdate && (
          <div className="flex w-full gap-2 ">
            <div className="w-full max-w-md">
              <form onSubmit={(e) => updateUserProfilePicture(e)} className="flex flex-col gap-5">
                <FieldGroup className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Field className="flex flex-col gap-1">
                      <FieldLabel htmlFor="fullName">New Profile Image</FieldLabel>

                      <div className="flex flex-col gap-2">
                        <Input
                          id="profile_image"
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileChange}
                          disabled={patchUserProfileImageLoading}
                        />
                      </div>
                    </Field>
                  </div>

                  <Field orientation="horizontal">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer text-lg"
                      disabled={!selectedImage || patchUserProfileImageLoading}
                    >
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
