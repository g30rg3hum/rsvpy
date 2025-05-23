interface Props {
  name: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date | null;
}
export default function EventItem({
  name,
  description,
  location,
  startTime,
  endTime,
}: Props) {
  return (
    <div className="card w-[450px] bg-base-100 shadow-xs border border-base-300">
      <div className="card-body">
        <h2 className="card-title font-extrabold">{name}</h2>
        <div className="space-y-2">
          <p>{description}</p>
          <p>
            <b>Held at:</b> {location}
          </p>
          <p>
            <b>Times:</b> {startTime.toLocaleString()}{" "}
            {endTime && `- ${endTime.toLocaleString()}`}
          </p>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary w-full">Manage</button>
        </div>
      </div>
    </div>
  );
}
