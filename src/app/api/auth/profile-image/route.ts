import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { connectDB } from "@/lib/mongodb";
import { getSessionPublicUser } from "@/lib/get-session-user";
import { User } from "@/models/User";
import { toPublicUser } from "@/lib/user-public";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionPublicUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Image upload is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cus-interview/profile-photos",
          public_id: `user_${sessionUser.id}_${Date.now()}`,
          transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult as UploadApiResponse);
        }
      );
      uploadStream.end(buffer);
    });

    await connectDB();
    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { $set: { profileImageUrl: result.secure_url } },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      url: result.secure_url,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("profile-image", error);
    return NextResponse.json(
      { error: "Failed to upload profile photo." },
      { status: 500 }
    );
  }
}
