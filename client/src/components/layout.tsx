import { Navbar } from "./navbar";

export default function Layout(props: any) {
  return (
    <>
      <Navbar />
      <div className="mt-14">{props.children}</div>
    </>
  );
}
