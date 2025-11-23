import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 5_000_000) {
    return NextResponse.json(
      { error: "File size exceeds 5MB limit" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "dinner_app",
          transformation: [
            { width: 1200, height: 800, crop: "limit", format: "webp" }
          ],
        },
        (error, result) => {
          if (error) {
            resolve(
              NextResponse.json({ error: error.message }, { status: 500 })
            );
          } else {
            resolve(NextResponse.json({ url: result?.secure_url }));
          }
        }
      )
      .end(buffer);
  });
}

