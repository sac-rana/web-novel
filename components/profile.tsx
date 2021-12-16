interface ProfileInfo {
  authorName: string;
}

export default function Profile({ profileInfo }: { profileInfo: ProfileInfo }) {
  console.log(profileInfo);
  return (
    <div>
      <h1>{profileInfo.authorName}</h1>
    </div>
  );
}
