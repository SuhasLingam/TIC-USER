import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <div>
          Heyyy
        </div>
      </main>
    </HydrateClient>
  );
}
