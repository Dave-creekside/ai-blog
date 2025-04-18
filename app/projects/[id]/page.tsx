import { getProjectById } from "@/app/actions/project-actions"
import { ProjectDetailPage } from "@/components/project-detail-page"
import { notFound } from "next/navigation"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailPage project={project} />
}
