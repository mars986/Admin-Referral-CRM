"use client";

import { useState } from "react";
import type { FileRecord } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function FilesManager({ initialFiles }: { initialFiles: FileRecord[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [ownerType, setOwnerType] = useState("contact");
  const [ownerId, setOwnerId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function upload() {
    if (!selectedFile) {
      return;
    }

    const data = new FormData();
    data.set("ownerType", ownerType);
    data.set("ownerId", ownerId);
    data.set("file", selectedFile);

    const response = await fetch("/api/files", {
      method: "POST",
      body: data,
    });
    const payload = (await response.json()) as { data?: { id?: string; key?: string } };
    if (payload?.data?.id) {
      const fileId = payload.data.id;
      const fileKey = payload.data.key ?? "";
      setFiles((current) => [
        {
          id: fileId,
          owner_type: ownerType,
          owner_id: ownerId,
          bucket_key: fileKey,
          filename: selectedFile.name,
          content_type: selectedFile.type,
          file_size: selectedFile.size,
          uploaded_by_user_id: null,
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
      setSelectedFile(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>R2 Uploads</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input value={ownerType} onChange={(event) => setOwnerType(event.target.value)} placeholder="Owner type" />
          <Input value={ownerId} onChange={(event) => setOwnerId(event.target.value)} placeholder="Owner id" />
          <Input type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
          <Button onClick={upload}>Upload File</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Bucket Key</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{file.owner_type}:{file.owner_id}</TableCell>
                  <TableCell className="max-w-[260px] truncate">{file.bucket_key}</TableCell>
                  <TableCell>{Math.round(file.file_size / 1024)} KB</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
