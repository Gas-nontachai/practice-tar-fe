import { useState, type ChangeEvent } from "react";
import type { UploadedFile } from "@/types/upload";
import { uploadMultiple, uploadSingle } from "@/services/uploads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ExampleFile() {
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [singleUpload, setSingleUpload] = useState<UploadedFile | null>(null);
  const [multipleUploads, setMultipleUploads] = useState<UploadedFile[]>([]);
  const [singleLoading, setSingleLoading] = useState(false);
  const [multipleLoading, setMultipleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSingleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSingleFile(file);
    setSingleUpload(null);
  };

  const handleMultipleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setMultipleFiles(files);
    setMultipleUploads([]);
  };

  const handleSingleUpload = async () => {
    if (!singleFile) {
      setError("Please select a file for single upload.");
      return;
    }
    try {
      setError(null);
      setSingleLoading(true);
      const uploaded = await uploadSingle(singleFile);
      setSingleUpload(uploaded);
      console.log(uploaded);
    } catch {
      setError("Failed to upload the single file.");
    } finally {
      setSingleLoading(false);
    }
  };

  const handleMultipleUpload = async () => {
    if (multipleFiles.length === 0) {
      setError("Please select files for multiple upload.");
      return;
    }
    try {
      setError(null);
      setMultipleLoading(true);
      const uploaded = await uploadMultiple(multipleFiles);
      setMultipleUploads(uploaded);
      console.log(uploaded);
    } catch {
      setError("Failed to upload the selected files.");
    } finally {
      setMultipleLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">File Upload Example</h1>
        <p className="text-sm text-muted-foreground">
          Upload a single file or multiple files using the upload API.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="text-lg font-semibold">Single upload</h2>
            <p className="text-sm text-muted-foreground">
              Choose one file and upload it to the server.
            </p>
          </div>

          <Input
            type="file"
            onChange={handleSingleChange}
            className="file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
          />

          {singleFile ? (
            <div className="text-sm text-muted-foreground">
              Selected: {singleFile.name}
            </div>
          ) : null}

          <Button
            onClick={handleSingleUpload}
            disabled={singleLoading || !singleFile}
          >
            {singleLoading ? "Uploading..." : "Upload single file"}
          </Button>

          {singleUpload ? (
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">Uploaded file</p>
              <p>Filename: {singleUpload.filename}</p>
              <p>Original name: {singleUpload.originalName}</p>
              <p>Size: {singleUpload.size} bytes</p>
              <p>Mime type: {singleUpload.mimeType}</p>
              <p>Path: {singleUpload.path}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No file uploaded yet.
            </p>
          )}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <h2 className="text-lg font-semibold">Multiple upload</h2>
            <p className="text-sm text-muted-foreground">
              Choose multiple files and upload them together.
            </p>
          </div>

          <Input
            type="file"
            multiple
            onChange={handleMultipleChange}
            className="file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
          />

          {multipleFiles.length > 0 ? (
            <div className="text-sm text-muted-foreground">
              Selected: {multipleFiles.length} file(s)
            </div>
          ) : null}

          <Button
            onClick={handleMultipleUpload}
            disabled={multipleLoading || multipleFiles.length === 0}
          >
            {multipleLoading ? "Uploading..." : "Upload multiple files"}
          </Button>

          {multipleUploads.length > 0 ? (
            <div className="space-y-2">
              {multipleUploads.map((file) => (
                <div key={file.path} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{file.originalName}</p>
                  <p>Filename: {file.filename}</p>
                  <p>Size: {file.size} bytes</p>
                  <p>Mime type: {file.mimeType}</p>
                  <p>Path: {file.path}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No files uploaded yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExampleFile;
