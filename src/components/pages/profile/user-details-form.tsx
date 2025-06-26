"use client";

import ErrorMessage from "@/components/reusables/error-message";
import { User } from "@/lib/db/types";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

export type UserDetailsFormData = {
  firstName: string;
  lastName: string;
  profilePicture?: FileList;
};
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  profilePicture: yup
    .mixed<FileList>()
    .test("fileSize", "The file is too large (max size is 1MB)", (fileList) => {
      if (!fileList) return true;

      // check that the file size is at most 1MB
      if (fileList && fileList.length > 0) {
        return fileList[0].size <= 1024 * 1024;
      }
    }),
});

interface Props {
  userEmail: string;
}
export default function UserDetailsForm({ userEmail }: Props) {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [pfpVersion, setPfpVersion] = useState(0); // to force re-render when pfp changes];

  // getting the user details (id, first/lastName, email) from db)
  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await fetch(`/api/users?email=${userEmail}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setUserDetails(data);
      } else {
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [userEmail]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (userDetails) {
        // id is defined
        const res = await fetch(`/api/s3/${userDetails.id}`, {
          method: "GET",
        });

        if (res.ok) {
          setProfilePictureUrl(
            `https://rsvpy.s3.eu-north-1.amazonaws.com/profile-pictures/${userDetails.id}`
          );
        } else {
          setProfilePictureUrl(null);
        }
      }
    };

    fetchProfilePicture();
  }, [userDetails]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (userDetails) {
      reset({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      });
    }
  }, [userDetails, reset]);

  const onSubmit = handleSubmit(async (data: UserDetailsFormData) => {
    const toastId = toast.loading("Updating your details...");

    const { firstName, lastName, profilePicture } = data;

    const profilePictureFile = profilePicture ? profilePicture[0] : null;

    // if userDetails is null, don't do anything
    if (!userDetails) {
      toast.error(
        "Failed to update your details. We could not find your account. Please try again."
      );
      return;
    }

    // create form data to send to the endpoint
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }

    const res = await fetch(`/api/users/${userDetails.id}`, {
      method: "PUT",
      body: formData,
    });

    toast.dismiss(toastId);

    if (res.ok) {
      toast.success("Your details have been updated successfully.");

      reset({
        firstName,
        lastName,
        profilePicture,
      });

      if (profilePictureFile) {
        setPfpVersion((prev) => prev + 1);
      }
    } else {
      toast.error("Error encountered when trying to update your details.");
    }
  });

  return (
    <>
      <div className="flex justify-between gap-3 items-center">
        <div>
          <h2 className="card-title font-extrabold mb-3">
            <UserCircleIcon className="size-8" /> Your account
          </h2>

          <p>
            <b>Email address: </b>
            {userEmail}
          </p>
        </div>
        <div
          className="avatar rounded-full w-14 h-14 sm:w-18 sm:h-18 border border-base-100 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              profilePictureUrl
                ? `${profilePictureUrl}?=v${pfpVersion}`
                : "/images/sample-pfp.png"
            })`,
          }}
        />
      </div>

      <form className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <fieldset className="fieldset w-full sm:w-1/2">
            <legend className="fieldset-legend">First name *</legend>
            <input
              {...register("firstName")}
              className="w-full input"
              placeholder="John"
            />
            {errors.firstName?.message && (
              <ErrorMessage text={errors.firstName.message} />
            )}
          </fieldset>
          <fieldset className="fieldset w-full sm:w-1/2">
            <legend className="fieldset-legend">Last name *</legend>
            <input
              {...register("lastName")}
              className="w-full input"
              placeholder="Doe"
            />
            {errors.lastName?.message && (
              <ErrorMessage text={errors.lastName.message} />
            )}
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Profile picture</legend>
          <input
            {...register("profilePicture")}
            className="w-full file-input"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
          {errors.profilePicture?.message && (
            <ErrorMessage text={errors.profilePicture.message} />
          )}
        </fieldset>

        <div className="flex justify-end w-full mt-4 sm:mt-2">
          <button
            className="btn btn-primary text-right w-full sm:w-max"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
