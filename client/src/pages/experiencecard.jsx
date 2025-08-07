function ExperienceCard({ username, role, company, experience, createdAt }) {
  return (
    <div className="border rounded p-4 shadow-md bg-white my-4">
      <h2 className="text-xl font-semibold">{role}</h2>
      <p className="text-gray-600">{company}</p>
      <p className="my-2">{experience}</p>
      <p className="text-sm text-gray-500">{createdAt}</p>
      <p className="text-sm text-gray-500">By {username}</p>
    </div>
  );
}

export default ExperienceCard;
