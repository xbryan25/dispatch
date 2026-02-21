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

import { useUpdateUserProfilePicture } from '@/hooks/useAuth';

import { FormEvent } from 'react';

import { toast } from 'sonner';

import { validateImageFile } from '@/lib/validation';

import { ChangeEvent } from 'react';

export default function ChangeProfilePictureDialog() {
  const { patchUserProfilePicture } = useUpdateUserProfilePicture();

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
      await patchUserProfilePicture(selectedImage);
      toast.success('Profile update is successful!');
    } else {
      toast.error('No image is currently selected.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="material-symbols:image" className="size-4" />
          Change profile picture
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>Update your profile image below.</DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <div className="w-full max-w-md">
              <form onSubmit={(e) => updateUserProfilePicture(e)} className="flex flex-col gap-5">
                <FieldGroup className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Field className="flex flex-col gap-1">
                      <FieldLabel htmlFor="fullName">New Profile Picture</FieldLabel>

                      <div className="flex flex-col gap-2">
                        <Input
                          id="profile_picture"
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileChange}
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
