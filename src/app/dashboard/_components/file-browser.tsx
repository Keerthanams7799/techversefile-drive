"use client";

import { useOrganization, useUser } from "@clerk/nextjs";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UploadButton } from "@/app/dashboard/_components/upload-button";
import { SearchBar } from "@/app/dashboard/_components/search-bar";
import { FileCard } from "@/app/dashboard/_components/file-card";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly } : "skip"
  );
  const isLoading = files === undefined;

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading your files...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>
          {files.length === 0 && <Placeholder />}

          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return (
                <FileCard
                  favorites={favorites ?? []}
                  key={file._id}
                  file={file}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}