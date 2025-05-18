interface Props {
  text: string;
}
export default function ErrorMessage({ text }: Props) {
  return <span className="text-red-500">{text}</span>;
}
