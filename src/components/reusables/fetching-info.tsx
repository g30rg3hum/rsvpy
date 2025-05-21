export default function FetchingInfo() {
  return (
    <div className="text-center space-y-2">
      <span className="loading loading-infinity loading-xl"></span>
      <h2 className="font-bold text-2xl">Fetching your account information</h2>
      <p>
        Please hold on while we get your events, attendees and other account
        information.
      </p>
    </div>
  );
}
