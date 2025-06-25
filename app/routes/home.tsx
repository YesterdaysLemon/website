import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "test" },
    { name: "description", content: "test" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto bg-background">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-primary rounded-lg p-4 w-1/2">
          <h1>Hello World</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
          <button className="rounded-lg p-4">Click me</button>
        </div>  
      </div>
    </div>
  );
}
