# File Changer React

## Dev Setup

Install dependencies with `pnpm install`

Add environment variables file `touch .env` in the root dir and add the following (values provided by team)
```
VITE_AWS_BUCKET_NAME=<BUCKET_NAME>
VITE_AWS_REGION=<REGION>
VITE_AWS_POOL_ID=<POOL_ID>
VITE_AWS_API_URL=<API_URL>
```

Run dev with `pnpm run dev`



### Dependencies

- @aws-sdk/client-s3
  - Used to upload input file to amazon s3 bucket

- @aws-sdk/credential-providers
  - Used to authenticate with aws s3 client

- Tailwind and Flowbite
  - Used for prebuilt html components

- dotenv
  - Used for stashing environment variables relating to aws

## Info

This project was created using `pnpm create vite file-changer-react --template react-ts`, see package.json for version details.

Tailwind CSS files initialized with `npx tailwindcss init -p`