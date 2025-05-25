import { getSessionThenEmail } from "@/lib/auth/utils";

export default async function EventPage() {
  const userEmail = await getSessionThenEmail("/events");

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Title</h1>
          <p className="text-sm text-gray-500">Date and location</p>
        </div>
        <div className="space-x-2">
          <button className="btn btn-sm btn-outline">Edit</button>
          <button className="btn btn-sm btn-error">Cancel</button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-base-100 p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Description</h2>
        <p>Description</p>
      </div>

      {/* Attendees */}
      <div className="bg-base-100 p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-4">Attendees</h2>
        <ul className="space-y-2">
          <li
            key={1}
            className="flex justify-between items-center border-b pb-2"
          >
            <span>Email</span>
            <span className={`badge`}>payment status</span>
          </li>
        </ul>
      </div>

      {/* Invite / Share */}
      <div className="bg-base-100 p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Invite others</h2>
        <div className="flex items-center gap-2">
          <input className="input input-bordered flex-1" />
          <button className="btn btn-primary btn-sm">Copy</button>
        </div>
      </div>
    </div>
  );
}
