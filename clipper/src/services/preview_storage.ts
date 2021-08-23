import { S3 } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import fs from "fs";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET;

if (!region || !bucket) {
  throw new Error(`AWS Region ${region}, AWS Bucket ${bucket}`);
}

const client = new S3({
  region,
  apiVersion: "2006-03-01",
});

const getUrlForObject = (filename: string) =>
  `https://${bucket}.${region}.amazonaws.com/${filename}`;

const createPreviewsBucket = async () => {
  const buckets = await client.listBuckets({});

  const previewsBucket = buckets.Buckets?.find(
    (bucket) => bucket.Name === bucket
  );

  console.log("buckets", buckets);

  if (previewsBucket) {
    console.log("Bucket already exists");
  } else {
    await client.createBucket({
      Bucket: bucket,
    });

    console.log("bucket created");
  }
};

const createLifecyclePolicy = async () => {
  try {
    await client.putBucketLifecycleConfiguration({
      Bucket: bucket,
      LifecycleConfiguration: {
        Rules: [
          {
            Expiration: { Days: 1 },
            Filter: { Prefix: "" },
            Status: "Enabled",
          },
        ],
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const initPreviewsStorage = async () => {
  try {
    await createPreviewsBucket();
    await createLifecyclePolicy();
  } catch (e) {
    console.error(e);
  }
};

export const uploadPreview = async (path: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, async (err, data) => {
      if (err) return reject(err);

      const ext = path.split(".").pop();

      const filename = nanoid(24) + "." + ext;

      try {
        await client.putObject({
          ACL: "public-read",
          Bucket: bucket,
          Key: filename,
          Body: data,
        });

        resolve(getUrlForObject(filename));
      } catch (e) {
        return reject(e);
      }
    });
  });
};
