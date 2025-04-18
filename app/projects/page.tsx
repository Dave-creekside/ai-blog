import { getProjects } from "../actions/project-actions"
import { ProjectsClientPage } from "@/components/projects-client-page"

export default async function ProjectsPage() {
  // Fetch projects on the server
  const projects = await getProjects()

  // Pass the data to a client component
  return <ProjectsClientPage projects={projects} />
}
