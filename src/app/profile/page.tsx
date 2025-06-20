/* eslint-disable @next/next/no-img-element */
import PageWrapper from "@/components/layout/page-wrapper";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default async function ProfilePage() {
  const userEmail = await getSessionThenEmail("/profile");

  return (
    <PageWrapper centerHorizontally>
      <div className="mx-2 sm:mx-4 w-full max-w-[650px]">
        <div className="card card-border bg-base-200 shadow-xs border border-base-100 w-full">
          <div className="relative card-body">
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
              <img
                className="avatar rounded-full w-14 h-14 sm:w-18 sm:h-18 border border-base-100"
                src="/images/portrait.png"
                alt="Avatar"
              />
            </div>

            <form>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <fieldset className="fieldset w-full sm:w-1/2">
                  <legend className="fieldset-legend">First name</legend>
                  <input
                    // {...register("name")}
                    className="w-full input"
                    placeholder="John"
                  />
                  {/* {errors.name?.message && (
                  <ErrorMessage text={errors.name.message} />
                )} */}
                </fieldset>
                <fieldset className="fieldset w-full sm:w-1/2">
                  <legend className="fieldset-legend">Last name</legend>
                  <input
                    // {...register("name")}
                    className="w-full input"
                    placeholder="Doe"
                  />
                  {/* {errors.name?.message && (
                  <ErrorMessage text={errors.name.message} />
                )} */}
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Profile picture</legend>
                <input
                  // {...register("bio")}
                  className="w-full file-input"
                  type="file"
                />
                {/* {errors.bio?.message && (
                <ErrorMessage text={errors.bio.message} />
              )} */}
              </fieldset>

              <div className="flex justify-end w-full mt-5">
                <button className="btn btn-primary text-right w-full sm:w-max">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
